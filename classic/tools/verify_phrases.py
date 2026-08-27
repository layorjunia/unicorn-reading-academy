#!/usr/bin/env python3
"""Listen to the sentence clips and prove they say the right sentence.

verify_audio.py covers single words. Story pages and narration lines are the
other half of what the child hears, and they were never checked: a page that
renders as the wrong sentence, drops a clause, or trails off is exactly the kind
of fault nobody notices until a 7-year-old is reading along with it.

Sentences are far easier to transcribe than bare words — there is context — so
no carrier splicing is needed here. What matters is the comparison: transcripts
differ from source text in harmless ways (numerals, contractions, punctuation),
so text is normalised on both sides and judged by word error rate rather than
exact match.

  python3 tools/verify_phrases.py                # every multi-word clip
  python3 tools/verify_phrases.py --since 600    # only clips newer than 600s
"""
import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
import time
import wave

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Keep ALL scratch files inside the project — never the system temp dir.
_WORK = os.path.join(ROOT, '.work', 'tmp')
os.makedirs(_WORK, exist_ok=True)
tempfile.tempdir = _WORK

AUDIO = os.path.join(ROOT, 'audio')

# Recogniser spellings, not pronunciation faults.
SUBS = {
    'ok': 'okay', 'mr': 'mister', 'mrs': 'missus',
    '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five',
    '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine', '10': 'ten',
    'gonna': 'going to', 'wanna': 'want to',
    # The recogniser writes these as one word; the audio is identical.
    'cannot': 'can not', 'dont': 'do not', 'cant': 'can not',
    'its': 'it is', 'lets': 'let us',
}


def words_of(text):
    t = text.lower().replace('’', "'").replace('‘', "'")
    t = re.sub(r"[^a-z0-9' ]+", ' ', t)
    out = []
    for w in t.split():
        w = w.strip("'")
        if not w:
            continue
        out.extend(SUBS.get(w, w).split())
    return out


def wer(ref, hyp):
    """Word error rate — the usual edit distance over word sequences."""
    if not ref:
        return 0.0 if not hyp else 1.0
    prev = list(range(len(hyp) + 1))
    for i, r in enumerate(ref, 1):
        cur = [i]
        for j, h in enumerate(hyp, 1):
            cur.append(min(prev[j] + 1, cur[j - 1] + 1,
                           prev[j - 1] + (r != h)))
        prev = cur
    return prev[len(hyp)] / len(ref)


def to_wav16k(path):
    out = tempfile.mktemp(suffix='.wav')
    subprocess.run(['afconvert', '-f', 'WAVE', '-d', 'LEI16@16000', '-c', '1',
                    path, out], capture_output=True)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--model', default='base.en')
    ap.add_argument('--confirm', default='small.en',
                    help='larger model used to re-check first-pass suspects')
    ap.add_argument('--limit', type=int, default=0)
    ap.add_argument('--since', type=float, default=0,
                    help='only clips modified in the last N seconds')
    ap.add_argument('--tol', type=float, default=0.34,
                    help='max acceptable word error rate')
    ap.add_argument('--out', default=os.path.join(ROOT, 'tools',
                                                  'verify-phrases-report.json'))
    args = ap.parse_args()

    from faster_whisper import WhisperModel

    manifest = json.load(open(os.path.join(AUDIO, 'manifest.json')))
    model = WhisperModel(args.model, device='cpu', compute_type='int8')

    phrases = sorted(p for p in manifest['words'] if ' ' in p)
    if args.since:
        now = time.time()
        phrases = [p for p in phrases
                   if os.path.exists(os.path.join(AUDIO, manifest['words'][p]))
                   and now - os.path.getmtime(
                       os.path.join(AUDIO, manifest['words'][p])) <= args.since]
    if args.limit:
        phrases = phrases[:args.limit]
    print(f'checking {len(phrases)} sentence clips (tolerance {args.tol:.0%} WER)')

    def listen(m, p):
        path = os.path.join(AUDIO, manifest['words'][p])
        if not os.path.exists(path):
            return None, 1.0
        wav = to_wav16k(path)
        segs, _ = m.transcribe(wav, language='en', beam_size=5, vad_filter=False)
        heard = ' '.join(s.text for s in segs).strip()
        os.unlink(wav)
        return heard, wer(words_of(p), words_of(heard))

    suspect = []
    for i, p in enumerate(phrases, 1):
        heard, e = listen(model, p)
        if heard is None:
            suspect.append({'text': p, 'heard': '(file missing)', 'wer': 1.0})
        elif e > args.tol:
            suspect.append({'text': p, 'heard': heard, 'wer': round(e, 3),
                            'file': manifest['words'][p]})
        if i % 50 == 0:
            print(f'  {i}/{len(phrases)} checked, {len(suspect)} suspect',
                  flush=True)

    # The small model mishears short strings and proper nouns often enough that
    # its failures are mostly its own ("Tess" -> "test", "can not" -> "cannot").
    # Re-listening to just the suspects with a bigger model is cheap and is what
    # separates a real defect from a transcription artefact — without it the
    # report is ~70% noise and gets ignored, which defeats the point.
    bad = []
    if suspect:
        print(f'\nre-listening to {len(suspect)} suspects with {args.confirm}...')
        big = WhisperModel(args.confirm, device='cpu', compute_type='int8')
        for s in suspect:
            if s['heard'] == '(file missing)':
                bad.append(s)
                continue
            heard, e = listen(big, s['text'])
            if e > args.tol:
                bad.append({**s, 'heard': heard, 'wer': round(e, 3),
                            'first_pass': s['heard']})
        print(f'{len(suspect) - len(bad)} were transcription artefacts')

    json.dump(bad, open(args.out, 'w'), indent=1)
    print(f'\n{len(phrases)} sentence clips checked, {len(bad)} suspect '
          f'({100.0 * len(bad) / max(1, len(phrases)):.1f}%)')
    for b in sorted(bad, key=lambda x: -x['wer'])[:25]:
        print(f"  WER {b['wer']:.2f}  want: {b['text'][:64]}")
        print(f"             got : {b['heard'][:64]}")
    print(f'\nfull report: {args.out}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
