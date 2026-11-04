import os,sys,json
from pathlib import Path
ROOT=Path(__file__).resolve().parent
sys.dont_write_bytecode=True
sys.path.insert(0,str(ROOT/'deps'))
skill_candidates=[os.getenv('JY_SKILL_ROOT',''),str(Path.home()/'.codex/skills/jianying-editor-skill')]
skill_root=next(p for p in skill_candidates if p and (Path(p)/'scripts/jy_wrapper.py').exists())
sys.path.insert(0,str(Path(skill_root)/'scripts'))
from jy_wrapper import JyProject
import core.media_ops
# These clips were already normalized by edit.py to H.264/yuv420p CFR30.
core.media_ops.normalize_video_for_jianying=lambda path: path
project=JyProject('Campus_6clips_BGM_Jianying_Ready',width=1920,height=1080,drafts_root=str(Path(os.environ['LOCALAPPDATA'])/'JianyingPro/User Data/Projects/com.lveditor.draft'),overwrite=False)
cursor=0
for number,duration in zip([1,3,4,5,6,7],[3,3,3,4,3,2]):
    segment=project.add_media_safe(str(ROOT/'clips'/f'{number:02d}.mp4'),start_time=f'{cursor}s',duration=f'{duration}s',track_name='VideoTrack')
    if segment is None: raise RuntimeError('Clip import failed')
    cursor+=duration
import shutil
audio_path=Path(project.draft_dir)/'materials'/'bgm.wav'
shutil.copy2(ROOT/'bgm-six.wav',audio_path)
assert project.add_audio_safe(str(audio_path),start_time='0s',duration='18s',track_name='BGM') is not None
project.save()
