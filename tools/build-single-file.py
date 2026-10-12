"""Bundle the prototype into one self-contained HTML file (dist/cash_management_prototype.html).

Use it when you want to send the prototype to someone as a single file.
Run from the repository root:  python3 tools/build-single-file.py
"""
import os, re

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
html = open(os.path.join(root, "index.html"), encoding="utf-8").read()

def inline_css(m):
    return "<style>\n" + open(os.path.join(root, m.group(1)), encoding="utf-8").read() + "\n</style>"

def inline_js(m):
    return "<script>\n" + open(os.path.join(root, m.group(1)), encoding="utf-8").read() + "\n</script>"

html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', inline_css, html)
html = re.sub(r'<script src="([^"]+)"></script>', inline_js, html)
os.makedirs(os.path.join(root, "dist"), exist_ok=True)
out = os.path.join(root, "dist", "cash_management_prototype.html")
open(out, "w", encoding="utf-8").write(html)
print("Wrote", out)
