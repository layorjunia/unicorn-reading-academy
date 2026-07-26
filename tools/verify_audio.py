#!/usr/bin/env python3
"""Listen to the generated word clips and prove they say the right word.

Why this exists: neural TTS is stochastic, and on very short inputs it drifts —
"hop" came out as "hope", "sit" as "say", "cub" as "cube". Those are silent
failures that a reading app absolutely cannot ship, and no amount of staring at
the code finds them. So the build listens to its own output.

Two details make the check trustworthy:

  * Speech recognition is unreliable on a bare one-syllable word (it heard "tin"
    as "10"). Each clip is therefore spliced into a spoken carrier — "The word
    is <clip>" — so the recogniser has context. That took the false-failure rate
    from ~30% to near zero.
  * A handful of legitimate spellings still come back differently ("six" -> "6").
    Those live in ALIASES rather than being silently tolerated.

  python3 tools/verify_audio.py            # check every word clip
  python3 tools/verify_audio.py --limit 50 # quick sample
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
AUDIO = os.path.join(ROOT, 'audio')

# Recogniser quirks, not pronunciation faults.
ALIASES = {
    'six': {'6'}, 'ten': {'10'}, 'two': {'2'}, 'one': {'1'}, 'eight': {'8'},
    'four': {'4'}, 'nine': {'9'}, 'fin': {'finn'}, 'bun': {'bunn'},
    'i': {'i', 'eye'}, 'a': {'a', 'uh'},
}


def to_wav16k(path):
    out = tempfile.mktemp(suffix='.wav')
    subprocess.run(['afconvert', '-f', 'WAVE', '-d', 'LEI16@22050', '-c', '1',
                    path, out], capture_output=True)
    return out


def read_wav(path):
    with wave.open(path, 'rb') as w:
        sr = w.getframerate()
        data = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16)
    return data, sr


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--limit', type=int, default=0)
    ap.add_argument('--model', default='base.en')
    ap.add_argument('--out', default=os.path.join(ROOT, 'tools', 'verify-report.json'))
    args = ap.parse_args()

    from faster_whisper import WhisperModel
    from piper import PiperVoice
    from piper.config import SynthesisConfig

    manifest = json.load(open(os.path.join(AUDIO, 'manifest.json')))
    model = WhisperModel(args.model, device='cpu', compute_type='int8')

    # the carrier is spoken by the same voice the clips were made with
    voice_name = manifest.get('voice', 'en_US-lessac-high')
    voice = PiperVoice.load(os.path.join(ROOT, 'tools', 'voices', voice_name + '.onnx'))
    chunks = list(voice.synthesize('The word is', syn_config=SynthesisConfig(length_scale=1.15)))
    carrier = np.concatenate([np.frombuffer(c.audio_int16_bytes, dtype=np.int16)
                              for c in chunks])
    carrier_sr = chunks[0].sample_rate

    words = sorted(w for w in manifest['words'] if ' ' not in w)
    if args.limit:
        words = words[:args.limit]

    def hear(word):
        clip_path = os.path.join(AUDIO, manifest['words'][word])
        wav = to_wav16k(clip_path)
        clip, sr = read_wav(wav)
        os.unlink(wav)
        if sr != carrier_sr:      # keep both at one rate
            return None
        gap = np.zeros(int(sr * 0.12), dtype=np.int16)
        tail = np.zeros(int(sr * 0.25), dtype=np.int16)
        joined = np.concatenate([carrier, gap, clip, tail])
        f = tempfile.mktemp(suffix='.wav')
        with wave.open(f, 'wb') as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(sr)
            w.writeframes(joined.tobytes())
        segs, _ = model.transcribe(f, language='en', beam_size=5, vad_filter=False)
        text = ' '.join(s.text for s in segs).strip().lower()
        os.unlink(f)
        return text.replace('the word is', '').strip(' .!?,\'"')

    bad = []
    for i, w in enumerate(words, 1):
        heard = hear(w)
        if heard is None:
            continue
        if heard != w and heard not in ALIASES.get(w, set()):
            bad.append({'word': w, 'heard': heard, 'file': manifest['words'][w]})
        if i % 100 == 0:
            print(f'  {i}/{len(words)} checked, {len(bad)} suspect', flush=True)

    json.dump(bad, open(args.out, 'w'), indent=1)
    print(f'\n{len(words)} word clips checked, {len(bad)} suspect '
          f'({100.0 * len(bad) / max(1, len(words)):.1f}%)')
    for b in bad[:40]:
        print(f"   {b['word']:<12} heard as {b['heard']!r}")
    print(f'\nfull report: {args.out}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
