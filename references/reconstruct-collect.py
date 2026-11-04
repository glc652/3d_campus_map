from pathlib import Path
import urllib.request,urllib.parse,json,re,concurrent.futures
from html.parser import HTMLParser
from PIL import Image,ImageDraw
root=Path('references/reconstruction');root.mkdir(exist_ok=True)
def get(url):
 req=urllib.request.Request(url,headers={'User-Agent':'CampusReferenceResearch/1.0 (local educational 3D modeling)'})
 return urllib.request.urlopen(req,timeout=35).read()
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.imgs=[];self.links=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='img':self.imgs.append(a)
  if tag=='a':self.links.append(a)
records=[]
page='https://pi.zju.edu.cn/2018/0911/c67022a2551978/page.htm'
p=Parser();p.feed(get(page).decode('utf8','replace'))
for a in p.imgs:
 src=a.get('src','')
 if '_upload/article' in src:records.append({'page':page,'url':urllib.parse.urljoin(page,src),'title':a.get('alt',''),'file':f'engineering-{len(records):02}.jpg'})
try:
 page='https://commons.wikimedia.org/wiki/Category:Zhejiang_University_City_College';p=Parser();p.feed(get(page).decode('utf8','replace'))
 links=list(dict.fromkeys(urllib.parse.urljoin(page,a['href']) for a in p.links if '/wiki/File:' in a.get('href','')))
 for i,url in enumerate(links):
  raw=get(url).decode('utf8','replace');match=re.search(r'<div class="fullImageLink".*?<a href="([^"]+)"',raw,re.S)
  if match:records.append({'page':url,'url':match.group(1).replace('&amp;','&'),'title':urllib.parse.unquote(url.rsplit('/',1)[-1]),'file':f'commons-{i:02}.jpg'})
  (root/f'commons-{i:02}.html').write_text(raw,encoding='utf8')
except Exception as e:print('Commons:',str(e))
def save(a):
 try:(root/a['file']).write_bytes(get(a['url']))
 except Exception as e:a['error']=str(e)
with concurrent.futures.ThreadPoolExecutor(5) as pool:list(pool.map(save,records))
(root/'sources.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf8')
for start in range(0,len(records),12):
 sheet=Image.new('RGB',(1200,780),'white');draw=ImageDraw.Draw(sheet)
 for i,a in enumerate(records[start:start+12]):
  if 'error' in a:continue
  im=Image.open(root/a['file']).convert('RGB');im.thumbnail((390,228));x=i%3*400;y=i//3*195;im.thumbnail((390,166));sheet.paste(im,(x,y));draw.text((x,y+170),a['file'],fill='black')
 sheet.save(root/f'contact-{start//12}.jpg')
print(json.dumps({'count':len(records),'errors':[a for a in records if 'error' in a]}))
