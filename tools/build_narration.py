#!/usr/bin/env python3
"""Build each lesson's narration as ONE recording, from two different voices.

The teaching lines need two things that no single engine gives:

  prose  — must sound like a friendly person  -> Piper (neural)
  letter sounds — must be exactly right       -> eSpeak NG (phoneme-native)

Rendering the whole line through Piper (what we did before) puts Piper's
invented phonemes inside the sentence: /b/ became "buh", and because it is one
continuous utterance there is no pause around it, so the sounds run together.
Rendering it as separate clips at playback time sounds chopped.

So we render the pieces separately and splice them into a single file here, at
build time: natural prose, exact sounds, real pauses around each sound, and one
seamless clip for the app to play.

  python3 tools/build_narration.py
"""
import json
import os
import struct
import subprocess
import sys
import tempfile
import wave

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO = os.path.join(ROOT, 'audio')
SR = 22050
sys.path.insert(0, os.path.join(ROOT, 'tools'))

# Silence around each piece. A letter sound gets clear air on both sides so a
# child hears it as its own thing rather than part of the sentence.
GAP_PROSE = 0.10
GAP_SOUND = 0.34


def read_any(path):
    """Any audio file -> float32 mono at SR."""
    wav = tempfile.mktemp(suffix='.wav')
    subprocess.run(['afconvert', '-f', 'WAVE', '-d', f'LEI16@{SR}', '-c', '1',
                    path, wav], capture_output=True)
    with wave.open(wav, 'rb') as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16)
    os.unlink(wav)
    return a.astype(np.float32)


def trim(a, thresh=180):
    idx = np.where(np.abs(a) > thresh)[0]
    if not len(idx):
        return a
    return a[max(0, idx[0] - int(SR * 0.01)):min(len(a), idx[-1] + int(SR * 0.02))]


def fade(a, ms=8):
    n = min(int(SR * ms / 1000), len(a) // 2)
    if n <= 0:
        return a
    a = a.copy()
    ramp = np.linspace(0, 1, n)
    a[:n] *= ramp
    a[-n:] *= ramp[::-1]
    return a


def silence(sec):
    return np.zeros(int(SR * sec), dtype=np.float32)


def write_m4a(samples, out_path):
    peak = float(np.max(np.abs(samples))) or 1.0
    if peak > 30000:
        samples = samples * (30000.0 / peak)
    wav = out_path + '.tmp.wav'
    with wave.open(wav, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(np.clip(samples, -32000, 32000).astype(np.int16).tobytes())
    r = subprocess.run(['afconvert', '-f', 'm4af', '-d', 'aac', '-b', '64000',
                        wav, out_path], capture_output=True, text=True)
    os.unlink(wav)
    if r.returncode != 0:
        raise RuntimeError('afconvert: ' + r.stderr[:200])


def main():
    import gen_audio as g
    from tts_engines import PiperEngine, EspeakPhonemes

    piper = PiperEngine()
    espeak = EspeakPhonemes()
    ipa_map = dict(g.IPA)
    ipa_map.update(g.BLEND_IPA)
    ipa_map.update(g.CHUNK_IPA)

    manifest = json.load(open(os.path.join(AUDIO, 'manifest.json')))
    os.makedirs(os.path.join(AUDIO, 'n'), exist_ok=True)

    cache = {}

    def prose(text):
        if text not in cache:
            tmp = tempfile.mktemp(suffix='.m4a')
            piper.speak_text(text, tmp)
            cache[text] = fade(trim(read_any(tmp)))
            os.unlink(tmp)
        return cache[text]

    def sound(tok):
        key = 'PH:' + tok
        if key not in cache:
            ipa = ipa_map.get(tok)
            tmp = tempfile.mktemp(suffix='.m4a')
            if ipa:
                espeak.render(ipa, tmp, pad=0.0)
            else:
                piper.speak_text(tok, tmp)
            cache[key] = fade(trim(read_any(tmp)))
            os.unlink(tmp)
        return cache[key]

    narrations = g.parse_narrations()
    print(f'building {len(narrations)} narration lines '
          f'(prose: piper, letter sounds: espeak)')

    built, problems = 0, []
    for island, segs in narrations:
        parts = []
        for s in segs:
            if s.get('say') is not None or s.get('word') is not None:
                if parts:
                    parts.append(silence(GAP_PROSE))
                parts.append(prose(s.get('say') or s.get('word')))
            elif s.get('ph') is not None:
                if parts:
                    parts.append(silence(GAP_SOUND))
                parts.append(sound(s['ph']))
                parts.append(silence(GAP_SOUND))
            elif s.get('ltr') is not None:
                if parts:
                    parts.append(silence(GAP_SOUND))
                name = PiperEngine  # letter NAME via the natural voice
                parts.append(prose(g.LETTER_NAME_IPA and
                                   {'a': 'ay', 'b': 'bee', 'c': 'see', 'd': 'dee',
                                    'e': 'ee', 'f': 'eff', 'g': 'jee', 'h': 'aitch',
                                    'i': 'eye', 'j': 'jay', 'k': 'kay', 'l': 'ell',
                                    'm': 'em', 'n': 'en', 'o': 'oh', 'p': 'pee',
                                    'q': 'cue', 'r': 'are', 's': 'ess', 't': 'tee',
                                    'u': 'you', 'v': 'vee', 'w': 'double you',
                                    'x': 'ex', 'y': 'why', 'z': 'zee'}
                                   .get(s['ltr'].lower(), s['ltr'])))
                parts.append(silence(GAP_SOUND))
        if not parts:
            problems.append(island)
            continue
        out = os.path.join(AUDIO, 'n', island + '.m4a')
        write_m4a(np.concatenate([silence(0.12)] + parts + [silence(0.25)]), out)
        manifest['narr'][island] = f'n/{island}.m4a'
        built += 1

    manifest['narration_engine'] = 'piper+espeak'
    json.dump(manifest, open(os.path.join(AUDIO, 'manifest.json'), 'w'),
              separators=(',', ':'))
    print(f'built {built} narration lines, {len(problems)} problems')
    for p in problems:
        print('  no segments:', p)
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main())
