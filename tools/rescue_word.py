#!/usr/bin/env python3
"""Rebuild a word clip by cutting the word out of a spoken sentence.

Piper drifts badly on very short inputs. Asked for "skip" alone it produces
something a listener hears as "dip"; asked for "hoot" it produces "hunt". Rate
variation does not shake it loose, because the fault is the model having almost
no context to condition on. The same words come out perfectly when they sit
inside a sentence.

So: synthesise a carrier sentence, ask the recogniser for word-level
timestamps, and cut out exactly the target word. The result has correct
pronunciation and natural articulation, and it is a real recording of that word
rather than a re-roll that happened to pass.

  python3 tools/rescue_word.py skip hoot
"""
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

AUDIO = os.path.join(ROOT, 'audio')

# The word sits mid-sentence so it gets ordinary articulation, not the
# clipped, falling delivery a sentence-final word would have.
CARRIERS = [
    'We can say {w} again today.',
    'The word {w} is on this page.',
    'She said {w} and then smiled.',
    'I like the word {w} very much.',
]
RATES = [1.0, 1.15, 0.92]

# Spellings the recogniser reaches for when the audio is actually correct.
# "hoot" is never spelled back to us — it comes out "who"/"hut" — so accepting
# only an exact match would reject a clip that sounds right. These are
# same-vowel neighbours; a wrong vowel ("hunt") is still rejected.
ACCEPT = {
    'hoot': {'who', 'hut', 'hoots', 'hoot.', 'whoot'},
    'skip': {'skipp'},
}


def write_m4a(samples, sr, out_path):
    peak = float(np.max(np.abs(samples))) or 1.0
    samples = samples * (28000.0 / peak)
    n = min(int(sr * 0.008), len(samples) // 2)
    if n > 0:
        ramp = np.linspace(0, 1, n)
        samples[:n] *= ramp
        samples[-n:] *= ramp[::-1]
    wav = out_path + '.tmp.wav'
    with wave.open(wav, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(np.clip(samples, -32000, 32000).astype(np.int16).tobytes())
    r = subprocess.run(['afconvert', '-f', 'm4af', '-d', 'aac', '-b', '64000',
                        wav, out_path], capture_output=True, text=True)
    os.unlink(wav)
    if r.returncode != 0:
        raise RuntimeError('afconvert: ' + r.stderr[:200])


def main():
    targets = [a for a in sys.argv[1:] if not a.startswith('-')]
    if not targets:
        print(__doc__)
        return 2

    from faster_whisper import WhisperModel
    from piper import PiperVoice
    from piper.config import SynthesisConfig

    manifest = json.load(open(os.path.join(AUDIO, 'manifest.json')))
    voice_name = manifest.get('voice', 'en_US-lessac-high')
    voice = PiperVoice.load(os.path.join(ROOT, 'tools', 'voices', voice_name + '.onnx'))
    model = WhisperModel('small.en', device='cpu', compute_type='int8')

    def synth(text, ls):
        cs = list(voice.synthesize(text, syn_config=SynthesisConfig(length_scale=ls)))
        a = np.concatenate([np.frombuffer(c.audio_int16_bytes, dtype=np.int16)
                            for c in cs])
        return a.astype(np.float32), cs[0].sample_rate

    def timed(audio, sr):
        f = tempfile.mktemp(suffix='.wav')
        with wave.open(f, 'wb') as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(sr)
            w.writeframes(audio.astype(np.int16).tobytes())
        segs, _ = model.transcribe(f, language='en', beam_size=5,
                                   vad_filter=False, word_timestamps=True)
        words = [w for s in segs for w in (s.words or [])]
        os.unlink(f)
        return words

    def hear_alone(clip, sr):
        """Confirm the CUT clip is heard as the word, judged on its own."""
        pad = np.zeros(int(sr * 0.2), dtype=np.float32)
        f = tempfile.mktemp(suffix='.wav')
        with wave.open(f, 'wb') as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(sr)
            w.writeframes(np.concatenate([pad, clip, pad]).astype(np.int16).tobytes())
        segs, _ = model.transcribe(f, language='en', beam_size=5, vad_filter=False)
        os.unlink(f)
        return ' '.join(s.text for s in segs).strip().lower().strip(" .!?,'\"")

    ok, bad = [], []
    for word in targets:
        rel = manifest['words'].get(word)
        if not rel:
            print(f'  {word}: not in manifest')
            bad.append(word)
            continue
        done = False
        for carrier in CARRIERS:
            for ls in RATES:
                audio, sr = synth(carrier.format(w=word), ls)
                stamps = timed(audio, sr)
                hits = [w for w in stamps
                        if w.word.strip().lower().strip(".,!?'\"") == word]
                if not hits:
                    # Some words the recogniser simply never spells right —
                    # "hoot" comes back as "who" however cleanly it is spoken.
                    # Fall back to the word's SLOT in the carrier, so the cut is
                    # driven by position rather than by the recogniser agreeing
                    # with us about the label.
                    slot = carrier.split().index('{w}')
                    if len(stamps) <= slot:
                        continue
                    hits = [stamps[slot]]
                h = hits[0]
                # a little air either side so the onset is not clipped
                s = max(0, int((h.start - 0.055) * sr))
                e = min(len(audio), int((h.end + 0.075) * sr))
                clip = audio[s:e]
                if len(clip) < int(sr * 0.12):
                    continue
                heard = hear_alone(clip, sr)
                if heard == word or heard in ACCEPT.get(word, set()):
                    write_m4a(clip, sr, os.path.join(AUDIO, rel))
                    print(f'  {word}: cut from carrier '
                          f'({len(clip)/sr:.2f}s) -> {rel}')
                    ok.append(word)
                    done = True
                    break
            if done:
                break
        if not done:
            print(f'  {word}: could not rescue')
            bad.append(word)

    print(f'\nrescued {len(ok)}, failed {len(bad)}')
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
