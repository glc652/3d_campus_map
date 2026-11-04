import * as THREE from 'three';

// Photo-driven replacements. These are hand-built volumes, not textures pasted on boxes.
export function createPhotoBuildings({box,mat,block,entrance,sign,beam}){
 const white='#e4e5de',trim='#f0efe7',glass='#738b95',dark='#646d70',pink='#c9babc';
 function hip(g,x,z,w,d,y,rise,color='#50585a'){
  const a=w/2,c=d/2,t=Math.min(d*.38,w*.18),v=[-a,0,-c,a,0,-c,a,0,c,-a,0,c,-a+t,rise,0,a-t,rise,0];
  const geom=new THREE.BufferGeometry();geom.setAttribute('position',new THREE.Float32BufferAttribute(v,3));geom.setIndex([0,4,5,0,5,1,1,5,2,2,5,4,2,4,3,3,4,0]);geom.computeVertexNormals();const m=new THREE.Mesh(geom,mat(color));m.position.set(x,y,z);g.add(m);
  box(g,x,y,z,w+.2,.3,d+.2,'#72797a');
  // Long tiled ridges and batten lines are visible at campus-map scale.
  beam(g,[x-a+t,y+rise+.06,z],[x+a-t,y+rise+.06,z],.09,'#828b8c');
  for(let xx=-a+t;xx<=a-t;xx+=1.1)for(const s of [-1,1])beam(g,[x+xx,y+rise+.02,z],[x+xx,y+.04,z+s*c],.023,'#879090');
 }
 function window(g,x,y,z,w,h){box(g,x,y,z,w+.18,h+.18,.14,trim);box(g,x,y,z+.1,w,h,.11,glass);for(const t of [-.25,.25])box(g,x+w*t,y,z+.17,.065,h,.1,trim);box(g,x,y-h*.22,z+.17,w,.07,.1,trim);}
 function southSlab(g,x,z,w,d,h,n=7,balcony=true){
  const sub=new THREE.Group();sub.position.set(x,0,z);g.add(sub);box(sub,0,h/2,0,w,h,d,white);
  const sh=h/n,bays=Math.max(3,Math.round(w/3.1)),step=(w-.8)/bays;
  for(const side of [-1,1]){
   const face=new THREE.Group();face.position.z=side*d/2;face.rotation.y=side===1?0:Math.PI;sub.add(face);
   for(let k=0;k<n;k++){
    for(let i=0;i<bays;i++){
     const xx=-(w-.8)/2+(i+.5)*step,y=(k+.57)*sh;
     window(face,xx,y,.06,step*.8,sh*.58);
     if(balcony){box(face,xx,k*sh+.3,.55,step*.9,.22,1.15,trim);box(face,xx,k*sh+.83,1.04,step*.9,.96,.12,white);for(const s of [-1,1])box(face,xx+s*step*.43,k*sh+.85,.55,.1,1.1,1.1,white);}
     if(i%2===0){box(face,xx-step*.36,k*sh+sh*.32,.43,.55,.45,.4,'#b4b9b6');for(let u=-.17;u<=.17;u+=.12)box(face,xx-step*.36+u,k*sh+sh*.32,.65,.035,.32,.02,'#6e7a7c');}
    }
    box(face,0,k*sh+.14,.17,w,.21,.2,pink);
   }
  }
  for(const side of [-1,1]){box(sub,side*w/2,h/2,0,.18,h,d,white);for(let k=0;k<n;k++)box(sub,side*(w/2+.13),(k+.55)*sh,0,.12,sh*.52,.7,glass);}
  box(sub,0,h+.1,0,w+.9,.32,d+.8,trim);box(sub,0,h+.28,0,w-.5,.15,d-.5,'#737c7c');
  for(const side of [-1,1]){box(sub,0,h+.55,side*(d/2+.3),w+.8,.3,.22,trim);box(sub,side*(w/2+.3),h+.55,0,.22,.3,d+.7,trim);}
  for(let xx=-w*.32;xx<w*.4;xx+=4)box(sub,xx,h+.6,0,.7,.55,.7,'#98a19e');
 }
 function spine(g,x,z,w,d,h,n){box(g,x,h/2,z,w,h,d,white);for(let k=0;k<n;k++)window(g,x,(k+.6)*h/n,z+d/2+.1,w*.64,h/n*.48);box(g,x,h+.4,z,w+1,.6,d+.7,trim);box(g,x,h+1,z,w*.7,.8,d*.65,white);}
 function southernDorm(b,g){const {w,d,h}=b;
  if(b.id==='teacher'){
   const sub=new THREE.Group();sub.rotation.y=-Math.PI/2;g.add(sub);
   southSlab(sub,-d*.33,0,d*.3,w,h,8);southSlab(sub,d*.33,0,d*.3,w,h,8);southSlab(sub,0,-w*.31,d*.36,w*.27,h*.91,7,false);spine(sub,0,-w*.23,d*.14,w*.28,h+2,9);
   // End balconies project from blank end walls, visible in the 2014 east panorama.
   for(const x of [-d*.33,d*.33])for(let k=0;k<8;k++){box(sub,x,(k+.25)*h/8,w/2+.6,d*.2,.22,1.3,trim);box(sub,x,(k+.5)*h/8,w/2+1.17,d*.2,.8,.15,white);}
   entrance(sub,0,-w*.13,d*.2);
  }else if(['hongyi','chongxian23'].includes(b.id)){
   southSlab(g,0,-d*.31,w,d*.28,h,7);southSlab(g,0,d*.31,w,d*.28,h,7);spine(g,-w*.4,0,w*.16,d*.31,h+1,8);
  }else{
   southSlab(g,0,0,w*.93,d*.74,h,7);spine(g,w*.26,-d*.33,w*.15,d*.25,h+1.8,8);entrance(g,0,d*.4,Math.min(5,w*.27));
  }
  sign(g,b.name,0,3.5,d*.51+1,Math.min(6,w*.6));
 }
 function zhishan(b,g){const {w,d}=b,h=16.5;
  function brickWing(z){const depth=d*.3;box(g,0,h/2,z,w*.94,h,depth,'#a9695a');box(g,0,1.5,z,w*.945,3,depth+.15,'#d0cec2');box(g,0,h-1.1,z,w*.945,2.2,depth+.15,'#dad7c6');
   for(const side of [-1,1]){const face=new THREE.Group();face.position.z=z+side*(depth/2+.05);face.rotation.y=side===1?0:Math.PI;g.add(face);
    for(let k=0;k<5;k++)for(let i=0;i<14;i++){const x=-w*.44+(i+.5)*w*.88/14;window(face,x,(k+.55)*h/5,.05,w*.88/14*.62,1.65);box(face,x,k*h/5+.4,.14,w*.88/14*.66,.5,.16,'#d7d4c8');}
    for(let y=3.2;y<h-2.2;y+=.42)box(face,0,y,0,w*.94,.017,.03,'#8e5e52');
   }
   hip(g,0,z,w*.99,depth+1.4,h,2.2);
   for(const x of [-w*.24,w*.24]){box(g,x,h/2,z+depth*.53,2,h,.8,'#a9695a');hip(g,x,z+depth*.53,2.7,1.6,h,.7);}
  }
  brickWing(-d*.34);brickWing(d*.34);
  box(g,0,.1,0,w*.95,.2,d*.35,'#cfb8a2');box(g,0,.28,0,w*.58,.3,d*.17,'#9cba8c');
  for(const x of [-w*.35,w*.35]){box(g,x,1.8,0,w*.14,3.6,d*.36,'#d6d2c4');hip(g,x,0,w*.17,d*.45,3.6,1.1);}
  sign(g,'至善楼',0,3.6,d*.495+.2,6);
 }
 function cafeteria(b,g){const {w,d,h}=b,N=24,depth=d/N;
  // Actual crescent plan: glass follows the long curved frontage; ends of the dark roof rise.
  for(let i=0;i<N;i++){
   const z=-d/2+(i+.5)*depth,t=2*z/d,x=3.5*t*t,sub=new THREE.Group();sub.position.set(x,0,z);sub.rotation.y=Math.atan(-14*z/(d*d));g.add(sub);
   const hh=h-2+2.6*t*t;
   box(sub,0,4,0,w*.82,8,depth*1.06,'#babbb2');box(sub,0,(hh+8)/2,0,w*.82,hh-8,depth*1.06,glass);
   for(const side of [-1,1]){
    for(const y of [1.8,5.1])box(sub,side*(w*.411+.02),y,0,.13,2.6,depth*.87,glass);
    box(sub,side*w*.417,(hh+8)/2,0,.16,hh-8,.14,'#e0e1d5');
    for(let y=9;y<hh;y+=1.6)box(sub,side*w*.418,y,0,.17,.1,depth*1.08,'#bbc6c3');
    box(sub,side*w*.42,7.7,0,.38,.45,depth*1.09,'#d1d0c4');
   }
   box(sub,0,hh+.3,0,w*.96,.5,depth*1.15,'#525b5e');box(sub,0,hh+.03,0,w*.99,.22,depth*1.15,'#c3cbc7');
  }
  box(g,-w*.15,3.4,-d*.47,w*.55,6.8,d*.22,'#bcbfb4');box(g,-w*.15,6.95,-d*.47,w*.58,.25,d*.23,trim);
  for(let x=-w*.42;x<w*.16;x+=1.3)box(g,x,7.55,-d*.58,.08,1.2,.08,dark);box(g,-w*.15,8.1,-d*.58,w*.58,.08,.08,dark);
  const steps=24;for(let i=0;i<steps;i++)box(g,-w*.48,.12+i*6.8/steps,-d*.38+i*.55,3.1,.3,.6,'#b7a68e');
  for(const side of [-1,1])beam(g,[-w*.48+side*1.5,1,-d*.38],[-w*.48+side*1.5,7.8,-d*.38+steps*.55],.07,dark);
  sign(g,'第二食堂',3.5,5.5,d*.501,8);
 }
 function teaching(b,g){const {w,d,h}=b;
  if(b.id==='sci5'){
   for(const x of [-w*.34,0,w*.34]){block(g,x,0,w*.3,d*.78,h,6,'cool');for(const sx of [-1,1])box(g,x+sx*w*.142,h*.54,d*.43,.6,h*.94,.65,trim);box(g,x,h+1,d*.3,w*.32,.55,d*.35,trim);}
   box(g,0,3.2,-d*.25,w,6.4,d*.3,'#c6d0c8');for(let x=-w*.47;x<w*.5;x+=2.3)box(g,x,3.6,-d*.415,1.5,4.5,.12,glass);
  }else if(['teach1','teach2'].includes(b.id)){
   block(g,0,-d*.22,w*.86,d*.56,h,5,'cool');for(const x of [-w*.35,w*.35]){block(g,x,d*.18,w*.2,d*.54,h-2,5,'cool');box(g,x,h+.4,0,w*.24,.5,d*.98,trim);}
   box(g,0,h*.53,d*.08,w*.29,h*.94,.24,glass);for(let y=1;y<h;y+=2)box(g,0,y,d*.23,w*.3,.13,.23,trim);entrance(g,0,d*.1,w*.24);
  }else if(b.id==='lab'){
   block(g,-w*.3,0,w*.32,d,h,6,'warm');block(g,w*.3,0,w*.32,d,h,6,'warm');block(g,0,-d*.34,w*.3,d*.28,h*.78,5,'warm');hip(g,-w*.3,0,w*.34,d*.99,h,1.8,'#9c9b8b');hip(g,w*.3,0,w*.34,d*.99,h,1.8,'#9c9b8b');
  }else{
   block(g,0,0,w*.96,d*.8,h,5,'warm');box(g,-w*.41,h*.5,0,w*.12,h+1,d*.91,'#cfccbb');box(g,w*.39,h*.5,-d*.1,w*.14,h+1,d*.8,'#cfccbb');
   for(let k=0;k<5;k++)box(g,0,(k+.65)*h/5,d*.407,w*.66,1.35,.1,glass);
   if(b.id==='teach3'){const ring=new THREE.Mesh(new THREE.CylinderGeometry(w*.27,w*.27,h*.42,32),mat('#cfccbb'));ring.scale.z=.75;ring.position.set(w*.32,h*.21,d*.23);g.add(ring);for(let y=1;y<h*.4;y+=2)box(g,w*.32,y,d*.44,w*.43,.8,.15,glass);}
   entrance(g,0,d*.41,Math.min(w*.3,5));
  }
  sign(g,b.name,0,4,d*.51+.1,Math.min(7,w*.6));
 }
 const southIDs=['teacher','zhiyuan','hongyi','chongxian1','chongxian23','jingcheng','jingcheng2','mingde','mingde2','dormwest','dorm'];
 const teachIDs=['sci5','teach1','teach2','teach3','teach4','teach5','teach6','teach7','lab'];
 return {build(b,g){if(b.id==='zhishan')zhishan(b,g);else if(b.id==='food2')cafeteria(b,g);else if(southIDs.includes(b.id))southernDorm(b,g);else if(teachIDs.includes(b.id))teaching(b,g);else return false;return true;}};
}
