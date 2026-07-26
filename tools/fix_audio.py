#!/usr/bin/env python3
"""Listen to every word clip and re-roll the ones that say the wrong word.

Neural TTS is stochastic, so on very short inputs it occasionally drifts — "cat"
came out "get", "sat" came out "set". Those are exactly the errors a phonics app
must never ship, and they are invisible without listening. Because each render
is a fresh sample, simply re-rolling a bad clip almost always fixes it.

Two things make the check trustworthy:

  * Each clip is spliced into a spoken carrier ("The word is <clip>") before
    recognition. A bare one-syllable word is transcribed unreliably; with
    context it is not.
  * Acceptance is PHONETIC, not spelling-based. The recogniser writes "bee" as
    "b", "ate" as "8", "mat" as "matt" — all correct audio. Comparing the IPA of
    what was expected against the IPA of what was heard removes those false
    alarms, which otherwise swamp the real defects.

  python3 tools/fix_audio.py                 # check and repair everything
  python3 tools/fix_audio.py --only cat,sat  # specific words
  python3 tools/fix_audio.py --check-only    # report, change nothing
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
sys.path.insert(0, os.path.join(ROOT, 'tools'))


def phon_key(voice, text):
    """IPA of a phrase, stripped of stress/length marks and spaces."""
    seq = []
    for sent in voice.phonemize(text):
        seq.extend(sent)
    drop = set('ˈˌː ')
    return ''.join(c for c in seq if c not in drop)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--only', default='')
    ap.add_argument('--attempts', type=int, default=5)
    ap.add_argument('--check-only', action='store_true')
    ap.add_argument('--model', default='base.en')
    args = ap.parse_args()

    from faster_whisper import WhisperModel
    from piper import PiperVoice
    from piper.config import SynthesisConfig
    from tts_engines import PiperEngine

    manifest = json.load(open(os.path.join(AUDIO, 'manifest.json')))
    voice_name = manifest.get('voice', 'en_US-lessac-high')
    voice = PiperVoice.load(os.path.join(ROOT, 'tools', 'voices', voice_name + '.onnx'))
    model = WhisperModel(args.model, device='cpu', compute_type='int8')
    engine = PiperEngine()

    chunks = list(voice.synthesize('The word is',
                                   syn_config=SynthesisConfig(length_scale=1.15)))
    carrier = np.concatenate([np.frombuffer(c.audio_int16_bytes, dtype=np.int16)
                              for c in chunks])
    sr = chunks[0].sample_rate

    def load_clip(rel):
        wav = tempfile.mktemp(suffix='.wav')
        subprocess.run(['afconvert', '-f', 'WAVE', '-d', f'LEI16@{sr}', '-c', '1',
                        os.path.join(AUDIO, rel), wav], capture_output=True)
        with wave.open(wav, 'rb') as w:
            a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16)
        os.unlink(wav)
        return a

    def heard_for(rel):
        a = np.concatenate([carrier,
                            np.zeros(int(sr * 0.35), dtype=np.int16),
                            load_clip(rel),
                            np.zeros(int(sr * 0.3), dtype=np.int16)])
        f = tempfile.mktemp(suffix='.wav')
        with wave.open(f, 'wb') as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(sr)
            w.writeframes(a.tobytes())
        segs, _ = model.transcribe(f, language='en', beam_size=5, vad_filter=False)
        t = ' '.join(s.text for s in segs).strip().lower()
        os.unlink(f)
        return t.replace('the word is', '').strip(' .!?,\'"')

    def matches(word, heard):
        if not heard:
            return False
        if heard.replace(' ', '') == word:
            return True
        # phonetic equality — "bee"/"b", "ate"/"8", "mat"/"matt" all pass
        try:
            return phon_key(voice, word) == phon_key(voice, heard)
        except Exception:  # noqa: BLE001
            return False

    if args.only:
        words = [w.strip() for w in args.only.split(',') if w.strip()]
    else:
        # real words only — skip hex colours, suffix labels and grapheme tokens
        words = sorted(w for w in manifest['words']
                       if ' ' not in w and w.isalpha() and len(w) > 1)

    print(f'checking {len(words)} word clips with {voice_name}')
    fixed, unfixable, checked = [], [], 0
    for w in words:
        rel = manifest['words'][w]
        heard = heard_for(rel)
        checked += 1
        if matches(w, heard):
            if checked % 200 == 0:
                print(f'  {checked}/{len(words)}  fixed={len(fixed)} bad={len(unfixable)}',
                      flush=True)
            continue
        if args.check_only:
            unfixable.append({'word': w, 'heard': heard})
            continue
        # re-roll: a different sample usually lands correctly
        got = None
        # vary the rate per attempt: a different draw AND slightly different
        # acoustics, which shakes loose the words that keep coming out wrong
        rates = [None, 1.15, 0.95, 1.3, 1.05, 1.45]
        for k in range(args.attempts):
            engine.speak_text(w, os.path.join(AUDIO, rel),
                              length_scale=rates[k % len(rates)])
            got = heard_for(rel)
            if matches(w, got):
                fixed.append({'word': w, 'was': heard})
                break
        else:
            unfixable.append({'word': w, 'heard': got, 'first': heard})
        if checked % 200 == 0:
            print(f'  {checked}/{len(words)}  fixed={len(fixed)} bad={len(unfixable)}',
                  flush=True)

    report = {'voice': voice_name, 'checked': len(words),
              'fixed': fixed, 'unfixable': unfixable}
    out = os.path.join(ROOT, 'tools', 'audio-repair-report.json')
    json.dump(report, open(out, 'w'), indent=1)
    print(f'\nchecked {len(words)} | repaired {len(fixed)} | still wrong {len(unfixable)}')
    for b in unfixable[:30]:
        print(f"   {b['word']:<12} heard {b.get('heard')!r}")
    print(f'report: {out}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
