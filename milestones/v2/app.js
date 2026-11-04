import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';
import { buildings, categories, descriptions } from './data.js';
import {createArchitecture,evidence} from './architecture.js';

const $ = s => document.querySelector(s);
const viewport = $('#viewport');
const scene = new THREE.Scene(); scene.background = new THREE.Color('#e4edef');
scene.fog = new THREE.Fog('#e4edef', 1050, 1900);
const model = new THREE.Group(); model.name = 'ZUCC_Campus_Schematic'; scene.add(model);
let renderer;
try { renderer = new THREE.WebGLRenderer({antialias:true,alpha:false}); }
catch { $('#loading').innerHTML='<div class="map-error">无法启动三维视图。请使用支持 WebGL 的浏览器，并开启硬件加速。建筑目录与原始布局图仍可查看。</div>'; }
const camera = new THREE.PerspectiveCamera(39,1,.5,2500);
let controls, selected=null, category='全部', currentView='all', labelsOn=true, topView=false, tween=null;
const groups = new Map(), meshes=[], labels=[], obstacle=[], roadSegments=[];
const boxGeo = new THREE.BoxGeometry(1,1,1), matCache = new Map();
function mat(color){if(!matCache.has(color))matCache.set(color,new THREE.MeshStandardMaterial({color,roughness:.83}));return matCache.get(color)}
function box(parent,x,y,z,w,h,d,color){const m=new THREE.Mesh(boxGeo,typeof color==='string'?mat(color):color);m.position.set(x,y,z);m.scale.set(w,h,d);m.castShadow=h>1;m.receiveShadow=true;parent.add(m);return m;}
function cylinder(parent,x,y,z,r,h,color,segments=40){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,segments),mat(color));m.position.set(x,y,z);m.castShadow=h>2;m.receiveShadow=true;parent.add(m);return m;}
function line(parent,pts,color='#f6f4df',width=1){const g=new THREE.BufferGeometry().setFromPoints(pts.map(p=>new THREE.Vector3(...p)));const m=new THREE.Line(g,new THREE.LineBasicMaterial({color,linewidth:width}));parent.add(m);return m;}
const coords=(px,py)=>[(px-530)/3,(py-850)/3];
function road(points,width=5,color='#c7cecb',y=.12){for(let i=1;i<points.length;i++){const [x1,z1]=coords(...points[i-1]),[x2,z2]=coords(...points[i]);const l=Math.hypot(x2-x1,z2-z1);const m=box(model,(x1+x2)/2,y,(z1+z2)/2,width,.24,l,color);m.rotation.y=Math.atan2(x2-x1,z2-z1);if(y<1)roadSegments.push([x1,z1,x2,z2,width]);}}
function ring(parent,x,z,rx,rz,color,y=.5,thickness=.24){const points=[];for(let i=0;i<=100;i++){const t=i/100*Math.PI*2;points.push(new THREE.Vector3(x+Math.cos(t)*rx,y,z+Math.sin(t)*rz));}const curve=new THREE.CatmullRomCurve3(points);const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,100,thickness,4,false),mat(color));parent.add(mesh);return mesh;}
function ellipse(parent,x,z,rx,rz,color,y=.3){const m=cylinder(parent,x,y,z,1,.15,color,64);m.scale.set(rx,1,rz);return m;}

function buildGround(){
 box(model,0,-2.9,0,293,5.5,550,'#c2d0c6');
 box(model,0,-.22,0,290,.4,546,'#b4c8aa');
 // River banks and water, traced across the north campus.
 box(model,0,.03,-99,291,.25,17,'#93b6b7');box(model,0,.2,-109,291,.45,2,'#e0e0cf');box(model,0,.2,-89,291,.45,2,'#e0e0cf');
 for(let x=-140;x<140;x+=11)box(model,x,.2,-99,5,.03,.18,'#b9d4d2');
 road([[115,811],[455,818],[680,843],[955,892]],14,'#8c9e9e');
 for(let x=-133;x<135;x+=8)box(model,x,.31,-10+x*.09,3,.03,.35,'#ece7c6');
 // Northern outer loop and main avenues.
 road([[218,104],[215,524],[427,526],[431,780]],5);
 road([[218,104],[858,104],[866,523],[662,525],[657,782]],5);
 road([[428,789],[423,562],[436,303],[545,302],[558,115]],6);
 road([[658,789],[656,543],[653,302],[814,302]],6);
 road([[221,335],[423,335]],4);road([[218,456],[414,456]],4);
 road([[369,184],[540,184]],4);road([[591,127],[588,288],[824,288]],4);
 road([[430,557],[656,557]],5);road([[428,700],[652,700]],5);
 road([[429,706],[204,706]],4);road([[656,692],[911,692]],4);
 road([[658,560],[918,560],[918,792]],4);
 // Crossing bridges preserve the river through campus.
 road([[428,531],[428,584]],8,'#e0ddcb',.8);road([[656,531],[656,584]],8,'#e0ddcb',.8);
 // South campus loop, teaching precinct and residential streets.
 road([[447,870],[445,951],[372,1063],[353,1186],[206,1191],[151,1409],[401,1415],[413,1520]],5);
 road([[601,870],[637,905],[677,1024],[718,1093],[840,1110],[842,1408],[635,1429],[610,1522],[609,1668],[269,1671]],6);
 road([[402,1515],[415,1430],[624,1429]],5);road([[290,1530],[614,1523]],5);
 road([[354,1189],[820,1200]],5);road([[424,1202],[425,1411]],4);
 road([[628,1202],[625,1419]],5);road([[725,1204],[726,1399]],4);
 road([[206,1290],[424,1290]],3);road([[344,1210],[341,1399]],3);
 road([[208,840],[200,1046],[349,1061]],4);road([[364,842],[386,883],[380,980]],3);
 road([[276,1446],[275,1620],[612,1620]],4);
 // Plazas and green circles.
 const [lx,lz]=coords(545,427);ellipse(model,lx,lz,34,35,'#dfdfd0',.25);ellipse(model,lx,lz,30,31,'#a9c399',.35);
 ring(model,lx,lz,33,34,'#f2ecd9',.47,.85);
 const [sx,sz]=coords(531,1057);ellipse(model,sx,sz,51,32,'#dadccd');ellipse(model,sx,sz,37,24,'#9dbb90',.4);ring(model,sx,sz,43,28,'#f1ecda',.5,.8);
 ellipse(model,sx,sz,7,5,'#7faab0',.6);ring(model,sx,sz,8,6,'#e6e3d0',.7,.6);
 for(let i=0;i<6;i++){let z=-81+i*3.5;box(model,3,.6+i*.12,z,45-i*4,.4,1.6,'#e1dfca');}
 obstacle.push([lx,lz,75,78],[sx,sz,112,77],[3,-70,50,34]);
}

function stadium(b,g){
 // Capsule running track, not an oval, with nested lane boundaries.
 const shape=(w,d)=>{const s=new THREE.Shape(),r=w/2,t=d/2-r;s.moveTo(-r,-t);s.lineTo(-r,t);s.absarc(0,t,r,Math.PI,0,true);s.lineTo(r,-t);s.absarc(0,-t,r,0,-Math.PI,true);return s;};
 const surface=(w,d,color,y)=>{const m=new THREE.Mesh(new THREE.ShapeGeometry(shape(w,d),48),mat(color));m.rotation.x=-Math.PI/2;m.position.y=y;g.add(m);};
 surface(b.w,b.d,'#b97561',.28);
 for(let i=0;i<5;i++){const s=shape(b.w-i*1.5,b.d-i*1.5);const pts=s.getPoints(100).map(p=>[p.x,.34+i*.015,-p.y]);line(g,pts,'#ead6bf');}
 surface(b.w-8,b.d-8,'#729868',.46);
 box(g,0,.6,0,b.w-11,.08,b.d-20,'#87aa73');
 for(let i=0;i<8;i++)if(i%2===0)box(g,0,.65,-(b.d-20)/2+(i+.5)*(b.d-20)/8,b.w-11,.04,(b.d-20)/8,'#90b47c');
 const w=(b.w-13)/2,d=(b.d-23)/2;
 line(g,[[-w,.73,-d],[w,.73,-d],[w,.73,d],[-w,.73,d],[-w,.73,-d]],'#e5ebd4');line(g,[[-w,.73,0],[w,.73,0]],'#e5ebd4');ring(g,0,0,3,3,'#e5ebd4',.73,.1);
 for(const z of [-d,d]){line(g,[[-4,.73,z],[-4,.73,z-Math.sign(z)*5],[4,.73,z-Math.sign(z)*5],[4,.73,z]],'#e5ebd4');box(g,0,1.4,z,4,2.3,.25,'#eee8d8');}
 box(g,-b.w/2-1.5,1.4,0,2,2.8,b.d*.5,'#c8c7b4');
}
function basketball(b,g){
 box(g,0,.4,0,b.w, .8,b.d,'#d9d8c3');
 const n=Math.max(1,Math.floor(b.w/12));for(let i=0;i<n;i++){const x=-b.w/2+(i+.5)*b.w/n,w=b.w/n-1.2,d=b.d-2;
 box(g,x,.85,0,w,.1,d,'#779b9b');box(g,x,.93,0,w*.73,.1,d*.8,'#b98369');
 line(g,[[x-w*.42,1,-d*.44],[x+w*.42,1,-d*.44],[x+w*.42,1,d*.44],[x-w*.42,1,d*.44],[x-w*.42,1,-d*.44]],'#f0ead6');line(g,[[x-w*.42,1,0],[x+w*.42,1,0]],'#f0ead6');ring(g,x,0,1.8,1.8,'#f0ead6',1,.09);
 for(const z of [-d*.4,d*.4]){box(g,x,1.8,z,.18,3,.18,'#ece7d9');box(g,x,3.1,z,1.8,1.2,.15,'#e4e2cd');}}
}
const architecture=createArchitecture({box,mat,cylinder});
function makeBuilding(b){
 const g=new THREE.Group();g.position.set(b.x,0,b.z);g.name=b.name;g.userData={id:b.id,name:b.name,category:b.category,campus:b.campus,accuracy:evidence(b).status};
 if(!architecture.build(b,g)){if(b.type==='track')stadium(b,g);else basketball(b,g);}
 g.traverse(o=>{if(o.isMesh){o.userData.buildingId=b.id;meshes.push(o);}});groups.set(b.id,g);model.add(g);obstacle.push([b.x,b.z,b.w+5,b.d+5]);
 const el=document.createElement('button');el.className='label'+(['library','southtrack','northtrack','tech','food2','gate'].includes(b.id)?' landmark':'');el.textContent=b.name;el.setAttribute('aria-label',`查看${b.name}`);el.onclick=()=>selectBuilding(b.id);$('#labels').append(el);
 labels.push({b,el,position:new THREE.Vector3(b.x,b.type==='library'?35:b.type==='track'||b.type==='basket'?2:b.h+3,b.z)});
}
function distanceToRoad(x,z,r){const[a,b,c,d,w]=r;const dx=c-a,dz=d-b;const t=THREE.MathUtils.clamp(((x-a)*dx+(z-b)*dz)/(dx*dx+dz*dz),0,1);return Math.hypot(x-a-t*dx,z-b-t*dz)-w/2;}
function addTrees(){
 let seed=7123;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};const positions=[];
 for(let i=0;i<6500&&positions.length<780;i++){
 const x=(rnd()-.5)*279,z=(rnd()-.5)*533;
 if(z>-110&&z<-88)continue;
 if(obstacle.some(([a,b,w,d])=>Math.abs(x-a)<w/2+1.8&&Math.abs(z-b)<d/2+1.8))continue;
 if(roadSegments.some(r=>distanceToRoad(x,z,r)<2))continue;
 if(positions.some(p=>Math.hypot(p.x-x,p.z-z)<4.2))continue;
 positions.push({x,z,s:.7+rnd()*.65,c:rnd()});
 }
 const leaves=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(2.7,1),mat('#66865a'),positions.length);
 const trunks=new THREE.InstancedMesh(new THREE.CylinderGeometry(.35,.55,3,5),mat('#9b927a'),positions.length);
 leaves.name='Campus_trees';trunks.name='Tree_trunks';const dummy=new THREE.Object3D();
 positions.forEach((p,i)=>{dummy.position.set(p.x,4*p.s,p.z);dummy.scale.set(p.s,p.s*1.12,p.s);dummy.rotation.y=p.c*6;dummy.updateMatrix();leaves.setMatrixAt(i,dummy.matrix);leaves.setColorAt(i,new THREE.Color().setHSL(.23+p.c*.055,.23+p.c*.12,.34+p.c*.11));dummy.position.y=1.5*p.s;dummy.scale.setScalar(p.s);dummy.updateMatrix();trunks.setMatrixAt(i,dummy.matrix);});leaves.castShadow=true;leaves.receiveShadow=true;trunks.castShadow=true;model.add(leaves,trunks);
}

function renderList(){
 const q=$('#search').value.trim().toLowerCase();const filtered=buildings.filter(b=>(category==='全部'||b.category===category)&&(currentView==='all'||b.campus===(currentView==='north'?'北校区':'南校区'))&&`${b.name}${b.campus}${b.category}`.toLowerCase().includes(q));
 $('#resultCount').textContent=`${filtered.length} 处校园地点`;
 $('#buildingList').replaceChildren();
 for(const b of filtered){const btn=document.createElement('button');btn.className='building-row'+(selected===b.id?' selected':'');btn.innerHTML=`<span class="category-icon" style="--accent:${categories[b.category]}">${b.category==='运动'?'◉':b.category==='出入口'?'⌑':'▤'}</span><span><strong>${b.name}</strong><small>${b.campus} · ${b.category}</small></span><span class="arrow">↗</span>`;btn.onclick=()=>selectBuilding(b.id);$('#buildingList').append(btn);}
 if(!filtered.length)$('#buildingList').innerHTML='<p class="empty">没有找到对应建筑<br><small>试试其他名称或切换校区</small></p>';
}
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').classList.remove('show'),3000);}
function fly(target,pos){if(!controls)return;controls.autoRotate=false;$('#rotate').setAttribute('aria-pressed','false');tween={start:performance.now(),from:camera.position.clone(),to:pos.clone(),oldTarget:controls.target.clone(),target:target.clone()};if(matchMedia('(prefers-reduced-motion: reduce)').matches)tween.start-=1000;}
function fitView(view=currentView){if(!controls)return;topView=false;$('#top').setAttribute('aria-pressed','false');const z=view==='north'?-133:view==='south'?133:0;const target=new THREE.Vector3(0,0,z);const direction=new THREE.Vector3(.42,.82,.55).normalize();const right=new THREE.Vector3().crossVectors(new THREE.Vector3(0,1,0),direction).normalize();const up=new THREE.Vector3().crossVectors(direction,right);const tanY=Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*.76,tanX=tanY*camera.aspect*.91;let dist=0;for(const x of [-147,147])for(const dz of [view==='all'?-277:-142,view==='all'?277:142])for(const y of [0,40]){const p=new THREE.Vector3(x,y,dz);dist=Math.max(dist,p.dot(direction)+Math.abs(p.dot(up))/tanY,p.dot(direction)+Math.abs(p.dot(right))/tanX);}fly(target,target.clone().addScaledVector(direction,dist));}
function chooseView(v){currentView=v;document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===v));renderList();fitView(v);}
function clearSelection(){if(selected){groups.get(selected)?.traverse(o=>{if(o.isMesh&&o._originalMaterial){o.material.dispose();o.material=o._originalMaterial;delete o._originalMaterial;}});}selected=null;$('#detail').hidden=true;renderList();}
function selectBuilding(id){
 clearSelection();const b=buildings.find(x=>x.id===id);if(!b)return;selected=id;
 groups.get(id)?.traverse(o=>{if(o.isMesh){o._originalMaterial=o.material;o.material=o.material.clone();o.material.emissive.set('#27796a');o.material.emissiveIntensity=.22;}});
 const detail=$('#detail');detail.hidden=false;const ref=evidence(b);const photo=ref.image||b.photo;
 detail.innerHTML=`<button class="close" aria-label="关闭建筑介绍">×</button>${photo?`<a href="assets/${photo}" target="_blank" rel="noopener"><img src="assets/${photo}" alt="${b.name}建模参考，${ref.status}"></a>`:''}<div class="detail-body"><span class="tag">${b.campus} / ${b.category}</span><h2>${b.name}</h2><span class="evidence-badge">${ref.status}</span><p>${ref.note}</p><div class="angle-controls" aria-label="建筑观察角度"><button data-angle="0">正面</button><button data-angle="90">侧面</button><button data-angle="180">背面</button><button data-angle="270">另一侧</button></div><button class="orbit-building">环绕这栋建筑</button><a class="source-link" href="${ref.url}" target="_blank" rel="noopener">查看参考来源 ↗</a><div class="detail-footer">照片仅供外观参考 · 高度与尺寸为估计</div></div>`;
 detail.scrollTop=0;
 detail.querySelectorAll('[data-angle]').forEach(button=>button.onclick=()=>{const angle=Number(button.dataset.angle)*Math.PI/180,d=Math.max(75,b.w*1.8,b.d*1.8);fly(new THREE.Vector3(b.x,b.h*.4,b.z),new THREE.Vector3(b.x+Math.sin(angle)*d,b.h*.5+d*.45,b.z+Math.cos(angle)*d));});
 detail.querySelector('.close').onclick=clearSelection;detail.querySelector('.orbit-building').onclick=()=>{if(!controls)return;controls.autoRotate=!controls.autoRotate;$('#rotate').setAttribute('aria-pressed',String(controls.autoRotate));};
 if(controls){const target=new THREE.Vector3(b.x,b.h*.25,b.z);const d=Math.max(80,b.w*2.2,b.d*2);fly(target,new THREE.Vector3(b.x+d*.6,b.h+d*.75,b.z+d*.8));topView=false;$('#top').setAttribute('aria-pressed','false');}
 renderList();$('#sidebar').classList.remove('open');$('#menu').setAttribute('aria-expanded','false');
}

function setupUI(){
 for(const c of ['全部',...Object.keys(categories)]){const b=document.createElement('button');b.textContent=c;b.className=c==='全部'?'active':'';b.onclick=()=>{category=c;$('#filters').querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));renderList();};$('#filters').append(b);}
 $('#search').addEventListener('input',renderList);document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{clearSelection();chooseView(b.dataset.view);});
 $('#reset').onclick=()=>{clearSelection();chooseView('all');};
 $('#top').onclick=()=>{if(!controls)return;topView=!topView;$('#top').setAttribute('aria-pressed',String(topView));const t=controls.target.clone(),d=camera.position.distanceTo(t);fly(t,topView?new THREE.Vector3(t.x,t.y+d,t.z+.1):new THREE.Vector3(t.x+d*.42,t.y+d*.82,t.z+d*.55));};
 $('#toggleLabels').onclick=()=>{labelsOn=!labelsOn;$('#toggleLabels').setAttribute('aria-pressed',String(labelsOn));};
 $('#rotate').onclick=()=>{if(!controls)return;tween=null;controls.autoRotate=!controls.autoRotate;$('#rotate').setAttribute('aria-pressed',String(controls.autoRotate));};
 const zoom=f=>{if(!controls)return;const offset=camera.position.clone().sub(controls.target).multiplyScalar(f);offset.clampLength(controls.minDistance,controls.maxDistance);fly(controls.target,controls.target.clone().add(offset));};$('#zoomIn').onclick=()=>zoom(.78);$('#zoomOut').onclick=()=>zoom(1.28);
 $('#reference').onclick=()=>$('#referenceDialog').showModal();$('#closeReference').onclick=()=>$('#referenceDialog').close();
 document.querySelectorAll('[data-ref]').forEach(b=>b.onclick=()=>{$('#refImage').src=`assets/${b.dataset.ref}`;$('#refImage').alt=b.textContent;document.querySelectorAll('[data-ref]').forEach(x=>x.classList.toggle('active',x===b));});
 $('#menu').onclick=()=>{const open=$('#sidebar').classList.toggle('open');$('#menu').setAttribute('aria-expanded',String(open));};
 document.addEventListener('keydown',e=>{if(e.key==='/'&&document.activeElement.tagName!=='INPUT'){e.preventDefault();$('#sidebar').classList.add('open');$('#search').focus();}if(e.key==='Escape'){clearSelection();$('#sidebar').classList.remove('open');$('#menu').setAttribute('aria-expanded','false');}});
 $('#export').onclick=async()=>{if(!renderer)return;const button=$('#export');button.disabled=true;toast('正在准备 GLB 模型…');try{clearSelection();const {GLTFExporter}=await import('./vendor/GLTFExporter.js');const result=await new GLTFExporter().parseAsync(model,{binary:true,onlyVisible:true});if(location.origin==='http://127.0.0.1:5173'){try{const response=await fetch('/api/export-model',{method:'POST',headers:{'Content-Type':'model/gltf-binary'},body:result});if(response.ok){toast('模型已保存到项目 models 文件夹');return;}}catch{ /* Static preview falls back to a browser download. */ }}const url=URL.createObjectURL(new Blob([result],{type:'model/gltf-binary'}));const a=document.createElement('a');a.href=url;a.download='ZUCC-campus-schematic.glb';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);toast('模型已导出，可在 Blender 中导入');}catch(e){console.error(e);toast('模型导出失败，请重试');}finally{button.disabled=false;}};
 renderList();
}

setupUI();
if(renderer){
 renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;$('#canvasMount').append(renderer.domElement);
 renderer.domElement.setAttribute('aria-label','校园三维视图，可使用鼠标旋转缩放；键盘用户可通过建筑目录定位');
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();toast('三维显示暂时中断，请刷新页面恢复');});
 controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.07;controls.maxPolarAngle=Math.PI*.485;controls.minDistance=35;controls.maxDistance=1650;controls.autoRotateSpeed=.45;controls.target.set(0,0,0);controls.addEventListener('start',()=>{tween=null;});
 scene.add(new THREE.HemisphereLight('#f7fbff','#829271',1.8));
 const sun=new THREE.DirectionalLight('#fff2d5',2.3);sun.position.set(-200,370,160);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-320,right:320,top:370,bottom:-370,near:1,far:900});sun.shadow.bias=-.001;sun.shadow.normalBias=.6;scene.add(sun);
 buildGround();buildings.forEach(makeBuilding);addTrees();
 const floor=box(scene,0,-7,0,4000,1,4000,'#e3edef');floor.receiveShadow=true;
 const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let down=null;
 const hit=e=>{const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);return raycaster.intersectObjects(meshes,false)[0];};
 renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,t:performance.now(),button:e.button};});
 renderer.domElement.addEventListener('pointerup',e=>{if(down&&down.button===0&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<6&&performance.now()-down.t<600){const h=hit(e);if(h)selectBuilding(h.object.userData.buildingId);}down=null;});
 renderer.domElement.addEventListener('pointermove',e=>{if(!e.buttons)renderer.domElement.style.cursor=hit(e)?'pointer':'grab';});
 function resize(){const w=viewport.clientWidth,h=viewport.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}
 new ResizeObserver(resize).observe(viewport);resize();camera.position.set(330,570,430);fitView();$('#loading').hidden=true;
 const projected=new THREE.Vector3();let frame=0;
 function updateLabels(){const used=[];const dist=camera.position.distanceTo(controls.target);const sorted=[...labels].sort((a,b)=>(b.b.id===selected?10:b.el.classList.contains('landmark')?2:0)-(a.b.id===selected?10:a.el.classList.contains('landmark')?2:0));
 for(const l of sorted){const landmark=l.el.classList.contains('landmark');const allowed=labelsOn&&(l.b.id===selected||((dist<360||landmark)&&(category==='全部'||l.b.category===category)&&(currentView==='all'||l.b.campus===(currentView==='north'?'北校区':'南校区'))));if(!allowed){l.el.style.display='none';continue;}
 projected.copy(l.position).project(camera);const x=(projected.x*.5+.5)*viewport.clientWidth,y=(-projected.y*.5+.5)*viewport.clientHeight;const w=l.b.name.length*12+20;const rect={x:x-w/2,y:y-25,w,h:27};
 const valid=projected.z>-1&&projected.z<1&&x>15&&x<viewport.clientWidth-15&&y>85&&y<viewport.clientHeight-120&&!used.some(r=>rect.x<r.x+r.w+5&&rect.x+rect.w+5>r.x&&rect.y<r.y+r.h+5&&rect.y+rect.h+5>r.y);
 l.el.style.display=valid?'block':'none';l.el.classList.toggle('selected',l.b.id===selected);if(valid){l.el.style.left=`${x}px`;l.el.style.top=`${y}px`;used.push(rect);}}
 }
 function animate(t){requestAnimationFrame(animate);if(tween){const p=THREE.MathUtils.clamp((t-tween.start)/850,0,1),e=p*p*(3-2*p);camera.position.lerpVectors(tween.from,tween.to,e);controls.target.lerpVectors(tween.oldTarget,tween.target,e);if(p===1)tween=null;}
 controls.update();renderer.render(scene,camera);if(frame++%3===0){updateLabels();$('#compassNeedle').style.transform=`rotate(${-controls.getAzimuthalAngle()*180/Math.PI}deg)`;}}
 requestAnimationFrame(animate);
}
