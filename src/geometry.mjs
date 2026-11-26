// Congruence marks are derived from explicitly stated equality groups.
// Distinct groups must use distinct counts; do not infer extra givens.
export const triangle={
 points:{A:[110,15],B:[35,125],C:[185,125],D:[110,125]},
 segments:[['A','B'],['A','C'],['B','D'],['D','C'],['A','D']],
 equalGroups:[{ticks:1,edges:[['A','B'],['A','C']]},{ticks:2,edges:[['B','D'],['D','C']]}],
 labels:{A:[106,11],B:[21,140],C:[187,140],D:[106,140]}
};
export function length(points,[a,b]){return Math.hypot(points[a][0]-points[b][0],points[a][1]-points[b][1]);}
export function validateGroups(spec){
 const seen=new Set(), edges=new Set(), errors=[];
 const key=e=>[...e].sort().join(':');
 const drawn=new Set(spec.segments.map(key));
 for(const g of spec.equalGroups){
  if(!Number.isInteger(g.ticks)||g.ticks<1||seen.has(g.ticks))errors.push('等長記号の重複・不正');
  seen.add(g.ticks);
  if(g.edges.length<2)errors.push('等長グループの辺不足');
  const lengths=g.edges.map(e=>length(spec.points,e));
  if(lengths.some(l=>!Number.isFinite(l)||l<=0||Math.abs(l-lengths[0])>1e-6))errors.push('辺の長さが一致しません');
  for(const e of g.edges){const k=key(e);if(!drawn.has(k)||edges.has(k))errors.push('辺の重複・未描画');edges.add(k);}
 }
 return errors;
}
export function tickLines(a,b,count,spacing=5,half=4.5){
 const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);
 if(!len)throw Error('Zero length edge');
 const ux=dx/len,uy=dy/len,nx=-uy,ny=ux;
 return Array.from({length:count},(_,i)=>{
  const offset=(i-(count-1)/2)*spacing,x=(a[0]+b[0])/2+ux*offset,y=(a[1]+b[1])/2+uy*offset;
  return [x-nx*half,y-ny*half,x+nx*half,y+ny*half];
 });
}
export function figure(kind){
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
 svg.setAttribute('viewBox','0 0 220 150');svg.classList.add('figure');svg.setAttribute('role','img');
 const add=(tag,attrs,t)=>{const e=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);if(t)e.textContent=t;svg.append(e);return e;};
 const line=(x1,y1,x2,y2,stroke='#222',sw=1.2)=>add('line',{x1,y1,x2,y2,stroke,'stroke-width':sw});
 const txt=(x,y,t)=>add('text',{x,y,fill:'#111','font-size':11,'font-family':'serif'},t);
 if(kind==='triangle'){
  if(validateGroups(triangle).length)throw Error('Invalid equality groups');
  svg.setAttribute('aria-label','二等辺三角形。ABとACに1本の等長記号、BDとDCに2本の等長記号。');
  for(const [a,b] of triangle.segments)line(...triangle.points[a],...triangle.points[b]);
  for(const g of triangle.equalGroups)for(const [a,b] of g.edges)for(const t of tickLines(triangle.points[a],triangle.points[b],g.ticks))line(...t,'#111',1.3);
  for(const [name,[x,y]] of Object.entries(triangle.labels))txt(x,y,name);
 }else if(kind==='line'){
  svg.setAttribute('aria-label','直線のグラフ');
  const ox=110,oy=80,u=15;
  for(let i=-4;i<=4;i++){line(ox+i*u,20,ox+i*u,140,'#ccc',.55);line(50,oy+i*u,170,oy+i*u,'#ccc',.55);}
  line(44,oy,184,oy);line(ox,145,ox,10);
  add('path',{d:'M179 77 L184 80 L179 83 M107 15 L110 10 L113 15',fill:'none',stroke:'#222'});
  // y = x + 1, endpoints (-4,-3) and (3,4).
  line(ox-4*u,oy+3*u,ox+3*u,oy-4*u,'#111',1.6);
  txt(187,76,'x');txt(116,13,'y');txt(98,93,'O');txt(122,94,'1');txt(97,68,'1');
 }
 return svg;
}
