from pathlib import Path
import urllib.request,json,time
r=Path('references/reconstruction');jobs=json.loads((r/'extra-sources.json').read_text())
for name,url in jobs:
 if (r/name).exists():continue
 try:
  req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0','Referer':'https://pi.zju.edu.cn/2022/0816/c67822a2609266/page.psp','Connection':'close'});(r/name).write_bytes(urllib.request.urlopen(req,timeout=25).read());print(name,flush=True)
 except Exception as e:print(name,str(e),flush=True)
 time.sleep(2)
