import urllib.request, urllib.parse, json, re
from pathlib import Path
from html.parser import HTMLParser
from concurrent.futures import ThreadPoolExecutor
ROOT=Path(__file__).resolve().parent
class Parser(HTMLParser):
 def __init__(self): super().__init__(); self.images=[];self.links=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='img': self.images.append(a)
  if tag=='a' and a.get('href'): self.links.append(a['href'])
def get(url):
 req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
 with urllib.request.urlopen(req,timeout=30) as r:return r.read()
pages=[
 'https://www.hzcu.edu.cn/xysh/xyfg.htm',
 'https://www.hzcu.edu.cn/xysh/xyfg/3.htm',
 'https://www.hzcu.edu.cn/xysh/xyfg/2.htm',
 'https://www.hzcu.edu.cn/xysh/xyfg/1.htm',
 'https://english.hzcu.edu.cn/info/1041/1231.htm',
 'https://english.hzcu.edu.cn/info/1041/1013.htm',
 'https://english.hzcu.edu.cn/info/1035/1011.htm',
 'https://english.hzcu.edu.cn/info/1035/1010.htm',
 'https://english.hzcu.edu.cn/info/1037/1024.htm',
 'https://english.hzcu.edu.cn/Campus/Housing___Dining/Housing.htm']
def page(url):
 try:
  raw=get(url).decode('utf-8','replace'); p=Parser();p.feed(raw)
  return {'page':url,'images':[dict(a,url=urllib.parse.urljoin(url,a.get('src',''))) for a in p.images], 'links':[urllib.parse.urljoin(url,l) for l in p.links if 'xyfg/' in l or '/1036/' in l or 'Housing' in l]}
 except Exception as e:return {'page':url,'error':str(e)}
results=list(ThreadPoolExecutor(5).map(page,pages))
(ROOT/'pages.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
assets=[];seen=set()
for r in results:
 for a in r.get('images',[]):
  url=a['url']
  if ('/images/xyfg/' in url or '/__local/' in url) and url not in seen:
   seen.add(url); assets.append({'page':r['page'],'url':url,'name':a.get('alt','')})
def download(item):
 try:
  ext=Path(urllib.parse.urlparse(item['url']).path).suffix.lower()
  name=f"ref-{assets.index(item):02}{ext}"; path=ROOT/'photos'/name;path.parent.mkdir(exist_ok=True)
  if not path.exists():path.write_bytes(get(item['url']))
  item['file']=name;return item
 except Exception as e:item['error']=str(e);return item
assets=list(ThreadPoolExecutor(6).map(download,assets))
(ROOT/'sources.json').write_text(json.dumps(assets,ensure_ascii=False,indent=2),encoding='utf-8')
from PIL import Image,ImageDraw
for start in range(0,len(assets),16):
 batch=assets[start:start+16]; sheet=Image.new('RGB',(1280,4*226),'white');draw=ImageDraw.Draw(sheet)
 for i,a in enumerate(batch):
  if 'file' not in a:continue
  im=Image.open(ROOT/'photos'/a['file']).convert('RGB');im.thumbnail((312,200))
  x=(i%4)*320;y=(i//4)*226;sheet.paste(im,(x,y));draw.text((x+4,y+202),a['file'],fill='black')
 sheet.save(ROOT/f'contact-{start//16}.jpg')
print(json.dumps({'pages':len(results),'photos':len(assets),'failed':[a for a in assets if 'error' in a]}))
