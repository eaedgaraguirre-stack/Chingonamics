#!/usr/bin/env python3
"""Assemble split base64 parts into og-hero.jpg and optionally video."""
import base64, pathlib, hashlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
STAGING = ROOT / "_staging"
# JPG parts: prefer zero-padded part00.. then fall back to part0..
parts = sorted(STAGING.glob("og-hero.b64.part*"))
if parts:
    b64 = "".join(p.read_text().strip() for p in parts)
    data = base64.b64decode(b64)
    out = ROOT / "og-hero.jpg"
    out.write_bytes(data)
    print("wrote", out, len(data), hashlib.sha256(data).hexdigest())
    assert len(data) == 80045, len(data)
    assert hashlib.sha256(data).hexdigest() == "a5e1289686e2ebbc372670ca0e53e39f2889a2476bb3655c07882541b49dddd1"
vparts = sorted(STAGING.glob("hero-held.b64.part*"))
if vparts:
    vb64 = "".join(p.read_text().strip() for p in vparts)
    vdata = base64.b64decode(vb64)
    vout = ROOT / "_users_b7c824c7-4b1c-403b-93b7-0ec6eff1df3c_generated_1dcdd775-d1e6-4fd2-87b4-7889c7bdf202_generated_video.mp4"
    vout.write_bytes(vdata)
    print("wrote", vout, len(vdata), hashlib.sha256(vdata).hexdigest())
print("done")
