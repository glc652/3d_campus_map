import * as THREE from 'three';
import {mergeGeometries} from './vendor/BufferGeometryUtils.js';

// Dimensions remain estimated. Photo identification and inferred details are kept separate.
const gallery='https://www.hzcu.edu.cn/xysh/xyfg.htm';
export const references={
 library:{image:'ref-23.png',url:gallery,status:'实景核对',note:'依据官网多角度照片：玻璃锥厅、深色竖向遮阳构件、石材馆翼。尺寸及不可见背面为估计。'},
 wenyuan:{image:'ref-46.jpeg',url:'https://english.hzcu.edu.cn/info/1041/1013.htm',status:'实景核对',note:'官网明确标注 Wenyuan Apartment。还原橙色端墙、内院阳台、入口玻璃门厅；楼翼长度与朝向结合布局图估计。'},
 eastcourt:{image:'ref-50.jpg',url:'https://english.hzcu.edu.cn/info/1037/1024.htm',status:'实景核对',note:'官网东体楼实景。修正原版仅有球场的表达，补回低层楼体、外廊和粉红色女儿墙。'},
 gate:{image:'gate.webp',url:'assets/gate.webp',status:'用户实景参考',note:'依据原素材中的入口照片，改为校名景墙、格栅与通行空间；场地尺寸为示意。'},
 food2:{image:'ref-30.png',url:gallery,status:'外观推定',note:'弧形体量依据校园鸟瞰图；金属屋面与外楼梯参考官网图库中的体育建筑，图库未明确标注楼名，归属待核实。'},
 tech:{url:'https://zdjy.zju.edu.cn/review/toReview?dbID=23&dbName=ZHEJIANGDAXUEBAO&sysID=34998',status:'体量校正',note:'校报记载科技综合楼十二层顶平台；据此提高主楼并参考鸟瞰图调整塔楼与低层裙房。立面尚无对应近景，按图推定。'},
};
export function evidence(b){return references[b.id]||{url:gallery,status:'外观推定',note:'位置与组合轮廓依据原校园布局、鸟瞰图；窗格、色彩、屋顶细节为近似表达，尚未取得可明确对应本楼的外立面照片。'};}

// Each mapped building has an explicit massing/finish profile. Repeated wings share construction.
const profiles={
 hall:['hall',5,'stone'],zhishan:['residence',6,'warm'],practice:['lab',4,'cool'],civil:['lab',2,'warm'],eng4:['teaching',3,'cool'],eng13:['triple',4,'cool'],
 northfood:['dining',3,'warm'],shop:['shop',2,'warm'],weixue:['residence',7,'cream'],qiuzhen:['residence',7,'cream'],sirui:['residence',7,'cream'],shangya:['residence',7,'cream'],
 northgym:['sports',2,'warm'],aux:['lab',2,'cool'],ta:['teaching',4,'warm'],tb:['teaching',4,'warm'],te:['teaching',3,'cool'],tf:['teaching',3,'cool'],tc:['teaching',4,'warm'],td:['teaching',4,'warm'],
 sci1:['teaching',5,'rose'],sci2:['teaching',5,'rose'],sci3:['teaching',5,'rose'],sci4:['court',6,'rose'],sci5:['triple',6,'rose'],
 arts1:['teaching',4,'stone'],arts2:['teaching',4,'stone'],arts3:['teaching',4,'stone'],arts5:['teaching',4,'stone'],uw:['teaching',5,'stone'],
 jerry:['tower',12,'stone'],admin:['court',6,'stone'],lab:['court',6,'cool'],teach6:['teaching',5,'cool'],teach5:['teaching',5,'cool'],teach4:['teaching',5,'cool'],teach3:['court',5,'cool'],teach7:['teaching',4,'cool'],medicine:['lab',6,'cool'],xinrui:['tower',10,'warm'],
 westcourt:['sports',2,'rose'],eastcourt:['sports',2,'rose'],jinru:['residence',5,'warm'],zhiyuan:['residence',6,'cream'],teacher:['residence',7,'warm'],dorm:['residence',6,'cream'],mingde:['residence',6,'cream'],mingde2:['residence',6,'cream'],dormwest:['residence',6,'cream'],jingcheng:['residence',6,'cream'],jingcheng2:['residence',6,'cream'],chenyuan:['dining',2,'warm'],startup:['shop',1,'warm'],gym:['sports',2,'cool'],chongxian1:['residence',6,'cream'],chongxian23:['paired',6,'cream'],hongyi:['paired',6,'cream'],teach1:['court',5,'cool'],teach2:['court',5,'cool'],westaux:['teaching',2,'warm'],eastaux:['teaching',2,'warm'],
};
const palettes={warm:['#d4bf9e','#bba47f'],cream:['#e4dfca','#bb815d'],cool:['#dce0d9','#9daba8'],rose:['#d8c3b6','#bd8f7d'],stone:['#c9bba4','#a99981']};

export function createArchitecture({box,mat,cylinder}){
 const glass='#526e79',frame='#e9e4d5',roof='#a6aaa4',rail='#738788';
 function beam(g,a,b,r,color){const direction=new THREE.Vector3(...b).sub(new THREE.Vector3(...a));const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,direction.length(),5),mat(color));m.position.copy(new THREE.Vector3(...a).add(new THREE.Vector3(...b)).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction.normalize());g.add(m);}
 function sign(g,text,x,y,z,w){const c=document.createElement('canvas');c.width=512;c.height=96;const ctx=c.getContext('2d');ctx.fillStyle='#eee8d6';ctx.fillRect(0,0,512,96);ctx.fillStyle='#4e6262';ctx.font='600 40px Microsoft YaHei, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,48,490);const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;const m=new THREE.Mesh(new THREE.PlaneGeometry(w,w*96/512),new THREE.MeshStandardMaterial({map:tex,roughness:.8}));m.position.set(x,y,z);g.add(m);return m;}
 function parapet(g,x,z,w,d,h,color){box(g,x,h+.16,z,w,.32,d,roof);for(const s of [-1,1]){box(g,x,h+.65,z+s*d/2,w+.3,1,.28,color);box(g,x+s*w/2,h+.65,z,.28,1,d,color);}}
 function entrance(g,x,z,w){box(g,x,1.6,z,w,3.2,.2,glass);for(let i=-1;i<=1;i++)box(g,x+i*w*.45,1.6,z+.15,.15,3.3,.2,frame);box(g,x,3.55,z+.7,w+1.5,.25,2,frame);for(const s of [-1,1])box(g,x+s*(w/2+.5),1.8,z+1,.18,3.6,.18,rail);for(let i=0;i<3;i++)box(g,x,.12+i*.12,z+1.4-i*.3,w+2,.24,.45,'#c6c6b9');}
 function block(g,x,z,w,d,h,floors,palette,balconies=false,endBlank=false){
  const [wall,accent]=palettes[palette];box(g,x,h/2,z,w,h,d,wall);box(g,x,.3,z,w+.6,.6,d+.6,accent);parapet(g,x,z,w,d,h,wall);
  const storey=h/floors,bays=Math.max(2,Math.round(w/3.2)),step=w/bays;
  for(const s of [-1,1]){
   for(let k=0;k<floors;k++){
    const y=(k+.54)*storey,face=z+s*(d/2+.03);
    for(let i=0;i<bays;i++){
     const xx=x-w/2+(i+.5)*step,ww=step*.66,hh=storey*.52;
     box(g,xx,y,face,ww+.2,hh+.2,.12,frame);box(g,xx,y,face+s*.09,ww,hh,.1,glass);
     box(g,xx,y,face+s*.16,.07,hh,.1,frame);box(g,xx,y-hh*.16,face+s*.16,ww,.065,.1,frame);
     if(k>0&&i%2===0&&!balconies){box(g,xx+ww*.54,y-hh*.35,face+s*.35,.58,.43,.45,'#c5c7be');}
    }
    box(g,x,k*storey+.15,z+s*(d/2+.08),w,.22,.18,frame);
    if(balconies){
     box(g,x,k*storey+.15,z+s*(d/2+.62),w,.24,1.3,frame);
     for(const r of [.65,.95,1.25])box(g,x,k*storey+r,z+s*(d/2+1.22),w,.085,.085,rail);
     for(let i=0;i<=bays;i++)box(g,x-w/2+i*step,k*storey+storey/2,z+s*(d/2+.62),.25,storey,1.4,wall);
    }
   }
   if(!endBlank)for(let k=0;k<floors;k++)for(let i=0;i<Math.max(1,Math.floor(d/4));i++){const zz=z-d/2+(i+.5)*d/Math.max(1,Math.floor(d/4));box(g,x+s*(w/2+.04),(k+.55)*storey,zz,.12,storey*.5,1.6,glass);}
   if(balconies||endBlank)box(g,x+s*(w/2+.08),h*.52,z,.18,h*.94,d*.8,accent);
  }
  // Small roof access volume, not a full second slab.
  box(g,x+w*.26,h+.95,z-d*.18,Math.min(3,w*.2),1.7,Math.min(3,d*.4),wall);
 }
 function staircase(g,x,z,h,w=2.3){box(g,x,h/2,z,w,h,2.8,'#b6c7c6');for(let y=1;y<h;y+=2.7){box(g,x,y,z+1.47,w,.13,.13,frame);box(g,x,y,z-1.47,w,.13,.13,frame);}for(const s of [-1,1])box(g,x+s*w/2,h/2,z,.2,h,3,frame);}
 function curveRoof(g,w,d,h){const pts=[];for(let i=0;i<=24;i++){const x=-w/2+i*w/24;pts.push(new THREE.Vector2(x,h+1.2+2.5*(2*x/w)**2));}for(let i=24;i>=0;i--){const x=-w/2+i*w/24;pts.push(new THREE.Vector2(x,h+.8+2.5*(2*x/w)**2));}const m=new THREE.Mesh(new THREE.ExtrudeGeometry(new THREE.Shape(pts),{depth:d,bevelEnabled:false,steps:1}),mat('#b9c5c4'));m.position.z=-d/2;g.add(m);for(let z=-d/2;z<=d/2;z+=2){for(let i=1;i<pts.length/2;i++)beam(g,[pts[i-1].x,pts[i-1].y+.06,z],[pts[i].x,pts[i].y+.06,z],.045,'#7d9396');}}
 function generic(b,g){const [type,n,p]=profiles[b.id]||['teaching',5,'cool'],{w,d,h}=b;
  if(type==='court'){
   block(g,0,-d*.34,w,d*.3,h,n,p);block(g,-w*.36,d*.12,w*.28,d*.63,h,n,p);block(g,w*.36,d*.12,w*.28,d*.63,h,n,p);entrance(g,0,-d*.17,Math.min(7,w*.3));
  }else if(type==='triple'){
   for(let i=-1;i<=1;i++)block(g,i*w*.34,0,w*.29,d,h-(i===0?0:1),n,p);block(g,0,-d*.27,w,d*.2,h*.42,2,p);
  }else if(type==='paired'){
   block(g,0,-d*.28,w,d*.34,h,n,p,true);block(g,0,d*.28,w,d*.34,h,n,p,true);block(g,-w*.4,0,w*.17,d*.25,h*.65,4,p);
  }else if(type==='residence'){
   block(g,0,0,w*.94,d*.8,h,n,p,true,true);staircase(g,w*.25,-d*.47,h);entrance(g,0,d*.5,Math.min(5,w*.3));
  }else if(type==='tower'){
   block(g,0,0,w*.84,d*.83,h,n,p);block(g,0,d*.2,w,d*.55,h*.18,2,p);for(const x of [-w*.42,w*.42])box(g,x,h/2+1,0,.65,h+2,d*.88,palettes[p][1]);box(g,0,h+2.5,0,w*.88,.7,d*.88,palettes[p][1]);entrance(g,0,d*.5,6);
  }else if(type==='sports'){
   block(g,0,0,w,d,h,2,p);box(g,0,h*.8,d*.51,w*.95,.55,.5,palettes[p][1]);box(g,0,3,d*.52,w*.9,.3,1.2,frame);for(let x=-w*.42;x<w*.5;x+=3)box(g,x,1.5,d*.56,.25,3,.3,frame);box(g,0,h+.8,0,w*.4,1.1,d*.75,palettes[p][1]);entrance(g,0,d/2,Math.min(5,w*.4));
  }else if(type==='hall'){
   block(g,0,0,w,d,h,3,p);for(let z=-d*.45;z<d*.5;z+=2)box(g,w*.51,h*.55,z,.35,h*.7,.4,palettes[p][1]);
  }else{
   block(g,0,0,w,d,h,n,p,false,true);staircase(g,w*.28,-d*.44,h,Math.min(2.8,w*.18));entrance(g,0,d*.51,Math.min(5,w*.35));
   if(type==='dining'||type==='shop')for(let x=-w*.4;x<w*.5;x+=3.2)box(g,x,2.3,d*.52,2.5,3,.15,glass);
  }
  sign(g,b.name,0,Math.min(4.8,h*.7),d/2+1.05,Math.min(7,w*.65));
 }
 function library(b,g){const {w,d}=b;
  block(g,-w*.35,0,w*.24,d,24,6,'stone');block(g,w*.12,-d*.3,w*.66,d*.34,18,4,'stone');block(g,w*.35,d*.1,w*.25,d*.47,12,3,'stone');
  // Glazed reading hall and pronounced dark exterior sunshade frame.
  box(g,-1,9,0,w*.52,18,d*.35,glass);
  for(let x=-w*.27;x<w*.28;x+=2.5){box(g,x,10,d*.18,.28,20,.8,'#334955');box(g,x,19,0,.24,.35,d*.48,'#334955');}
  for(let y=1;y<19;y+=1.2)box(g,0,y,d*.195,w*.57,.1,.3,'#869da1');
  for(let z=-d*.25;z<d*.22;z+=.8)box(g,0,19.5,z,w*.58,.14,.15,'#334955');
  // Stone entry drum, faceted glazing, triangular lattice and a real helical crown.
  const cx=3,cz=d*.27,r=6.3,base=3.7,height=24;
  cylinder(g,cx,base-.45,cz,r+.3,.9,'#c5af92',24);box(g,cx,1.7,cz,r*1.45,3.4,r*1.45,glass);
  for(let i=0;i<8;i++){const a=i*Math.PI/4;box(g,cx+Math.cos(a)*r*.91,1.8,cz+Math.sin(a)*r*.91,.55,3.6,.55,'#c5af92');}
  const cone=new THREE.Mesh(new THREE.ConeGeometry(r,height,20,1),new THREE.MeshStandardMaterial({color:'#80a8ad',roughness:.29,metalness:.32}));cone.position.set(cx,base+height/2,cz);g.add(cone);
  for(let k=0;k<6;k++){const y0=base+k*height/6,y1=base+(k+1)*height/6,r0=r*(1-k/6),r1=r*(1-(k+1)/6);for(let i=0;i<20;i++){const a=i*Math.PI/10,a1=(i+1)*Math.PI/10;beam(g,[cx+Math.cos(a)*r0,y0,cz+Math.sin(a)*r0],[cx+Math.cos(a1)*r0,y0,cz+Math.sin(a1)*r0],.045,'#d5dfd5');beam(g,[cx+Math.cos(a)*r0,y0,cz+Math.sin(a)*r0],[cx+Math.cos(a1)*r1,y1,cz+Math.sin(a1)*r1],.06,'#c8d8d2');beam(g,[cx+Math.cos(a1)*r0,y0,cz+Math.sin(a1)*r0],[cx+Math.cos(a)*r1,y1,cz+Math.sin(a)*r1],.045,'#b5ccca');}}
  const helix=[];for(let i=0;i<=150;i++){const t=i/150;helix.push(new THREE.Vector3(cx+(1-t)*1.8*Math.cos(t*10*Math.PI),base+height-1.6+t*4,cz+(1-t)*1.8*Math.sin(t*10*Math.PI)));}g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(helix),150,.1,6,false),mat('#766c5e')));
  for(let i=0;i<4;i++)box(g,0,.12+i*.16,d*.56-i*.6,w*.85,.25,1.2,'#cdcbbd');
  // Open rectangular frame visible on the high west wing.
  for(const x of [-w*.45,-w*.25])box(g,x,25.7,d*.3,.6,3.4,.7,'#c2b399');box(g,-w*.35,27.2,d*.3,w*.22,.6,.7,'#c2b399');
 }
 function wenyuan(b,g){const {w,d,h}=b;const sub=new THREE.Group();g.add(sub);sub.rotation.y=Math.PI/2;
  // Wide east-west footprint represents two long wings and an internal court.
  for(const x of [-d*.34,d*.34]){const wing=new THREE.Group();wing.position.x=x;wing.rotation.y=Math.PI/2;sub.add(wing);block(wing,0,0,w*.87,d*.25,h,6,'cream',true,true);}
  box(sub,0,2,-w*.39,d*.65,4,3.8,glass);for(const x of [-d*.4,0,d*.4])box(sub,x,3,-w*.46,.5,6,.6,frame);box(sub,0,5.85,-w*.46,d*.82,.5,.8,frame);box(sub,0,5.6,-w*.42,d*.8,.12,3,glass);sign(sub,'问源楼',0,3.5,-w*.465,d*.6).rotation.y=Math.PI;
 }
 function food(b,g){block(g,0,0,b.w*.78,b.d*.9,b.h*.63,3,'cool');box(g,0,b.h*.82,0,b.w*.8,b.h*.36,b.d*.9,glass);for(let z=-b.d*.44;z<b.d*.45;z+=3)box(g,b.w*.405,b.h*.8,z,.3,b.h*.4,.3,frame);curveRoof(g,b.w*.96,b.d*.96,b.h);for(let i=0;i<18;i++)box(g,-b.w*.47,.25+i*.45,-b.d*.38+i*.6,3,.5,1.2,'#b9876b');entrance(g,0,b.d*.46,8);}
 function tech(b,g){block(g,0,0,b.w*.56,b.d*.61,b.h,12,'warm');block(g,-b.w*.36,b.d*.06,b.w*.22,b.d*.65,b.h*.57,7,'warm');block(g,b.w*.36,b.d*.08,b.w*.22,b.d*.6,b.h*.45,5,'warm');block(g,0,b.d*.35,b.w*.65,b.d*.23,9,2,'warm');for(const x of [-b.w*.24,b.w*.24])box(g,x,b.h+1.3,0,.6,3,b.d*.64,frame);box(g,0,b.h+2.5,0,b.w*.52,.6,b.d*.64,frame);entrance(g,0,b.d*.48,7);sign(g,b.name,0,6,b.d*.48+.2,9);}
 function gate(b,g){box(g,0,.18,0,b.w+4,.36,8,'#d9d7c8');if(b.id==='gate'){box(g,-b.w*.18,1.45,0,b.w*.55,2.9,1.2,'#b9ab90');for(let x=-b.w*.45;x<b.w*.1;x+=.65)box(g,x,2.4,-.9,.15,4.6,.3,'#7d8882');sign(g,'浙大城市学院',-b.w*.18,1.65,.64,b.w*.48);}else{for(const x of [-b.w*.45,b.w*.45])box(g,x,1.5,0,1.8,3,2.2,'#c5bba4');box(g,-b.w*.27,1.35,0,b.w*.24,2.7,1.4,'#c5bba4');sign(g,b.name,-b.w*.27,1.7,.73,b.w*.22);}for(let x=b.w*.12;x<b.w*.4;x+=1.1)box(g,x,.65,1,.16,1.3,.16,rail);}
 // Merge repeated components per material per building, keeping picking and GLB export intact.
 function consolidate(g){g.updateMatrixWorld(true);const inverse=g.matrixWorld.clone().invert(),sets=new Map(),remove=[];g.traverse(o=>{if(!o.isMesh||o.material.map)return;const key=o.material.uuid;if(!sets.has(key))sets.set(key,{material:o.material,items:[]});const geo=o.geometry.clone();geo.applyMatrix4(inverse.clone().multiply(o.matrixWorld));sets.get(key).items.push(geo.index?geo.toNonIndexed():geo);remove.push(o);});for(const o of remove)o.removeFromParent();for(const {material,items} of sets.values()){const geometry=mergeGeometries(items,false);for(const item of items)item.dispose();const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);}}
 return {build(b,g){if(b.type==='track'||b.id==='eastball')return false;if(b.id==='library')library(b,g);else if(b.id==='wenyuan')wenyuan(b,g);else if(b.id==='tech')tech(b,g);else if(b.id==='food2')food(b,g);else if(b.type==='gate')gate(b,g);else generic(b,g);consolidate(g);return true;}};
}
