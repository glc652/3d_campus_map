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
project=JyProject('Campus_20s_Final',width=1920,height=1080,drafts_root=str(ROOT/'drafts'),overwrite=False)
for item in json.loads((ROOT/'timeline.json').read_text(encoding='utf-8')):
    segment=project.add_media_safe(item['file'],start_time=f"{item['start']}s",duration=f"{item['duration']}s",track_name='VideoTrack')
    if segment is None: raise RuntimeError('Failed to import '+item['scene'])
project.save()
