export function installTour({THREE,scene,buildings,toast}) {
 const button=document.querySelector('#recordTour');
 button.onclick=async()=>{
  const mime=['video/mp4;codecs=avc1.42001f','video/mp4'].find(t=>MediaRecorder.isTypeSupported(t));
  if(!mime){toast('此浏览器不支持直接录制 MP4');return;}
  button.disabled=true;
  const W=1280,H=720,seconds=72;
  const out=document.createElement('canvas');out.width=W;out.height=H;
  const ctx=out.getContext('2d');
  const render=new THREE.WebGLRenderer({antialias:true});render.setSize(W,H);render.setPixelRatio(1);
  render.outputColorSpace=THREE.SRGBColorSpace;render.toneMapping=THREE.ACESFilmicToneMapping;render.toneMappingExposure=1.08;
  const cam=new THREE.PerspectiveCamera(39,W/H,.5,2500);
  const shots=[
   [null,'浙大城市学院 · 三维校园导览','南北两区，一张可旋转、缩放和点击探索的校园地图',700,0],
   ['library','北校区 · 图书馆','玻璃锥体与两侧馆翼，共同构成校园地标',115,.45],
   ['gate','湖州街 · 两区入口','对称通道，圆形地通入口朝向校内，旁侧设保安室',95,3.2],
   ['food2','第二食堂 · 风雨操场','一楼食堂；沿左侧楼梯直上平台，右转进入二楼',130,-1.7],
   ['basketball6','南校区 · 体育空间','六片篮球场与两片排球场；东西体楼紧邻操场',150,.15],
   ['chenyuan','校园生活 · 晨苑餐厅','餐厅按南北向布置，邻近金如新楼和成均楼',120,.7],
   ['tennis','科技楼西侧 · 两片网球场','依据用户草图调整；南侧保留空地与绕行道路',115,.45],
   ['southgate','南校南门 · 舟山东路','入口构成参考1999年历史照片，近期外观尚待核对',90,.05],
   [null,'在地图中，继续发现校园','75处校园地点 · 支持建筑检索、视角切换与模型导出',700,.5]
  ];
  const stream=out.captureStream(30),rec=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:5500000}),chunks=[];
  let running=true;
  rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
  rec.onerror=e=>{running=false;toast('录制失败：'+e.error.message);button.disabled=false;render.dispose();stream.getTracks().forEach(t=>t.stop());};
  rec.onstop=async()=>{
   try{const blob=new Blob(chunks,{type:'video/mp4'});
    if(location.port==='5174') {const r=await fetch('/api/export-video',{method:'POST',headers:{'Content-Type':'video/mp4'},body:blob});if(!r.ok)throw new Error('视频保存失败');toast('MP4 已保存到 videos/campus-introduction.mp4');}
    else{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='campus-introduction.mp4';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),30000);toast('介绍视频已导出');}
   }catch(e){toast(e.message)}finally{button.disabled=false;render.dispose();stream.getTracks().forEach(t=>t.stop());}
  };
  const start=performance.now();rec.start(1000);
  function frame(now){
   if(!running)return;
   const elapsed=Math.max(0,(now-start)/1000);
   if(elapsed>=seconds){running=false;rec.stop();return;}
   const index=Math.min(8,Math.floor(elapsed/8)),u=(elapsed%8)/8,shot=shots[index],b=buildings.find(b=>b.id===shot[0]);
   const target=new THREE.Vector3(b?.x||0,b?b.h*.25:0,b?.z||0),angle=shot[4]+u*.3,d=shot[3]*(1-u*.07);
   cam.position.set(target.x+Math.sin(angle)*d*.65,target.y+d*.8,target.z+Math.cos(angle)*d*.65);cam.lookAt(target);render.render(scene,cam);
   ctx.drawImage(render.domElement,0,0,W,H);
   const gradient=ctx.createLinearGradient(0,490,0,720);gradient.addColorStop(0,'#102f3800');gradient.addColorStop(1,'#102f38f5');ctx.fillStyle=gradient;ctx.fillRect(0,490,W,230);
   ctx.fillStyle='#173d45';ctx.fillRect(36,30,230,40);ctx.fillStyle='#fff';ctx.font='18px Microsoft YaHei';ctx.fillText('CAMPUS ATLAS / 校园导览',48,56);
   ctx.fillStyle='#fff';ctx.font='bold 36px Microsoft YaHei';ctx.fillText(shot[1],48,588);
   ctx.font='23px Microsoft YaHei';ctx.fillText(shot[2],48,633);
   ctx.font='15px Microsoft YaHei';ctx.fillStyle='#c9dadb';ctx.fillText('交互地图实录 · 建筑与道路尺寸为示意，非测绘或导航依据',48,684);
   ctx.fillStyle='#c7decf';ctx.fillRect(0,715,W*elapsed/seconds,5);
   const fade=Math.max(0,1-(elapsed%8)/.5,(elapsed%8-7.5)/.5);if(fade>0){ctx.fillStyle=`rgba(18,40,46,${fade})`;ctx.fillRect(0,0,W,H);}
   button.querySelector('span').textContent=`录制 ${Math.floor(elapsed)}/${seconds}s`;
   requestAnimationFrame(frame);
  }
  toast('正在录制72秒中文介绍，请保持页面打开');requestAnimationFrame(frame);
 };
}

