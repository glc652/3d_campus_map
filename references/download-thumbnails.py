from pathlib import Path
import re,json,urllib.request,html,time
from PIL import Image,ImageDraw
r=Path('references/reconstruction');items=json.loads((r/'sources.json').read_text(encoding='utf8'))
for a in items:
 if not a['file'].startswith('commons-') or 'error' not in a:continue
 raw=(r/a['file'].replace('.jpg','.html')).read_text(encoding='utf8');m=re.search(r'fullImageLink.*?<img[^>]*src="([^"]+)"',raw,re.S)
 if not m:continue
 url=html.unescape(m.group(1));a['thumbnail']=url
 try:
  req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
  (r/a['file']).write_bytes(urllib.request.urlopen(req,timeout=20).read());a.pop('error',None);print(a['file'],flush=True)
 except Exception as e:print(a['file'],str(e),flush=True)
 time.sleep(1)
(r/'sources.json').write_text(json.dumps(items,ensure_ascii=False,indent=2),encoding='utf8')
photos=[a for a in items if a['file'].startswith('commons-') and (r/a['file']).exists()];sheet=Image.new('RGB',(1200,900),'white');draw=ImageDraw.Draw(sheet)
for i,a in enumerate(photos):
 im=Image.open(r/a['file']).convert('RGB');im.thumbnail((395,195));x=i%3*400;y=i//3*225;sheet.paste(im,(x,y));draw.text((x,y+200),a['file'],fill='black')
sheet.save(r/'commons-contact.jpg')
