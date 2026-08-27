#!/usr/bin/env python3
"""Validate the human sound recordings and import them into the app.

Takes the raw takes from recordings/raw/ (written by the recording rig), and
for each one: picks the cleanest burst out of the three the reader was asked to
say, trims it, normalises loudness, applies short fades, validates it, encodes
it as .m4a into audio/s/, and registers it in the manifest's `snd` section with
its duration in ms (the app uses the duration to time tile highlights).

Validation is strict because a bad sound clip teaches the wrong thing:

  * energy: peak and audible-time floors — a whispered stop fails here
  * duration bounds by type: a stop should be a short burst (~60-450 ms after
    trimming); a held continuant or vowel should be longer (250 ms - 2.5 s).
    A stop that comes out LONG usually means a vowel got tacked on ("buh") —
    flagged for re-recording, not shipped.

Nothing is written unless the clip passes. Failures are listed with the reason
so the re-record session is targeted.

  python3 tools/import_sounds.py             # import everything new/changed
  python3 tools/import_sounds.py --dry-run
  python3 tools/import_sounds.py --only b d g
"""
import argparse
import json
import os
import subprocess
import sys
import tempfile
import wave

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Keep ALL scratch files inside the project — never the system temp dir.
_WORK = os.path.join(ROOT, '.work', 'tmp')
os.makedirs(_WORK, exist_ok=True)
tempfile.tempdir = _WORK

RAW = os.path.join(ROOT, 'recordings', 'raw')
OUT = os.path.join(ROOT, 'audio', 's')
SR = 22050

# duration bounds (seconds) after trimming, by sound type
BOUNDS = {
    'stop':  (0.05, 0.45),
    'glide': (0.05, 0.60),
    'cont':  (0.25, 2.50),
    'vowel': (0.25, 2.50),
    'glued': (0.25, 1.50),
    'chunk': (0.15, 2.00),
}


def read_wav_22k(path):
    wav = tempfile.mktemp(suffix='.wav')
    r = subprocess.run(['afconvert', '-f', 'WAVE', '-d', f'LEI16@{SR}', '-c', '1',
                        path, wav], capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError('afconvert decode failed: ' + r.stderr[:150])
    with wave.open(wav, 'rb') as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16)
    os.unlink(wav)
    if len(a) == 0:
        raise RuntimeError('decoded to zero samples — empty or truncated WAV')
    return a.astype(np.float32)


def bursts(a, min_gap=0.18, min_len=0.04):
    """Split a take into voiced bursts separated by silence.

    The reader says the sound three times; this finds each utterance. The
    threshold adapts to BOTH the take's peak and its measured noise floor —
    a fixed peak ratio merged all three repetitions into one long burst
    whenever the room was noisy, and the merged clip could pass validation.
    """
    a = a - float(np.mean(a))   # a DC offset makes every window read as loud
    peak = float(np.max(np.abs(a))) or 1.0
    win = int(SR * 0.01)
    env0 = np.array([np.abs(a[i:i + win]).max() for i in range(0, max(1, len(a) - win), win)])
    floor = float(np.percentile(env0, 10)) if len(env0) else 0.0
    thresh = max(peak * 0.08, floor * 4.0)
    env = env0
    loud = env > thresh
    spans, start = [], None
    gap_need = int(min_gap / 0.01)
    quiet = 0
    for i, l in enumerate(loud):
        if l:
            if start is None:
                start = i
            quiet = 0
        elif start is not None:
            quiet += 1
            if quiet >= gap_need:
                spans.append((start, i - quiet + 1))
                start, quiet = None, 0
    if start is not None:
        # walk the trailing quiet back off the final span — otherwise a take
        # that ends within the gap window carries ~0.17s of dead air
        end = len(loud)
        while end > start and not loud[end - 1]:
            end -= 1
        spans.append((start, end))
    out = []
    for s, e in spans:
        if (e - s) * 0.01 >= min_len:
            out.append(a[max(0, s * win - int(SR * 0.015)):
                         min(len(a), e * win + int(SR * 0.03))])
    return out


def pick_best(cands):
    """Prefer the middle take (first is often tentative, last rushed), then
    the loudest, so a session doesn't need perfect discipline."""
    if not cands:
        return None
    if len(cands) >= 3:
        mid = cands[1:-1]
        return max(mid, key=lambda c: float(np.max(np.abs(c))))
    return max(cands, key=lambda c: float(np.max(np.abs(c))))


def condition(a):
    peak = float(np.max(np.abs(a))) or 1.0
    a = a * (27000.0 / peak)
    n = min(int(SR * 0.006), len(a) // 3)
    if n > 0:
        ramp = np.linspace(0, 1, n)
        a = a.copy()
        a[:n] *= ramp
        a[-n:] *= ramp[::-1]
    return a


def internal_pause(raw):
    """A real pause INSIDE the picked burst means two repetitions got merged
    (noisy room) — the clip would teach '/m/ ... /m/' as one sound."""
    win = int(SR * 0.01)
    if len(raw) < win * 8:
        return False
    env = np.array([np.abs(raw[i:i + win]).max()
                    for i in range(0, len(raw) - win, win)])
    quiet = env < (float(np.max(env)) * 0.10)
    # ignore the edges; look for >=0.15s of quiet in the middle
    run = 0
    for q in quiet[2:-2]:
        run = run + 1 if q else 0
        if run >= 15:
            return True
    return False


def validate(raw, stype):
    """Judge the picked burst BEFORE normalisation. Loudness has to be checked
    on the raw take — normalising first would boost a whisper (plus all its
    room noise) to full volume and let it slip through."""
    dur = len(raw) / SR
    lo, hi = BOUNDS.get(stype, (0.05, 2.5))
    if dur < lo:
        return f'too short ({dur:.2f}s < {lo}s) — likely clipped or too quiet'
    if dur > hi:
        if stype == 'stop':
            return (f'too long for a stop ({dur:.2f}s > {hi}s) — probably has '
                    f'an "uh" tacked on; re-record clipped')
        return f'too long ({dur:.2f}s > {hi}s)'
    peak = float(np.max(np.abs(raw)))
    if peak < 4000:
        return (f'too quiet (peak {peak:.0f} < 4000) — move closer to the mic '
                f'and speak up')
    audible = float(np.sum(np.abs(raw) > peak * 0.15)) / SR
    if audible < 0.03:
        return f'almost silent ({audible:.3f}s audible)'
    clipped = float(np.mean(np.abs(raw) >= 32000))
    if clipped > 0.005:
        return (f'distorted — {clipped:.1%} of samples at full scale; '
                f'move back from the mic or lower the input level')
    if stype in ('cont', 'vowel', 'glued') and internal_pause(raw):
        return ('a pause inside the take — two repetitions merged, probably '
                'background noise; re-record somewhere quieter')
    return None


def write_m4a(a, out_path):
    wav = out_path + '.tmp.wav'
    with wave.open(wav, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(np.clip(a, -32000, 32000).astype(np.int16).tobytes())
    r = subprocess.run(['afconvert', '-f', 'm4af', '-d', 'aac', '-b', '64000',
                        wav, out_path], capture_output=True, text=True)
    os.unlink(wav)
    if r.returncode != 0:
        raise RuntimeError('afconvert encode failed: ' + r.stderr[:150])
    if not os.path.exists(out_path) or os.path.getsize(out_path) < 500:
        raise RuntimeError('encode produced no usable file')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--only', nargs='*', default=None)
    args = ap.parse_args()

    script = json.load(open(os.path.join(ROOT, 'tools', 'recording-script.json')))
    types = {sid: s['type'] for sid, s in script['sounds'].items()}

    man_path = os.path.join(ROOT, 'audio', 'manifest.json')
    manifest = json.load(open(man_path))
    snd = manifest.setdefault('snd', {})

    raws = sorted(f[:-4] for f in os.listdir(RAW) if f.endswith('.wav')) \
        if os.path.isdir(RAW) else []
    if args.only:
        raws = [r for r in raws if r in set(args.only)]
    if not raws:
        print('no recordings in recordings/raw/ — run "Record Sounds.command" first')
        return 1

    os.makedirs(OUT, exist_ok=True)
    ok, bad = [], []
    for sid in raws:
        stype = types.get(sid, 'chunk')
        try:
            take = read_wav_22k(os.path.join(RAW, sid + '.wav'))
        except RuntimeError as e:
            bad.append((sid, str(e)))
            continue
        cand = pick_best(bursts(take))
        if cand is None:
            bad.append((sid, 'no audible sound found in the take'))
            continue
        err = validate(cand, stype)
        if err:
            bad.append((sid, err))
            continue
        clip = condition(cand)
        rel = f's/{sid}.m4a'
        if not args.dry_run:
            write_m4a(clip, os.path.join(ROOT, 'audio', rel))
            snd[sid] = {'f': rel, 'ms': int(1000 * len(clip) / SR)}
        ok.append((sid, len(clip) / SR))

    if not args.dry_run and ok:
        # atomic — dumping straight onto the manifest truncates it first, and
        # a crash mid-dump would leave the app with no audio index at all
        tmp = man_path + '.tmp'
        json.dump(manifest, open(tmp, 'w'), separators=(',', ':'))
        os.replace(tmp, man_path)

    print(f'imported {len(ok)}, rejected {len(bad)}'
          + (' (dry run — nothing written)' if args.dry_run else ''))
    for sid, dur in ok:
        print(f'  + {sid:<12} {dur:.2f}s')
    for sid, err in bad:
        print(f'  ! {sid:<12} {err}')
    if ok and not args.dry_run:
        print('\nNext: python3 tools/stamp_version.py, commit, and push — devices'
              ' only refresh the manifest on a new build.')
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
