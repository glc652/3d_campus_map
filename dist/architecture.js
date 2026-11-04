import * as THREE from 'three';
import {mergeGeometries,mergeVertices} from './vendor/BufferGeometryUtils.js';

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
const timeSource='https://www.thepaper.cn/newsDetail_forward_27072018';
const welcomeSource='https://m.thepaper.cn/newsDetail_forward_28488813';
const dated=(image,url,published,note)=>({image,url,published,captured:'原文未单独注明拍摄日期',status:'近期照片局部核对',note});
Object.assign(references,{
 northgym:{url:'https://pi.zju.edu.cn/2021/0408/c67006a2589199/page.htm',status:'名称已核对 · 外观推定',note:'依据用户纠正及学院官方场馆管理文件，北校区场馆名称为工体馆。现有外形尚缺清晰近期外立面照片。'},
 xinrui:{image:'xinrui-current.jpg',url:'https://www.ssawhotels.com/order/hotel/J571024?cityCode=HZZJ1&hotelCode1=J571024',reviewed:'2026-09-30',status:'官网外观核对',note:'君亭酒店官网标明地址为湖州街28号欣瑞大厦。依当前展示的外观图重建玻璃塔楼、竖向金属肋、两级退台、玻璃顶部与入口门框；22层体量结合楼层使用资料校正，高度估计。照片未注明拍摄日期，背面为推定。'},
 library:dated('recent-library.gif',timeSource,'2024-04-16','学校官方延时摄影核对正面玻璃锥厅、石材馆翼与深色遮阳框架；背面、尺寸仍为估计。'),
 arts1:dated('recent-arts.gif',timeSource,'2024-04-16','原文明确标注“文一文二连廊”。补充钢框玻璃雨棚、架空连桥与拱形内立面；照片未覆盖的楼翼、背面沿用示意体量。'),
 arts2:dated('recent-arts.gif',timeSource,'2024-04-16','原文明确标注“文一文二连廊”。内侧补充暖色石材、连续拱形开口，与文一的玻璃连廊衔接；其余立面未取得近期全景。'),
 chenyuan:dated('recent-chenyuan.gif',timeSource,'2024-04-16','依据“晨苑外的林荫”实拍更新沿街餐厅：连续玻璃门面、黄绿色店招、细柱和入口雨檐。树木遮挡的上部与背面仍为估计。'),
 southgate:{url:'https://m.thepaper.cn/newsDetail_forward_7421232',image:'southgate-history.jpg',status:'历史照片参考 · 现状待核对',published:'2020-05-16',captured:'原文明确标注照片为1999年',note:'历史照片可见中央横向石材校名墙、两侧平顶门房与竖柱、开放通道及伸缩门。此次仅据此细化入口构成，校名采用现名；尚未核实近期外观，不能视为现状复原。'},
 tennis:{url:'https://english.hzcu.edu.cn/info/1037/1017.htm',status:'用户草图校正 · 尺寸示意',published:'2023-09-03',captured:'官网页面更新日期，拍摄日期未注明',note:'用户确认共两片，依据所提供草图布置于宿舍后方、科技楼西侧，南侧留空地，外侧道路绕行并连接教一北侧。两片暂按东西并排、长轴南北表达；尺寸、配色和精确朝向仍为示意。官网资料仅证明南校区有网球场，不用于核定这处位置。'},
 gate:dated('recent-gate.jpg',welcomeSource,'2024-08-21','用户确认北校区南门与南校北门同为对称双通道：补充两侧朝校内开放的圆形地通入口、内侧长方体保安室与雨棚。校名字碑参考2024迎新照片；整体布局依用户纠正，尺寸为估计。'),
 southmain:dated('recent-southmain.gif',timeSource,'2024-04-16','用户确认照片仅拍到西半侧：入口为对称结构，补出东西两组朝校内开放的圆形地通入口、内侧长方体保安室、悬挑屋盖和两个通道。校名字碑依据用户纠正补充，具体尺寸与中部布置仍为估计。'),
 food2:dated('recent-food2.jpg',welcomeSource,'2024-08-21','原文标注风雨操场。核对并补充银灰金属板分缝、百叶、外楼梯和入口平台；依据用户纠正：照片从另一侧拍摄，楼梯位于圆坛侧左端，直上平台后右转进入二楼风雨操场，一楼为食堂；整体弧线及背面仍参考原总图推定。'),
});
const placementNotes={chenyuan:'用户核对：餐厅长轴调整为南北向，位于金如新楼南侧。',startup:'为避让纵向晨苑餐厅，沿街配套占地暂作收缩，范围待实景核对。',volleyball:'用户核对：东西体楼马路对面的室外球场，靠近成均楼一端有两片排球场，长轴南北向、并排一行。',basketball6:'用户核对：沿两片排球场向东，排列六片室外篮球场，长轴南北向、六片并排一行。',westcourt:'位置按用户纠正移至南操场北缘，楼与操场之间不设车道。',eastcourt:'位置按用户纠正移至南操场北缘，楼与操场之间不设车道。',jinru:'位置按用户纠正调整为紧邻晨苑餐厅北侧。',dorm:'楼名依据用户现场纠正为成均楼；当前体量仍为示意，尚未核对该楼近期外立面。'};
export function evidence(b){if(placementNotes[b.id]){const ref=references[b.id]||{url:gallery,status:'用户校正 · 外观推定',note:['volleyball','basketball6'].includes(b.id)?'场地尺寸与配色为示意。':'窗格、色彩与尺寸仍为近似表达。'};return {...ref,note:placementNotes[b.id]+ref.note};}return references[b.id]||{url:gallery,status:'外观推定',note:'位置与组合轮廓依据原校园布局、鸟瞰图；窗格、色彩、屋顶细节为近似表达，尚未取得可明确对应本楼的外立面照片。'};}

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
 function sign(g,text,x,y,z,w,transparent=false){const c=document.createElement('canvas');c.width=transparent?Math.max(128,text.length*60):text.length===1?96:512;c.height=96;const ctx=c.getContext('2d');ctx.fillStyle='#eee8d6';if(!transparent)ctx.fillRect(0,0,c.width,96);ctx.fillStyle=transparent?'#f1eddb':'#394640';ctx.font=(transparent||text.length===1)?'600 76px Microsoft YaHei, sans-serif':'600 40px Microsoft YaHei, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,c.width/2,48,c.width-10);const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;const m=new THREE.Mesh(new THREE.PlaneGeometry(w,w*96/c.width),new THREE.MeshStandardMaterial({map:tex,transparent,alphaTest:transparent?.2:0,roughness:.8}));m.position.set(x,y,z);g.add(m);return m;}
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
 function food(b,g){block(g,0,0,b.w*.78,b.d*.9,7.2,1,'cool');box(g,0,(7.2+b.h)/2,0,b.w*.8,b.h-7.2,b.d*.9,glass);for(let z=-b.d*.44;z<b.d*.45;z+=3)box(g,b.w*.405,(7.2+b.h)/2,z,.3,b.h-7.2,.3,frame);curveRoof(g,b.w*.96,b.d*.96,b.h);entrance(g,0,b.d*.46,8);}
 function tech(b,g){block(g,0,0,b.w*.56,b.d*.61,b.h,12,'warm');block(g,-b.w*.36,b.d*.06,b.w*.22,b.d*.65,b.h*.57,7,'warm');block(g,b.w*.36,b.d*.08,b.w*.22,b.d*.6,b.h*.45,5,'warm');block(g,0,b.d*.35,b.w*.65,b.d*.23,9,2,'warm');for(const x of [-b.w*.24,b.w*.24])box(g,x,b.h+1.3,0,.6,3,b.d*.64,frame);box(g,0,b.h+2.5,0,b.w*.52,.6,b.d*.64,frame);entrance(g,0,b.d*.48,7);sign(g,b.name,0,6,b.d*.48+.2,9);}
 function gate(b,g){box(g,0,.18,0,b.w+4,.36,8,'#d9d7c8');if(b.id==='gate'){box(g,-b.w*.18,1.45,0,b.w*.55,2.9,1.2,'#b9ab90');for(let x=-b.w*.45;x<b.w*.1;x+=.65)box(g,x,2.4,-.9,.15,4.6,.3,'#7d8882');sign(g,'浙大城市学院',-b.w*.18,1.65,.64,b.w*.48);}else{for(const x of [-b.w*.45,b.w*.45])box(g,x,1.5,0,1.8,3,2.2,'#c5bba4');box(g,-b.w*.27,1.35,0,b.w*.24,2.7,1.4,'#c5bba4');sign(g,b.name,-b.w*.27,1.7,.73,b.w*.22);}for(let x=b.w*.12;x<b.w*.4;x+=1.1)box(g,x,.65,1,.16,1.3,.16,rail);}
 function recentDetails(b,g){
  const {w,d,h}=b;
  if(b.id==='xinrui'){
   // Stepped curtain-wall tower; photo front corresponds to the Huzhou Street side.
   const silver='#b7b6a5',bronze='#aa9478',glazing='#5e7980';
   const tiers=[{y:0,h:h*.73,w:w*.83,d:d*.8},{y:h*.73,h:h*.14,w:w*.77,d:d*.75},{y:h*.87,h:h*.13,w:w*.62,d:d*.67}];
   for(const tier of tiers){
    box(g,-w*.05,tier.y+tier.h/2,0,tier.w,tier.h,tier.d,glazing);
    for(const side of [-1,1]){
     const face=new THREE.Group();face.position.set(-w*.05,0,side*tier.d/2);face.rotation.y=side===1?0:Math.PI;g.add(face);
     for(let x=-tier.w/2;x<=tier.w/2+.01;x+=tier.w/18){box(face,x,tier.y+tier.h/2,.08,.07,tier.h,.14,'#3f535c');}
     for(let y=tier.y+.3;y<tier.y+tier.h;y+=h/44)box(face,0,y,.1,tier.w,.08,.14,'#344952');
     if(tier.y<h*.8)for(let x=-tier.w/2;x<=tier.w/2+.01;x+=tier.w/14){box(face,x,tier.y+tier.h/2,.4,.32,tier.h,.7,silver);box(face,x+.13,tier.y+tier.h/2,.78,.075,tier.h,.07,bronze);}
    }
    for(const side of [-1,1])for(let z=-tier.d/2;z<=tier.d/2+.01;z+=tier.d/8)box(g,-w*.05+side*(tier.w/2+.12),tier.y+tier.h/2,z,.35,tier.h,.25,silver);
    box(g,-w*.05,tier.y+tier.h+.1,0,tier.w+.3,.2,tier.d+.3,'#87928f');
   }
   // Lower entrance portal and short side podium are distinct from the high-rise.
   const front=new THREE.Group();front.position.z=-d*.405;front.rotation.y=Math.PI;g.add(front);
   for(const x of [-w*.17,w*.17])box(front,x,4.6,.5,.7,9.2,1.4,bronze);
   box(front,0,9,.5,w*.37,.6,1.4,bronze);
   box(front,0,4.4,.15,w*.3,8.8,.15,'#8caaad');
   for(const y of [2.8,5.5,8.2])box(front,0,y,.35,w*.3,.16,.15,silver);
   sign(front,'浙大城市学院 科教大楼',0,9.75,.65,w*.58).scale.y=.45;
   const crownSign=sign(g,'君亭酒店',-w*.05,h-2,-d*.335-.06,w*.49,true);crownSign.rotation.y=Math.PI;crownSign.scale.y=.65;
   box(g,w*.39,5.8,d*.14,w*.19,11.6,d*.68,'#bdb9a8');
   for(let z=-d*.18;z<d*.48;z+=1.4)box(g,w*.49,6.4,z,.16,8.5,.8,'#52686c');
  }else if(b.id==='gate'){
   const mirrored=new THREE.Group();mirrored.rotation.y=Math.PI;g.add(mirrored);recentDetails({...b,id:'southmain'},mirrored);
  }else if(b.id==='namewall'){
   box(g,0,.35,0,w,.7,3,'#e5e5dc');
   box(g,0,1.1,.5,w*.9,1.5,1.4,'#eeeee5');
   for(let x=-w*.49;x<=w*.49;x+=.65)box(g,x,3,-.9,.2,5.7,.3,'#424744');
   const chars=[...'浙大城市学院'];
   chars.forEach((ch,i)=>{const x=(i-2.5)*w*.145;box(g,x,3.3,.4,w*.103,4.9,.85,'#eeeade');sign(g,ch,x,4.1,.84,w*.082);});
   sign(g,'HANGZHOU CITY UNIVERSITY',0,1.15,1.22,w*.76).scale.y=.22;
  }else if(b.id==='southmain'){
   // User confirms the source photograph shows only the western half.
   const lettering=new THREE.Group();lettering.position.set(0,0,-4.5);lettering.rotation.y=Math.PI;g.add(lettering);recentDetails({id:'namewall',w:w*.36,d:3,h:6},lettering);
   for(const side of [-1,1]){
    const x=side*w*.49,r=w*.085;
    // Circular volume is an underpass entrance, with an open campus-facing sector.
    const entry=new THREE.Group();entry.position.x=x;entry.rotation.y=Math.PI;g.add(entry);
    const shell=new THREE.Mesh(new THREE.CylinderGeometry(r,r,5.3,32,1,true,Math.PI*1.25,Math.PI*1.5),new THREE.MeshStandardMaterial({color:'#79989b',roughness:.32,side:THREE.DoubleSide}));shell.position.set(0,2.65,0);entry.add(shell);
    for(let i=0;i<=24;i++){const a=-Math.PI/4+i*Math.PI*1.5/24;box(entry,Math.cos(a)*r,2.65,Math.sin(a)*r,.13,5.3,.13,'#c4ccc8');if(i<24)for(const y of [1.6,3.5,5.2]){const a2=a+Math.PI*1.5/24;beam(entry,[Math.cos(a)*r,y,Math.sin(a)*r],[Math.cos(a2)*r,y,Math.sin(a2)*r],.06,'#d2d6d0');}}
    cylinder(entry,0,.1,0,r*.86,.15,'#394e53',32);
    // Descending stair treads are a surface indication; the tunnel is not modeled.
    for(let i=0;i<6;i++)box(entry,0,.48-i*.065,-r*.66+i*.37,r*.9,.1,.3,'#a5b3b0');
    const entryLabel=sign(entry,'地通入口',0,4.5,-r-.07,r*1.5);entryLabel.rotation.y=Math.PI;
    const bx=x-side*(r+2.4),bw=4.6,bd=5.2;
    box(g,bx,1.8,.6,bw,3.6,bd,'#ccd0c7');
    box(g,bx,3.75,.6,bw+.6,.3,bd+.6,'#d9ddd3');
    box(g,bx,2.05,.6-bd/2-.05,bw*.85,1.5,.14,'#5a797e');
    for(const dx of [-bw*.3,0,bw*.3])box(g,bx+dx,2.05,.6-bd/2-.14,.1,1.6,.1,'#dce1d6');
    const guardLabel=sign(g,'保安室',bx,3.15,.6-bd/2-.16,3);guardLabel.rotation.y=Math.PI;
    cylinder(g,x,6.2,0,r*1.34,.42,'#ced1c9',48);
    cylinder(g,x,5.55,0,r*.85,.18,'#c2c7c2',32);
    box(g,side*w*.31,4.7,0,w*.38,.35,3.8,'#c9cec8');
    box(g,side*w*.14,2.3,0,.35,4.6,.35,'#b0bcb9');
    // Open passage beneath each canopy, with a single edge bollard.
    box(g,side*w*.16,.65,-1.2,.15,1.3,.15,'#6c7c78');
   }
  }else if(b.id==='southgate'){
   box(g,0,.2,0,w+8,.4,11,'#d6d4c7');
   box(g,0,1.7,0,w*.43,3.4,1.5,'#bdb5a2');box(g,0,3.55,0,w*.49,.4,2.3,'#e0dacb');
   sign(g,'浙大城市学院',0,2,.81,w*.34);
   for(const side of [-1,1]){const x=side*w*.48;box(g,x,1.6,-.4,w*.18,3.2,4,'#c8c5ba');box(g,x,3.4,-.2,w*.22,.4,4.8,'#b1afa4');box(g,x,1.8,1.65,w*.14,1.7,.12,'#526c6e');for(let i=-1;i<=1;i++)box(g,x+i*w*.065,1.65,2.05,.16,3.2,.2,'#c1b8a9');}
   for(let x=w*.26;x<w*.37;x+=.5){box(g,x,.65,.5,.08,1.3,.12,'#75827c');}
   box(g,0,.35,2.1,w*.43,.35,.8,'#78946b');
  }else if(b.id==='chenyuan'){
   // Only the visible shopfront is reconstructed; upper/rear massing stays approximate.
   box(g,0,h/2,0,w,h,d,'#d2c9b6');
   parapet(g,0,0,w,d,h,'#d2c9b6');
   for(const side of [-1,1]){
    const face=new THREE.Group();face.position.z=side*(d/2+.05);face.rotation.y=side===1?0:Math.PI;g.add(face);
    box(face,0,2.15,.08,w*.97,4.2,.15,'#52645f');
    for(let x=-w*.47;x<=w*.48;x+=1.55){box(face,x,2.1,.2,.12,4.2,.15,'#303e39');box(face,x,.35,.24,1.45,.5,.14,'#b3b3a2');}
    box(face,0,4.9,.22,w,1.25,.4,'#b9a654');
    box(face,0,6.65,.1,w,1.95,.18,'#648563');
    box(face,0,5.6,.75,w+.5,.23,1.6,'#c9c7ad');
    sign(face,'晨苑餐厅  CHEN YUAN',0,4.95,.45,w*.6);
    for(let x=-w*.44;x<w*.5;x+=4){box(face,x,7.15,.22,2.6,.95,.18,'#879c88');box(face,x,7.15,.35,.08,.95,.12,'#c8cec0');}
   }
  }else if(b.id==='arts1'||b.id==='arts2'){
   generic(b,g);
   const face=new THREE.Group();face.position.z=(b.id==='arts1'?1:-1)*(d/2+.2);face.rotation.y=b.id==='arts1'?0:Math.PI;g.add(face);
   box(face,0,4.4,0,w,8.8,.2,'#c8ad8c');
   for(let x=-w*.42;x<=w*.43;x+=4.7){
    const shape=new THREE.Shape();shape.moveTo(-1.3,0);shape.lineTo(1.3,0);shape.lineTo(1.3,5);shape.absarc(0,5,1.3,0,Math.PI,false);shape.closePath();
    const arch=new THREE.Mesh(new THREE.ShapeGeometry(shape,12),mat('#657976'));arch.position.set(x,.5,.13);face.add(arch);
    for(const dx of [-1.6,1.6]){box(face,x+dx,3.6,.3,.38,7.2,.5,'#deceb2');box(face,x+dx,.4,.4,.6,.8,.6,'#dfd1b9');}
    box(face,x,2.9,.22,.1,5.5,.12,'#c2b99e');
   }
   if(b.id==='arts1'){
    // The gap between the mapped buildings is five scene units.
    const cx=-5,cz=d/2+2.5,cw=Math.min(w*.6,22),cd=5.1;
    box(g,cx,10.4,cz,cw,.18,cd,'#a9c3c1');
    for(let x=cx-cw/2;x<=cx+cw/2+.1;x+=2.7)box(g,x,10.55,cz,.16,.35,cd+.5,'#687d7b');
    for(const z of [cz-cd/2,cz,cz+cd/2])box(g,cx,10.55,z,cw,.35,.18,'#687d7b');
    box(g,cx,6.7,cz,cw*.8,.3,cd,'#d0b693');
    for(const x of [cx-cw*.4,cx+cw*.4])box(g,x,7.5,cz,.2,1.5,cd,'#b9c9c3');
    for(const x of [cx-cw/2,cx+cw/2])cylinder(g,x,5.15,cz+cd/2,.25,10.3,'#d9d3bc',12);
   }
  }else if(b.id==='southgate'){
   box(g,0,.2,0,w+8,.4,11,'#d6d4c7');
   box(g,0,1.7,0,w*.43,3.4,1.5,'#bdb5a2');box(g,0,3.55,0,w*.49,.4,2.3,'#e0dacb');
   sign(g,'浙大城市学院',0,2,.81,w*.34);
   for(const side of [-1,1]){const x=side*w*.48;box(g,x,1.6,-.4,w*.18,3.2,4,'#c8c5ba');box(g,x,3.4,-.2,w*.22,.4,4.8,'#b1afa4');box(g,x,1.8,1.65,w*.14,1.7,.12,'#526c6e');for(let i=-1;i<=1;i++)box(g,x+i*w*.065,1.65,2.05,.16,3.2,.2,'#c1b8a9');}
   for(let x=w*.26;x<w*.37;x+=.5){box(g,x,.65,.5,.08,1.3,.12,'#75827c');}
   box(g,0,.35,2.1,w*.43,.35,.8,'#78946b');
  }else if(b.id==='chenyuan'){const oriented=new THREE.Group();oriented.rotation.y=-Math.PI/2;g.add(oriented);recentDetails({...b,w:b.d,d:b.w},oriented);}else if(b.id==='food2'){
   food(b,g);
   const face=d*.455,fw=w*.8;
   box(g,0,h*.54,face,fw,h*.84,.25,'#c4cbca');
   for(let y=2;y<h*.98;y+=1.35)box(g,0,y,face+.14,fw,.05,.05,'#7e8b8d');
   for(let x=-fw/2;x<=fw/2;x+=3.2)box(g,x,h*.54,face+.15,.045,h*.84,.05,'#8c9999');
   for(const x of [-fw*.29,fw*.29]){box(g,x,h*.78,face+.2,3.6,2.8,.15,'#465b61');for(let y=h*.78-1.25;y<h*.78+1.3;y+=.35)box(g,x,y,face+.3,3.65,.12,.25,'#d8ded9');}
   entrance(g,1,face+.2,7);
   const sh=7.2,run=10,sw=w*.15,sx=-w*.30,landingDepth=3.6;
   for(let i=0;i<24;i++){const y=sh*(i+1)/24,zz=face+landingDepth+run-i*run/24;box(g,sx,y/2,zz,sw,y,run/24+.03,'#c6cbc3');box(g,sx,y+.015,zz,sw,.04,.13,'#51648c');}
   for(const dx of [-sw/2,sw/2]){beam(g,[sx+dx,1,face+landingDepth+run],[sx+dx,sh+1,face+landingDepth],.07,'#96aba5');for(let i=0;i<=6;i++)box(g,sx+dx,i*sh/6+.5,face+landingDepth+run-i*run/6,.08,1,.08,'#96aba5');}
   // Ascend towards -Z, then turn right (+X) on an actual raised landing.
   const left=sx-sw/2,right=3,lz=face+landingDepth/2;
   box(g,(left+right)/2,sh-.2,lz,right-left,.4,landingDepth,'#c9cfc7');
   for(const xx of [left+.3,-3,2.7])box(g,xx,sh/2,lz,.35,sh,.35,'#b5c0bb');
   for(const z of [face,face+landingDepth]){
    const begin=z>face?sx+sw/2:left;
    box(g,(begin+right)/2,sh+1,z,right-begin,.09,.09,'#899f99');
    for(let x=begin;x<=right;x+=1.2)box(g,x,sh+.5,z,.07,1,.07,'#899f99');
   }
   box(g,1.1,sh+1.6,lz,3.8,3.2,landingDepth,'#c4cbca');
   box(g,-.84,sh+1.45,lz,.12,2.9,2.5,'#526e79');
   box(g,1.1,sh+3.3,lz,4.2,.2,landingDepth+.5,'#dadfd6');
   const upper=sign(g,'二楼 风雨操场',-.93,sh+2.8,lz,3);upper.rotation.y=-Math.PI/2;
   sign(g,'一楼 食堂',1,4.3,face+.4,5);

  }else return false;
  return true;
 }
 // Merge repeated components per material per building, keeping picking and GLB export intact.
 function consolidate(g){g.updateMatrixWorld(true);const inverse=g.matrixWorld.clone().invert(),sets=new Map(),remove=[];g.traverse(o=>{if(!o.isMesh||o.material.map)return;const key=o.material.uuid;if(!sets.has(key))sets.set(key,{material:o.material,items:[]});const geo=o.geometry.clone();geo.applyMatrix4(inverse.clone().multiply(o.matrixWorld));sets.get(key).items.push(geo.index?geo.toNonIndexed():geo);remove.push(o);});for(const o of remove)o.removeFromParent();for(const {material,items} of sets.values()){const merged=mergeGeometries(items,false);const geometry=mergeVertices(merged);merged.dispose();for(const item of items)item.dispose();const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);}}
 return {build(b,g){if(['track','volleyball','basketball6','tennis'].includes(b.type)||b.id==='eastball')return false;if(b.id==='chenyuan'){const oriented=new THREE.Group();oriented.rotation.y=-Math.PI/2;g.add(oriented);recentDetails({...b,w:b.d,d:b.w},oriented);}else if(b.id==='food2'){const oriented=new THREE.Group();oriented.rotation.y=-Math.PI/2;g.add(oriented);recentDetails({...b,w:b.d,d:b.w},oriented);}else if(recentDetails(b,g)){}else if(b.id==='library')library(b,g);else if(b.id==='wenyuan')wenyuan(b,g);else if(b.id==='tech')tech(b,g);else if(b.type==='gate')gate(b,g);else generic(b,g);consolidate(g);return true;}};
}
