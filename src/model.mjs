export const clone=o=>JSON.parse(JSON.stringify(o));
export const uid=()=>globalThis.crypto?.randomUUID?.()??Date.now().toString(36)+Math.random().toString(36).slice(2);
export const bankSamples=[
{id:'q1',unit:'文字式',text:'次の式を簡単にしなさい。',formula:'linear',figure:null,answer:'8x',points:3,category:'knowledge'},
{id:'q2',unit:'一次関数',text:'次のグラフの直線の式を求めなさい。',formula:null,figure:'line',answer:'y = x + 1',points:4,category:'knowledge'},
{id:'q3',unit:'平面図形',text:'AB = AC、Dは辺BCの中点である。△ABDと△ACDが合同であることを証明しなさい。',formula:null,figure:'triangle',answer:'AB = AC、BD = CD、AD = ADより、3組の辺がそれぞれ等しいので△ABD≡△ACD。',points:6,category:'thinking'},
{id:'q4',unit:'平方根',text:'次の式を簡単にしなさい。',formula:'root',figure:null,answer:'5√2',points:3,category:'knowledge'}];
export const seed=()=>({schema:1,title:'数学　定期考査',bank:clone(bankSamples),pages:1,blocks:[{...clone(bankSamples[0]),id:'b1',sourceId:'q1',page:0,x:15,y:43,w:180},{...clone(bankSamples[2]),id:'b2',sourceId:'q3',page:0,x:15,y:75,w:180}],history:[]});
const question=q=>q&&typeof q.id==='string'&&typeof q.text==='string'&&typeof q.unit==='string'&&typeof q.answer==='string'&&Number.isFinite(q.points)&&q.points>=0&&['knowledge','thinking'].includes(q.category)&&[null,'linear','root'].includes(q.formula)&&[null,'line','triangle'].includes(q.figure);
export function valid(s,checkHistory=true){return !!s&&s.schema===1&&typeof s.title==='string'&&Array.isArray(s.bank)&&Array.isArray(s.blocks)&&Array.isArray(s.history)&&Number.isInteger(s.pages)&&s.pages>=1&&s.pages<=30&&s.bank.every(question)&&s.blocks.every(b=>question(b)&&Number.isInteger(b.page)&&b.page>=0&&b.page<s.pages&&[b.x,b.y,b.w].every(Number.isFinite)&&b.x>=0&&b.y>=38&&b.y<=280&&b.w>=20&&b.x+b.w<=210)&&new Set(s.blocks.map(b=>b.id)).size===s.blocks.length&&(!checkHistory||s.history.every(v=>v&&typeof v.at==='string'&&typeof v.label==='string'&&valid(v.data,false)));}
export const snapshot=s=>({...clone(s),history:[]});
export const score=blocks=>({count:blocks.length,total:blocks.reduce((n,b)=>n+b.points,0),knowledge:blocks.filter(b=>b.category==='knowledge').reduce((n,b)=>n+b.points,0),thinking:blocks.filter(b=>b.category==='thinking').reduce((n,b)=>n+b.points,0)});
