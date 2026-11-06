#!/usr/bin/env python3
"""Rebuild Studio headers from the approved 1536x1024 source, preserving desktop artwork.
No generative model, no substituted photography. Only the original ribbon is repainted.
"""
from PIL import Image,ImageDraw,ImageFont,ImageChops
from pathlib import Path
import json,hashlib
ROOT=Path(__file__).resolve().parent
SOURCE=ROOT/"reference.webp"
SRC=Image.open(SOURCE).convert("RGB")
assert SRC.size==(1536,1024)
assert hashlib.sha256(SOURCE.read_bytes()).hexdigest()=="f67af65d25c986507b8d867621cfc02d413ec3a1110879904f4dbdc36218ee8d"
FONT="/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"
def font_fit(draw,label,size,width):
 while size>=10:
  f=ImageFont.truetype(FONT,size)
  if draw.textbbox((0,0),label,font=f,stroke_width=1)[2]<=width:return f
  size-=1
 return f
def patched_reference():
 top=SRC.copy()
 overlay=Image.new("RGBA",top.size,(0,0,0,0))
 draw=ImageDraw.Draw(overlay)
 draw.rounded_rectangle((505,104,1014,134),radius=16,fill=(110,13,28,255))
 draw.line((527,106,992,106),fill=(161,41,52,90),width=1)
 label="40 Exceptional Website Designs"
 ft=font_fit(draw,label,29,460)
 bounds=draw.textbbox((0,0),label,font=ft,stroke_width=1)
 x=(1536-(bounds[2]-bounds[0]))//2-bounds[0]
 draw.text((x+1,105),label,font=ft,fill="#fff6e9",stroke_width=1,stroke_fill="#946a61")
 final=Image.alpha_composite(top.convert("RGBA"),overlay).convert("RGB")
 bbox=ImageChops.difference(SRC,final).getbbox()
 assert bbox and bbox[0]>=505 and bbox[1]>=104 and bbox[2]<=1015 and bbox[3]<=135, f"Changes escaped original ribbon: {bbox}"
 return final,bbox
PATCHED,CHANGE_BOX=patched_reference()
def make_breakpoint(w,h):
 # Recompose only original approved image elements at their pixel-appropriate size.
 base=Image.new("RGB",(w,h),"#0c2430")
 sky=PATCHED.crop((1025,0,1190,100)).resize((w,h),Image.Resampling.LANCZOS)
 base.paste(sky,(0,0))
 base=Image.alpha_composite(base.convert("RGBA"),Image.new("RGBA",(w,h),(8,21,33,125)))
 top_h=int(h*.41);portrait_w=int(w*.34)
 for name,box,x in [("owl",(0,0,350,165),0),("hawk",(1188,0,1536,165),w-portrait_w)]:
  photo=PATCHED.crop(box).resize((portrait_w,top_h),Image.Resampling.LANCZOS).convert("RGBA")
  alpha=Image.new("L",(portrait_w,top_h),255);p=alpha.load()
  for yy in range(top_h):
   for xx in range(portrait_w):
    edge=portrait_w-1-xx if name=="owl" else xx
    p[xx,yy]=int(255*min(1,max(0,edge/(portrait_w*.22))))
  photo.putalpha(alpha);base.alpha_composite(photo,(x,0))
 # The title and feather decorations retain the original embedded lettering.
 title=PATCHED.crop((487,0,1054,101)).convert("RGBA")
 title_w=int(min(w*.94,h*.39*567/101));title_h=int(title_w*101/567)
 title=title.resize((title_w,title_h),Image.Resampling.LANCZOS)
 alpha=Image.new("L",(title_w,title_h),255);p=alpha.load()
 for yy in range(title_h):
  for xx in range(title_w):
   edge=min(xx,title_w-1-xx,yy,title_h-1-yy)
   p[xx,yy]=int(255*min(1,edge/max(2,title_h*.14)))
 title.putalpha(alpha)
 base.alpha_composite(title,((w-title_w)//2,int(h*(.40 if w<=500 else .355))))
 # The '40' wording is also sampled from the original maroon ribbon, not HTML.
 ribbon=PATCHED.crop((505,104,1015,135)).convert("RGBA")
 bw=int(w*.95);bh=int(max(26,min(38,round(h*.147))))
 ribbon=ribbon.resize((bw,bh),Image.Resampling.LANCZOS)
 base.alpha_composite(ribbon,((w-bw)//2,int(h*.76)))
 ImageDraw.Draw(base).line((int(w*.09),h-5,int(w*.91),h-5),fill=(232,174,99,220),width=max(1,w//650))
 return base.convert("RGB")
manifest=[]
images={320:212,390:220,500:230,768:225,1024:200}
for w,h in images.items():
 dest=ROOT/f"header-{w}.webp"
 make_breakpoint(w,h).save(dest,"WEBP",quality=95,method=6)
 with Image.open(dest) as check:
  check.load();assert check.size==(w,h)
 manifest.append({"file":dest.name,"width":w,"height":h,"sha256":hashlib.sha256(dest.read_bytes()).hexdigest(),"bytes":dest.stat().st_size})
# 1440 breakpoint is a scaled presentation of the ORIGINAL approved header.
dest=ROOT/"header-1440.webp"
PATCHED.crop((0,0,1536,171)).save(dest,"WEBP",quality=96,method=6)
manifest.append({"file":dest.name,"width":1536,"height":171,"sha256":hashlib.sha256(dest.read_bytes()).hexdigest(),"bytes":dest.stat().st_size})
dest=ROOT/"reference-40.webp"
PATCHED.save(dest,"WEBP",quality=95,method=6)
manifest.append({"file":dest.name,"width":1536,"height":1024,"sha256":hashlib.sha256(dest.read_bytes()).hexdigest(),"bytes":dest.stat().st_size})
(ROOT/"header-restoration-manifest.json").write_text(json.dumps({"original_sha256":hashlib.sha256(SOURCE.read_bytes()).hexdigest(),"changed_bbox":CHANGE_BOX,"assets":manifest},indent=2)+"\n")
print(json.dumps({"changed_bbox":CHANGE_BOX,"assets":manifest},indent=2))
