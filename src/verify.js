const {G,simp}=require('./questions.js');
let errs=[],count=0;const eq=(a,b)=>Math.abs(a-b)<1e-9;
const sqf=n=>simp(n)[0]===1&&n>1;
for(const lv in G)G[lv].forEach((g,gi)=>{for(let i=0;i<3000;i++){const q=g();count++;const tag=`L${lv}g${gi}`;
 if(q.type==='mc'){
  if(q.options.length<3)errs.push(tag+' few options '+q.options.length);
  if(new Set(q.options).size!==q.options.length)errs.push(tag+' dup options');
  if(q.answer<0||q.answer>=q.options.length)errs.push(tag+' bad answer idx');
  if(q.ev!==undefined){if(!eq(q.vals[q.answer],q.ev))errs.push(tag+' ans!=ev '+q.stem);
   q.vals.forEach((v,j)=>{if(j!==q.answer&&v!==undefined&&eq(v,q.ev))errs.push(tag+' distractor equals ev');});}
 }else{if(q.ev!==undefined&&!eq(q.answer,q.ev))errs.push(tag+' fill ans!=ev');if(!(q.answer>0))errs.push(tag+' nonpositive fill');}
 const c=q.chk;if(c){
  if(lv==6&&gi==0){if(!eq(c.tv,0))errs.push('6a target simplification wrong');if(c.others.includes(c.cls))errs.push('6a distractor same class');}
  if(lv==6&&gi==1){const a=q.answer;if(c.k1*a+c.c1!==c.V||c.k2*a+c.c2!==c.V||!sqf(c.V))errs.push('6b');}
  if(lv==6&&gi==2){c.pairs.forEach(p=>{if(p[0]===p[1])errs.push('6c same class pair');});}
  if(lv==7&&gi==0){if(!eq(c.a.L,c.a.Rv))errs.push('7a correct not equal');c.ws.forEach(w=>{if(eq(w.L,w.Rv))errs.push('7a wrong is true '+w.h);});}
  if(lv==8&&gi==2){const s=Math.sqrt(c.r);const f=x=>x*x+(c.plus?1:-1)*s*x;const x2=c.plus?-s:s;if(!eq(f(0),0)||!eq(f(x2),0))errs.push('8c');}
  if(lv==8&&gi==3){c.roots.forEach(x=>{if(c.k*(x-c.h)**2!==c.rhs)errs.push('8d');});if(q.type==='fill'&&q.answer!==Math.max(...c.roots))errs.push('8d max');}
 }}});
// symbolic identities, sampled numerically
const rs=()=>Math.random()*5+0.1;
for(let i=0;i<2000;i++){const a=-rs(),b=-rs(),x=-rs(),y=rs(),p=rs(),k=1+Math.floor(Math.random()*5);
 if(!eq(Math.sqrt(a**3*b),-a*Math.sqrt(a*b)))errs.push('3c A');
 if(!eq(Math.sqrt(a*b**3),-b*Math.sqrt(a*b)))errs.push('3c B');
 if(!eq(x*Math.sqrt(-k/x),-Math.sqrt(-k*x)))errs.push('3d');
 if(!eq(Math.sqrt(a*a)+Math.abs(a),-2*a))errs.push('3e');
 if(!eq(Math.sqrt(k*k*a*a),-k*a))errs.push('3e2');
 if(!eq(k*Math.sqrt(1/p**3),k*Math.sqrt(p)/p**2))errs.push('4d');
 if(!eq(Math.sqrt(8/(27*p)),2*Math.sqrt(6*p)/(9*p)))errs.push('4e');
 if(!eq((1/Math.sqrt(p*y))/(1/Math.sqrt(p)),Math.sqrt(y)/y))errs.push('8f1');
 if(!eq(Math.sqrt(p/y)/Math.sqrt(1/(p*y)),p))errs.push('8f2');}
// 8e inequality: 2√3x+2√6>3√2x  <=> x < 2√2+2√3
const B=2*Math.sqrt(2)+2*Math.sqrt(3);
for(let i=0;i<20000;i++){const x=Math.random()*40-20;if(Math.abs(x-B)<1e-6)continue;const lhs=2*Math.sqrt(3)*x+2*Math.sqrt(6)>3*Math.sqrt(2)*x;if(lhs!==(x<B))errs.push('8e '+x);}
// 2d: domain of √(a-x)/(b-|x|) equals x<=a && x!=-b
for(const a of [1,2,3])for(let b=a+1;b<=a+3;b++)for(let x=-10;x<=10;x+=0.5){const ok=(a-x>=0)&&(b-Math.abs(x)!==0);if(ok!==(x<=a&&x!==-b))errs.push('2d');}
console.log('checked',count,'questions; errors:',errs.length);console.log([...new Set(errs)].slice(0,20).join('\n'));
