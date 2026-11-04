from pathlib import Path
import subprocess,json,os,sys
ROOT=Path(__file__).resolve().parent
FF='F:/project/campus-map/.video-tools/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe'
clips=[ROOT/'clips'/f'{i:02d}.mp4' for i in [1,3,4,5,6,7]]
assert all(p.exists() for p in clips)
(ROOT/'concat-six.txt').write_text(''.join(f"file '{p.as_posix()}'\n" for p in clips),encoding='utf-8')
bgm=Path.home()/'.codex/skills/jianying-editor-skill/assets/audio.mp3'
# Default demo music from the installed skill. Overlap loop boundaries to avoid hard audio cuts.
args=[FF,'-v','error']
for _ in range(4):args+=['-i',str(bgm)]
args+=['-filter_complex','[0:a][1:a]acrossfade=d=0.6:c1=tri:c2=tri[a1];[a1][2:a]acrossfade=d=0.6:c1=tri:c2=tri[a2];[a2][3:a]acrossfade=d=0.6:c1=tri:c2=tri,atrim=duration=18,loudnorm=I=-20:TP=-2:LRA=7,afade=t=in:d=0.7,afade=t=out:st=16.5:d=1.5[a]','-map','[a]','-ar','48000','-c:a','pcm_s16le','-y',str(ROOT/'bgm-six.wav')]
subprocess.run(args,check=True)
subprocess.run([FF,'-v','error','-f','concat','-safe','0','-i',str(ROOT/'concat-six.txt'),'-i',str(ROOT/'bgm-six.wav'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-t','18','-movflags','+faststart','-y',str(ROOT/'campus-six-bgm.mp4')],check=True)
sys.dont_write_bytecode=True
sys.path.insert(0,str(ROOT/'deps'))
skill_candidates=[os.getenv('JY_SKILL_ROOT',''),str(Path.home()/'.codex/skills/jianying-editor-skill')]
skill_root=next(p for p in skill_candidates if p and (Path(p)/'scripts/jy_wrapper.py').exists())
sys.path.insert(0,str(Path(skill_root)/'scripts'))
from jy_wrapper import JyProject
import core.media_ops
core.media_ops.normalize_video_for_jianying=lambda path:path
project=JyProject('Campus_6clips_BGM',width=1920,height=1080,drafts_root=str(ROOT/'drafts'),overwrite=False)
durations=[3,3,3,4,3,2];cursor=0
for clip,duration in zip(clips,durations):
 assert project.add_media_safe(str(clip),start_time=f'{cursor}s',duration=f'{duration}s',track_name='VideoTrack') is not None
 cursor+=duration
assert project.add_audio_safe(str(ROOT/'bgm-six.wav'),start_time='0s',duration='18s',track_name='BGM') is not None
project.save()
(ROOT/'six-edit-notes.txt').write_text('素材顺序：01、03、04、05、06、07。总长18秒。\n配乐：jianying-editor-skill/assets/audio.mp3 默认演示音乐，短循环交叉淡化，响度-20 LUFS，首尾淡化。云端曲目请求403，未使用。\n剪映草稿含6个视频段及独立BGM音轨。MP4由FFmpeg渲染，未通过剪映界面导出。',encoding='utf-8')
print('Completed six clips, 18 seconds, BGM and editable draft.')
