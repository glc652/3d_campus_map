import {buildings} from './dist/data.js';
import {createArchitecture,evidence} from './dist/architecture.js';
import * as THREE from 'three';
import fs from 'node:fs';
globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>({fillRect(){},fillText(){}})})};
const cache=new Map();function mat(c){if(!cache.has(c))cache.set(c,new THREE.MeshStandardMaterial({color:c}));return cache.get(c)}
function box(g,x,y,z,w,h,d,c){const m=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),mat(c));m.position.set(x,y,z);m.scale.set(w,h,d);g.add(m);return m}
function cylinder(g,x,y,z,r,h,c,n){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,n),mat(c));m.position.set(x,y,z);g.add(m);return m}
const arch=createArchitecture({box,mat,cylinder});let meshes=0,triangles=0;const records=[];
for(const b of buildings){const g=new THREE.Group();const changed=arch.build(b,g);g.traverse(o=>{if(!o.isMesh)return;meshes++;const p=o.geometry.attributes.position;for(const v of p.array)if(!Number.isFinite(v))throw Error('Invalid coordinate: '+b.id);triangles+=(o.geometry.index?.count||p.count)/3;});const bounds=new THREE.Box3().setFromObject(g);if(changed&&(bounds.min.y<-.1||bounds.max.y>b.h+15))throw Error('Bad vertical extent: '+b.id);records.push({id:b.id,name:b.name,refined:changed,...evidence(b)});}
fs.writeFileSync('references/building-evidence.json',JSON.stringify(records,null,2));console.log(JSON.stringify({places:buildings.length,refined:records.filter(r=>r.refined).length,meshes,triangles,finiteCoordinates:true}));
