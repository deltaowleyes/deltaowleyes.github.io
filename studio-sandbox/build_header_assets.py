#!/usr/bin/env python3
"""Rebuild branded Studio headers from approved original image. No paid APIs, no external photos."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pathlib import Path
import hashlib,json
ROOT=Path(__file__).resolve().parent
SRC=ROOT/"reference.webp"
OUT=ROOT
SERIF="/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
REG="/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"
def bg(src,w,h):
 im=src.crop((1020,0,1205,171)).resize((w,h),Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(max(11,w//90))).convert("RGBA")
 overlay=Image.new("RGBA",(w,h));d=ImageDraw.Draw(overlay)
 for y in range(h):
  d.line((0,y,w,y),fill=(7,21,31,int(53+40*y/max(1,h-1))),width=1)
 return Image.alpha_composite(im,overlay)
def bird(src,box,size):
 part=src.crop(box).resize(size,Image.Resampling.LANCZOS).convert("RGBA")
 mask=Image.new("L",size,0);d=ImageDraw.Draw(mask)
 d.ellipse((7,5,size[0]-7,size[1]-5),fill=255)
 part.putalpha(mask.filter(ImageFilter.GaussianBlur(max(12,size[0]//12))))
 return part
def center(im,t,y,size,color,font=SERIF,stroke=2):
 d=ImageDraw.Draw(im);f=ImageFont.truetype(font,size)
 b=d.textbbox((0,0),t,font=f,stroke_width=stroke)
 d.text(((im.width-(b[2]-b[0]))/2-b[0],y),t,font=f,fill=color,stroke_width=stroke,stroke_fill="#0b111b")
def make(src,w,h,owl_size,hawk_size,owl_pos,hawk_pos,mobile):
 im=bg(src,w,h)
 im.alpha_composite(bird(src,(0,0,362,169),owl_size),owl_pos)
 im.alpha_composite(bird(src,(1167,0,1536,169),hawk_size),hawk_pos)
 d=ImageDraw.Draw(im)
 if mobile:
  d.line((310,210,790,210),fill="#aa7c50",width=2)
  center(im,"Delta Owl Eyes",157,92,"#ffd994",stroke=4)
  center(im,"Website Design Studio",270,56,"#fff8e9",font=REG,stroke=3)
  d.rounded_rectangle((252,354,848,409),radius=25,fill="#771628",outline="#edc184",width=3)
  center(im,"40 Exceptional Website Designs",365,35,"#fff8e9",font=REG,stroke=1)
 else:
  center(im,"Delta Owl Eyes",-3,64,"#ffd994",stroke=3)
  center(im,"Website Design Studio",68,39,"#fff8e9",font=REG,stroke=2)
  d.rounded_rectangle((458,117,1078,144),radius=13,fill="#771628",outline="#e7b879",width=2)
  center(im,"40 Exceptional Website Designs",119,22,"#fff8e9",font=REG,stroke=1)
  d.line((0,169,1536,169),fill="#deb37a",width=3)
 return im.convert("RGB")
def main():
 with Image.open(SRC) as original:
  original.load()
  assert original.size==(1536,1024),"Reference image dimensions changed"
  src=original.convert("RGB")
 out=[("header-desktop.webp",make(src,1536,171,(233,164),(236,165),(45,-9),(1260,-6),False),(1536,171)),
      ("header-mobile.webp",make(src,1100,430,(174,145),(176,146),(85,16),(845,15),True),(1100,430))]
 manifest=[]
 for name,im,size in out:
  dest=OUT/name;im.save(dest,format="WEBP",quality=89 if "mobile" in name else 90,method=6)
  with Image.open(dest) as valid:
   valid.load()
   assert valid.format=="WEBP" and valid.size==size
  manifest.append({"name":name,"dimensions":list(size),"sha256":hashlib.sha256(dest.read_bytes()).hexdigest(),"bytes":dest.stat().st_size})
 (OUT/"header-assets-manifest.json").write_text(json.dumps({"source":"reference.webp","source_sha256":hashlib.sha256(SRC.read_bytes()).hexdigest(),"assets":manifest},indent=2)+"\n")
 print(json.dumps(manifest,indent=2))
if __name__=="__main__":main()
