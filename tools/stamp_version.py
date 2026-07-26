#!/usr/bin/env python3
"""Stamp a build id into the app so devices can detect a stale copy.

Caching bit us repeatedly: an installed service worker plus GitHub Pages' HTML
caching meant a deployed change could sit invisible on a device for hours. The
app now compares the build id baked into the page against version.json fetched
with no-store, and if they differ it clears its own caches and reloads once.

  python3 tools/stamp_version.py
"""
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def main():
    rev = subprocess.run(['git', 'rev-parse', '--short', 'HEAD'], cwd=ROOT,
                         capture_output=True, text=True).stdout.strip() or 'dev'
    stamp = subprocess.run(['date', '+%Y%m%d-%H%M'], capture_output=True,
                           text=True).stdout.strip()
    build = f'{stamp}-{rev}'

    with open(os.path.join(ROOT, 'version.json'), 'w') as f:
        json.dump({'build': build}, f)

    # bake the same id into the page and bust every asset URL with it
    idx = os.path.join(ROOT, 'index.html')
    html = open(idx).read()
    html = re.sub(r'<meta name="build" content="[^"]*">',
                  f'<meta name="build" content="{build}">', html)
    if 'name="build"' not in html:
        html = html.replace('<title>', f'<meta name="build" content="{build}">\n  <title>', 1)
    html = re.sub(r'\.js\?v=[^"]*"', f'.js?v={build}"', html)
    html = re.sub(r'style\.css\?v=[^"]*"', f'style.css?v={build}"', html)
    open(idx, 'w').write(html)

    sw = os.path.join(ROOT, 'sw.js')
    s = open(sw).read()
    s = re.sub(r"const CACHE = '[^']*';", f"const CACHE = 'ura-{build}';", s)
    open(sw, 'w').write(s)

    print('build', build)
    return 0


if __name__ == '__main__':
    sys.exit(main())
