from pathlib import Path
import json,re,html,urllib.request,time
r=Path('references/reconstruction');jobs=[]
for n in ['09','11']:
 raw=(r/f'commons-{n}.html').read_text(encoding='utf8');m=re.search(r'fullImageLink.*?srcset="([^" ]+) 2x',raw,re.S)
 if m:jobs.append((f'aerial-{n}.jpg',html.unescape(m.group(1))))
base='https://pi.zju.edu.cn/_upload/article/images/e7/a0/e59244b84c239ab031f9ad141888/'
for f,k in [('campus-layout.jpg','2b41ecaf-baa1-4a86-b78e-1b2a451eef78.jpg'),('teaching-dorm.jpg','20df845f-764f-4189-82be-f7b20908146b.jpg'),('practice-hall.jpg','5006d833-44c8-4b55-aaad-0062f0fd9dc3.jpg')]:jobs.append((f,base+k))
for name,url in jobs:
 try:
  req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'});(r/name).write_bytes(urllib.request.urlopen(req,timeout=35).read());print(name,flush=True)
 except Exception as e:print(name,str(e),flush=True)
 time.sleep(1)
(r/'extra-sources.json').write_text(json.dumps(jobs,indent=2),encoding='utf8')
