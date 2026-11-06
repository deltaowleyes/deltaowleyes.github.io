#!/usr/bin/env python3
"""Verify the deployed canonical Momma Made shell matches this exact checkout."""
import hashlib,json,os,pathlib,subprocess,sys,time,urllib.request
root=pathlib.Path(__file__).resolve().parents[2]
base="https://www.deltaowleyes.ca/mommamade/studio/"
expected=json.loads((root/"mommamade/studio/screenshot-manifest.json").read_text())
config_hash=hashlib.sha256((root/"mommamade/studio/config.js").read_bytes()).hexdigest()
def get(url):
 with urllib.request.urlopen(url,timeout=20) as reply:return reply.read()
for attempt in range(38):
 try:
  live=json.loads(get(base+"screenshot-manifest.json"))
  html=get(base).decode("utf-8")
  actual_hash=hashlib.sha256(get(base+"config.js")).hexdigest()
  if live.get("shell_contract")==expected.get("shell_contract") and live["families"][0]["screenshots"][0]["sha256"]==expected["families"][0]["screenshots"][0]["sha256"] and actual_hash==config_hash and 'data-express-shell="1.0"' in html and '/assets/express-studio/v1/studio.css' in html:
   print("MATCH: exact shared shell and new Momma Made screenshot manifest",flush=True)
   break
 except Exception as e: print("Deployment not yet verifiable",attempt,str(e),flush=True)
 if attempt<37:time.sleep(8)
else:raise RuntimeError("Published page not yet same as exact deployed master shell/screenshot state")
env=dict(os.environ,STUDIO_BASE=base)
subprocess.run([sys.executable,str(root/"mommamade/studio/qa.py")],cwd=root,env=env,check=True)
