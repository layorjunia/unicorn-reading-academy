#!/usr/bin/env python3
"""Pull the final SVG out of a subagent's transcript and write it to a file.

The transcripts are large JSONL; this reads them without echoing their contents,
so collecting art costs a filename and a byte count instead of the whole file.

  python3 tools/collect_agent_svg.py <out-dir> <ID>=<transcript> [<ID>=<transcript> ...]
"""
import html
import json
import os
import re
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Keep ALL scratch files inside the project — never the system temp dir.
_WORK = os.path.join(ROOT, '.work', 'tmp')
os.makedirs(_WORK, exist_ok=True)
tempfile.tempdir = _WORK


def texts(path):
    """Every assistant text block in the transcript, oldest first."""
    out = []
    with open(path, encoding='utf-8', errors='replace') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                e = json.loads(line)
            except json.JSONDecodeError:
                continue
            stack = [e]
            while stack:
                v = stack.pop()
                if isinstance(v, dict):
                    if v.get('type') == 'text' and isinstance(v.get('text'), str):
                        out.append(v['text'])
                    stack.extend(v.values())
                elif isinstance(v, list):
                    stack.extend(v)
    return out


def extract(path):
    blocks = [html.unescape(t) for t in texts(path)]
    best = None
    for s in blocks:
        i, j = s.find('<svg'), s.rfind('</svg>')
        if i >= 0 and j > i:
            cand = s[i:j + 6]
            if best is None or len(cand) > len(best):
                best = cand
    if best:
        return best
    # A long SVG can be split across several streamed text blocks, so the open
    # and close tags never appear together. Joining first recovers those.
    s = ''.join(blocks)
    i, j = s.find('<svg'), s.rfind('</svg>')
    return s[i:j + 6] if i >= 0 and j > i else None


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        return 2
    out_dir = sys.argv[1]
    os.makedirs(out_dir, exist_ok=True)
    rc = 0
    for arg in sys.argv[2:]:
        key, _, path = arg.partition('=')
        if not os.path.exists(path):
            print(f'  {key}: transcript not found')
            rc = 1
            continue
        svg = extract(path)
        if not svg:
            print(f'  {key}: no <svg> found in transcript')
            rc = 1
            continue
        dest = os.path.join(out_dir, key + '.svg')
        open(dest, 'w', encoding='utf-8').write(svg)
        print(f'  {key}: {len(svg) / 1024:.1f} KB -> {dest}')
    return rc


if __name__ == '__main__':
    sys.exit(main())
