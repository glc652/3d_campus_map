from pathlib import Path
import subprocess, json

ROOT=Path(__file__).resolve().parent
FF=Path('F:/project/campus-map/.video-tools/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe')
SOURCE=Path('F:/project/campus.mp4')
# source in, source out, output seconds, scene
CUTS=[(0.5,5.5,3,'校园全景'),(7,10,2,'点击探索'),(14,18,3,'两区校门'),(20,26,3,'风雨操场与球场'),(50,57,4,'图书馆'),(60,66,3,'北操场与工体馆'),(39,43,2,'全景收尾')]
clips=ROOT/'clips';clips.mkdir(exist_ok=True)
timeline=[]
cursor=0
for i,(start,end,duration,name) in enumerate(CUTS):
    output=clips/f'{i+1:02d}.mp4'
    speed=(end-start)/duration
    vf=f'crop=2560:1440:0:64,setpts=(PTS-STARTPTS)/{speed},fps=30,scale=1920:1080,setsar=1'
    if i==0: vf+=',fade=t=in:st=0:d=0.2'
    if i==len(CUTS)-1: vf+=f',fade=t=out:st={duration-.25}:d=0.25'
    subprocess.run([str(FF),'-v','error','-ss',str(start),'-t',str(end-start),'-i',str(SOURCE),'-vf',vf,'-an','-t',str(duration),'-c:v','libx264','-preset','fast','-crf','19','-pix_fmt','yuv420p','-y',str(output)],check=True)
    timeline.append(dict(scene=name,source_start=start,source_end=end,speed=speed,start=cursor,duration=duration,file=str(output)))
    cursor+=duration
(ROOT/'timeline.json').write_text(json.dumps(timeline,ensure_ascii=False,indent=2),encoding='utf-8')
(ROOT/'concat.txt').write_text(''.join(f"file 'clips/{i+1:02d}.mp4'\n" for i in range(len(CUTS))),encoding='utf-8')
subprocess.run([str(FF),'-v','error','-f','concat','-safe','0','-i',str(ROOT/'concat.txt'),'-c','copy','-movflags','+faststart','-y',str(ROOT/'campus-20s.mp4')],check=True)
print('Completed 7 clips, 20 seconds')
