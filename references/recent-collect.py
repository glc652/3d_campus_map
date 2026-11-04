from pathlib import Path
import urllib.request,urllib.parse,re,json,concurrent.futures
from html.parser import HTMLParser
r=Path('references/recent');r.mkdir(exist_ok=True)
pages=[('time-2024','2024-04-16','https://www.thepaper.cn/newsDetail_forward_27072018'),('welcome-2024','2024-08-21','https://m.thepaper.cn/newsDetail_forward_28488813'),('community-2025','2025-05-12','https://www.hzcu.edu.cn/info/1086/33226.htm')]
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.images=[]
 def handle_starttag(self,t,attrs):
  if t=='img':self.images.append(dict(attrs))
def get(url):return urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=25).read()
records=[]
for prefix,date,page in pages:
 try:
  raw=get(page).decode('utf8','replace');(r/(prefix+'.html')).write_text(raw,encoding='utf8');p=Parser();p.feed(raw);seen=set()
  for a in p.images:
   src=a.get('data-original') or a.get('data-src') or a.get('src','');url=urllib.parse.urljoin(page,src)
   if not any(s in url for s in ['/__local/','imagecloud.thepaper.cn','image.thepaper.cn','imagepphcloud.thepaper.cn']):continue
   if url in seen:continue
   seen.add(url);records.append({'page':page,'published':date,'captured':'未提供独立拍摄日期','url':url,'file':f'{prefix}-{len(seen):02}.jpg'})
 except Exception as e:print(prefix,str(e),flush=True)
def save(a):
 try:
  path=r/a['file']
  if not path.exists():path.write_bytes(get(a['url']))
 except Exception as e:a['error']=str(e)
with concurrent.futures.ThreadPoolExecutor(3) as pool:list(pool.map(save,records))
(r/'sources.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf8')
from PIL import Image,ImageDraw
for start in range(0,len(records),16):
 sheet=Image.new('RGB',(1280,880),'white');draw=ImageDraw.Draw(sheet)
 for i,a in enumerate(records[start:start+16]):
  if 'error' in a:continue
  try:im=Image.open(r/a['file']).convert('RGB');im.thumbnail((315,185));x=i%4*320;y=i//4*220;sheet.paste(im,(x,y));draw.text((x,y+190),a['file'],fill='black')
  except Exception as e:a['error']=str(e)
 sheet.save(r/f'contact-{start//16}.jpg')
print(json.dumps({'records':len(records),'errors':sum('error' in a for a in records)}),flush=True)

