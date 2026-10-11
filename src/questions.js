"use strict";
/* ================= 数学排版 ================= */
const SQ='<span class="rs"><svg viewBox="0 0 10 20" preserveAspectRatio="none"><path d="M0.5 11.5 L2.6 10.4 L5.4 19 L9.6 0.5 L10.5 0.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg></span>';
const R=x=>`<span class="rad">${SQ}<span class="ri">${x}</span></span>`;
const F=(n,d)=>`<span class="fr"><span class="fn">${n}</span><span class="fd">${d}</span></span>`;
const M='−';
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a;};
function simp(n){let s=1,r=n;for(let k=2;k*k<=r;k++){while(r%(k*k)===0){r/=k*k;s*=k;}}return [s,r];}
const isSq=n=>Number.isInteger(Math.sqrt(n));
const num=n=>n<0?M+(-n):String(n);
const dec=x=>String(parseFloat(x.toFixed(6)));
function frac(n,d){if(d<0){n=-n;d=-d;}const g=gcd(n,d)||1;n/=g;d/=g;const s=n<0?M:'';n=Math.abs(n);return s+(d===1?String(n):F(n,d));}
/* 值为 n·√r / d 的最简形式 */
function rad(n,d,r){const t=simp(r);const s=t[0],rr=t[1];n*=s;
 if(rr===1)return {h:frac(n,d),v:n/d};
 if(d<0){n=-n;d=-d;}const g=gcd(n,d);n/=g;d/=g;
 const sg=n<0?M:'';const an=Math.abs(n);const nu=(an===1?'':an)+R(rr);
 return {h:sg+(d===1?nu:F(nu,d)),v:n*Math.sqrt(rr)/d};}
const S_=h=>({h});
const coef=k=>k===1?'':String(k);
function lin(k,c,v){return coef(k)+v+(c>0?` + ${c}`:c<0?` ${M} ${-c}`:'');}
function hash(s){let h=0;for(let i=0;i<s.length;i++){h=(h*31+s.charCodeAt(i))|0;}return (h>>>0).toString(36);}
function MC(o){const opts=[o.ans];
 for(const w of o.wrong){if(opts.length>=4)break;if(opts.some(p=>p.h===w.h))continue;
  if(w.v!==undefined&&o.ans.v!==undefined&&Math.abs(w.v-o.ans.v)<1e-9)continue;opts.push(w);}
 const sh=shuffle(opts);
 return {type:'mc',id:'h'+hash(o.stem+o.ans.h),stem:o.stem,options:sh.map(p=>p.h),answer:sh.indexOf(o.ans),hint:o.hint,steps:o.steps,ev:o.ev,vals:sh.map(p=>p.v)};}
function FILL(o){return {type:'fill',id:'h'+hash(o.stem),stem:o.stem,answer:o.answer,hint:o.hint,steps:o.steps,ev:o.ev};}

/* ================= 题目生成器 ================= */
const G={};
/* 第1关 热身：开平方 */
G[1]=[
 function(){const n=rnd(2,20);return FILL({stem:`计算：${R(n*n)} = ？`,answer:n,ev:Math.sqrt(n*n),
  hint:`想一想：哪个<b>正数</b>自己乘自己等于 ${n*n}？`,steps:[`${n} × ${n} = ${n*n}`,`所以 ${R(n*n)} = ${n}`]});},
 function(){const k=pick([1,2,3,4,5,6,7,8,9,11,12,13,14,15]);const a=dec(k/10),b=dec(k*k/100);
  return FILL({stem:`计算：${R(b)} = ？`,answer:k/10,ev:Math.sqrt(k*k/100),
  hint:`试试先看整数：${R(k*k)} = ${k}，再想想小数点的位置。`,steps:[`${a} × ${a} = ${b}`,`所以 ${R(b)} = ${a}`]});},
 function(){let p,q;do{q=rnd(2,9);p=rnd(1,q-1);}while(gcd(p,q)!==1);
  return MC({stem:`计算：${R(F(p*p,q*q))} = ？`,ev:Math.sqrt(p*p/(q*q)),ans:{h:frac(p,q),v:p/q},
  wrong:[{h:frac(q,p),v:q/p},{h:frac(p*p,q),v:p*p/q},{h:frac(p,q*q),v:p/(q*q)},{h:frac(p,2*q),v:p/(2*q)},{h:frac(p+1,q),v:(p+1)/q}],
  hint:`分子、分母分别开平方：${R(p*p)} 和 ${R(q*q)}。`,steps:[`${R(F(p*p,q*q))} = ${F(R(p*p),R(q*q))}`,`= ${frac(p,q)}`]});},
 function(){const n=rnd(2,12);return MC({stem:`${n*n} 的<b>算术平方根</b>是？`,ans:{h:String(n),v:n},
  wrong:[S_('±'+n),{h:M+n,v:-n},{h:String(n*n),v:n*n}],ev:Math.sqrt(n*n),hint:`算术平方根是那个<b>不是负数</b>的平方根哦。`,
  steps:[`${n*n} 的平方根是 ±${n}`,`其中非负的 ${n} 叫算术平方根，即 ${R(n*n)} = ${n}`]});},
 function(){const n=pick([2,3,5,6,7,8,10,11,12,13,15]);return FILL({stem:`计算：(${R(n)})² = ？`,answer:n,ev:Math.pow(Math.sqrt(n),2),
  hint:`先开方再平方，正好"抵消"。`,steps:[`(${R('a')})² = a（a ≥ 0）`,`所以 (${R(n)})² = ${n}`]});}
];
/* 第2关 有意义的条件 */
G[2]=[
 function(){const a=rnd(1,9);return MC({stem:`要使 ${R('x '+M+' '+a)} 有意义，x 的取值范围是？`,ans:S_(`x ≥ ${a}`),
  wrong:[S_(`x &gt; ${a}`),S_(`x ≤ ${a}`),S_(`x ≥ ${M}${a}`)],hint:`根号里面的数（被开方数）要 <b>≥ 0</b>。`,
  steps:[`被开方数 ≥ 0：x ${M} ${a} ≥ 0`,`移项得 x ≥ ${a}`]});},
 function(){const b=rnd(1,9);return MC({stem:`要使 ${R(b+' '+M+' x')} 有意义，x 的取值范围是？`,ans:S_(`x ≤ ${b}`),
  wrong:[S_(`x ≥ ${b}`),S_(`x &lt; ${b}`),S_(`x ≤ ${M}${b}`)],hint:`被开方数 ${b} ${M} x 要 ≥ 0。`,
  steps:[`${b} ${M} x ≥ 0`,`移项得 ${b} ≥ x`,`即 x ≤ ${b}`]});},
 function(){const k=rnd(2,5),r=rnd(1,6);return MC({stem:`要使 ${R(`${k}x ${M} ${k*r}`)} 有意义，x 的取值范围是？`,ans:S_(`x ≥ ${r}`),
  wrong:[S_(`x ≥ ${k*r}`),S_(`x ≤ ${r}`),S_(`x &gt; ${r}`)],hint:`列不等式 ${k}x ${M} ${k*r} ≥ 0，再两边除以 ${k}。`,
  steps:[`${k}x ${M} ${k*r} ≥ 0`,`${k}x ≥ ${k*r}`,`x ≥ ${r}`]});},
 function(){const a=rnd(1,3),b=a+rnd(1,3);return MC({stem:`要使式子 ${F(R(a+' '+M+' x'),b+' '+M+' |x|')} 有意义，x 的取值范围是？`,
  ans:S_(`x ≤ ${a} 且 x ≠ ${M}${b}`),wrong:[S_(`x ≤ ${a}`),S_(`x ≥ ${a} 且 x ≠ ${b}`),S_(`x &lt; ${a} 且 x ≠ ${M}${b}`)],
  hint:`两个条件：① 根号里 ≥ 0；② <b>分母不能为 0</b>。`,
  steps:[`根号里：${a} ${M} x ≥ 0，得 x ≤ ${a}`,`分母：${b} ${M} |x| ≠ 0，得 x ≠ ±${b}`,`因为 x ≤ ${a} &lt; ${b}，x = ${b} 本来就不可能，只需 x ≠ ${M}${b}`,`所以 x ≤ ${a} 且 x ≠ ${M}${b}`]});},
 function(){const a=rnd(1,9);return MC({stem:`要使 ${F(1,R('x '+M+' '+a))} 有意义，x 的取值范围是？`,ans:S_(`x &gt; ${a}`),
  wrong:[S_(`x ≥ ${a}`),S_(`x &lt; ${a}`),S_(`x ≠ ${a}`)],hint:`根号在分母上：既要 ≥ 0，又不能等于 0。`,
  steps:[`被开方数 ≥ 0 且分母 ≠ 0`,`所以 x ${M} ${a} &gt; 0`,`x &gt; ${a}`]});},
 function(){const a=rnd(1,9);return FILL({stem:`若 ${R('x '+M+' '+a)} + ${R(a+' '+M+' x')} 有意义，则 x = ？`,answer:a,
  hint:`两个根号都要有意义：x ${M} ${a} ≥ 0 并且 ${a} ${M} x ≥ 0。`,steps:[`x ${M} ${a} ≥ 0 ⇒ x ≥ ${a}`,`${a} ${M} x ≥ 0 ⇒ x ≤ ${a}`,`同时满足只能 x = ${a}`]});}
];
/* 第3关 √(a²)=|a| */
G[3]=[
 function(){const n=rnd(2,12);return FILL({stem:`计算：${R(`(${M}${n})²`)} = ？`,answer:n,ev:Math.sqrt(n*n),
  hint:`${R('a²')} = |a|，结果一定不是负数。`,steps:[`(${M}${n})² = ${n*n}`,`${R(n*n)} = ${n}（也可以用 ${R('a²')} = |a| = |${M}${n}| = ${n}）`]});},
 function(){const a=rnd(1,9);const lt=Math.random()<.6;
  const ans=lt?`${a} ${M} x`:`x ${M} ${a}`,oth=lt?`x ${M} ${a}`:`${a} ${M} x`;
  return MC({stem:`若 x ${lt?'&lt;':'&gt;'} ${a}，化简 ${R(`(x ${M} ${a})²`)} = ？`,ans:S_(ans),
  wrong:[S_(oth),S_(`±(x ${M} ${a})`),S_(`x + ${a}`)],hint:`先写成 |x ${M} ${a}|，再看 x ${M} ${a} 是正还是负。`,
  steps:[`${R(`(x ${M} ${a})²`)} = |x ${M} ${a}|`,`因为 x ${lt?'&lt;':'&gt;'} ${a}，所以 x ${M} ${a} ${lt?'&lt;':'&gt;'} 0`,`|x ${M} ${a}| = ${ans}`]});},
 function(){if(Math.random()<.5){return MC({stem:`已知 b &lt; 0，化简 ${R('a³b')} = ？`,ans:S_(`${M}a${R('ab')}`),
   wrong:[S_(`a${R('ab')}`),S_(`${M}a${R(M+'ab')}`),S_(`a${R(M+'ab')}`)],hint:`a³b ≥ 0 且 b &lt; 0，那 a 是正还是负？`,
   steps:[`被开方数 a³b ≥ 0，又 b &lt; 0，所以 a ≤ 0`,`a³b = a² · ab`,`${R('a² · ab')} = |a|${R('ab')}`,`a ≤ 0，|a| = ${M}a，所以结果是 ${M}a${R('ab')}`]});}
  return MC({stem:`已知 a &lt; 0，化简 ${R('ab³')} = ？`,ans:S_(`${M}b${R('ab')}`),
   wrong:[S_(`b${R('ab')}`),S_(`${M}b${R(M+'ab')}`),S_(`b${R(M+'ab')}`)],hint:`ab³ ≥ 0 且 a &lt; 0，那 b 是正还是负？`,
   steps:[`被开方数 ab³ ≥ 0，又 a &lt; 0，所以 b ≤ 0`,`ab³ = b² · ab`,`${R('b² · ab')} = |b|${R('ab')}`,`b ≤ 0，|b| = ${M}b，所以结果是 ${M}b${R('ab')}`]});},
 function(){const k=rnd(1,5);const kx=(k===1?'':k)+'x';
  return MC({stem:`已知 x &lt; 0，化简 x${R(F(M+k,'x'))} = ？`,ans:S_(`${M}${R(M+kx)}`),
  wrong:[S_(R(M+kx)),S_(`${M}${R(kx)}`),S_(R(kx))],hint:`x 是负数！把 x 移进根号前，先把负号留在外面：x = ${M}${R('x²')}。`,
  steps:[`因为 x &lt; 0，所以 x = ${M}|x| = ${M}${R('x²')}`,`x${R(F(M+k,'x'))} = ${M}${R(`x² · ${F(M+k,'x')}`)}`,`= ${M}${R(M+kx)}`]});},
 function(){if(Math.random()<.5){return MC({stem:`若 a &lt; 0，则 ${R('a²')} + |a| = ？`,ans:S_(`${M}2a`),
   wrong:[S_('0'),S_('2a'),S_('a²')],hint:`a &lt; 0 时，${R('a²')} = |a| = ${M}a。`,steps:[`${R('a²')} = |a| = ${M}a`,`|a| = ${M}a`,`和为 ${M}a + (${M}a) = ${M}2a`]});}
  const m=rnd(2,5);return MC({stem:`若 a &lt; 0，化简 ${R(m*m+'a²')} = ？`,ans:S_(`${M}${m}a`),
   wrong:[S_(`${m}a`),S_(`±${m}a`),S_(`${m*m}a`)],hint:`${R(m*m+'a²')} = |${m}a|，a 是负数哦。`,
   steps:[`${R(m*m+'a²')} = ${R(`(${m}a)²`)} = |${m}a|`,`a &lt; 0，所以 ${m}a &lt; 0`,`|${m}a| = ${M}${m}a`]});}
];
/* 第4关 化简 */
G[4]=[
 function(){const s=rnd(2,5),r=pick([2,3,5,6,7]),N=s*s*r;return MC({stem:`化简：${R(N)} = ？`,ev:Math.sqrt(N),ans:rad(1,1,N),
  wrong:[{h:r+R(s),v:r*Math.sqrt(s)},{h:s+R(r*s),v:s*Math.sqrt(r*s)},rad(2*s,1,r),rad(s*s,1,r),rad(1,1,r)],
  hint:`把 ${N} 拆成"平方数 × 另一个数"：${N} = ${s*s} × ?`,steps:[`${N} = ${s*s} × ${r}`,`${R(N)} = ${R(s*s)} × ${R(r)} = ${s}${R(r)}`]});},
 function(){const m=pick([2,3,5,6,7,8,12]);const d=dec(m/10);const A=rad(1,10,10*m);
  return MC({stem:`化简：${R(d)} = ？`,ev:Math.sqrt(m/10),ans:A,wrong:[rad(1,10,m),rad(1,5,10*m),rad(1,1,10*m),rad(1,100,10*m),rad(m,10,10)],
  hint:`先把小数化成分数，再让分母变成平方数。`,steps:[`${d} = ${F(m,10)} = ${F(10*m,100)}`,`${R(F(10*m,100))} = ${F(R(10*m),10)}`,`化简得 ${A.h}`]});},
 function(){const q=pick([2,3]),t=rnd(1,3),s=rnd(2,4),r=pick([2,3,5]);const m=q*t,N=s*s*r;const A=rad(t*s,1,r);
  return MC({stem:`化简：${m}${R(F(N,q*q))} = ？`,ev:m*Math.sqrt(N/(q*q)),ans:A,
  wrong:[rad(m*s,1,r),rad(t*s,q,r),rad(t,1,N),rad(t*s,1,r*q),rad(m,q,N)],hint:`分母 ${q*q} 是平方数，可以直接开出来：${R(F(N,q*q))} = ${F(R(N),q)}。`,
  steps:[`${R(F(N,q*q))} = ${F(R(N),q)} = ${F(s+R(r),q)}`,`${m} × ${F(s+R(r),q)} = ${A.h}`]});},
 function(){const k=rnd(1,4);const c=coef(k);return MC({stem:`已知 a &gt; 0，化简 ${c}${R(F(1,'a³'))} = ？`,ans:S_(F(c+R('a'),'a²')),
  wrong:[S_(F(c+R('a'),'a')),S_(F(R(k+'a'),'a²')),S_(F(c+R('a'),'a³')),S_(`${c}a${R('a')}`)],hint:`让分母变成平方式：${F(1,'a³')} = ${F('a','a⁴')}。`,
  steps:[`${F(1,'a³')} = ${F('a','a³ · a')} = ${F('a','a⁴')}`,`${R(F('a','a⁴'))} = ${F(R('a'),'a²')}`,`所以结果为 ${F(c+R('a'),'a²')}`]});},
 function(){return MC({stem:`已知 a &gt; 0，化简 ${R(F(8,'27a'))} = ？`,ans:S_(F('2'+R('6a'),'9a')),
  wrong:[S_(F('2'+R('6a'),'3a')),S_(F(R('6a'),'9a')),S_(F('2'+R('2a'),'9a')),S_(F('2'+R('6a'),'27a'))],
  hint:`分子分母同乘 3a，让分母变成 81a²（是平方式）。`,steps:[`${F(8,'27a')} = ${F('8 × 3a','27a × 3a')} = ${F('24a','81a²')}`,`${R(F('24a','81a²'))} = ${F(R('24a'),'9a')}`,`${R('24a')} = ${R('4 × 6a')} = 2${R('6a')}，结果 ${F('2'+R('6a'),'9a')}`]});},
 function(){let p,r;do{r=pick([2,3,5,6,7]);p=rnd(1,r-1);}while(gcd(p,r)!==1||isSq(p*r));const A=rad(1,r,p*r);
  return MC({stem:`化简：${R(F(p,r))} = ？`,ev:Math.sqrt(p/r),ans:A,wrong:[rad(1,r,p),rad(1,p,r),rad(1,1,p*r),rad(r,1,p),rad(p,1,r)],
  hint:`分母里不能有根号！分子分母同乘 ${r}，让分母变成 ${r*r}。`,steps:[`${F(p,r)} = ${F(p*r,r*r)}`,`${R(F(p*r,r*r))} = ${F(R(p*r),r)}`,`= ${A.h}`]});}
];
/* 第5关 最简二次根式 */
function poolSimple(){return pick([
 ()=>({h:R(pick([2,3,5,6,7,10,11,13,14,15]))}),()=>({h:R('a² + b²')}),()=>({h:R('x + 1')}),()=>({h:R(pick([2,3,5,6,7])+'a')})])();}
function poolNon(){return pick([
 ()=>{const s=rnd(2,4),r=pick([2,3,5]),N=s*s*r;return {h:R(N),why:`${R(N)} = ${s}${R(r)}，含能开得尽方的因数 ${s*s}`};},
 ()=>{const r=pick([2,3,5,7]);return {h:R(F(1,r)),why:`${R(F(1,r))} 的被开方数含分母`};},
 ()=>{const m=pick(['0.5','0.2','1.5']);return {h:R(m),why:`${R(m)} 的被开方数是小数（相当于含分母）`};},
 ()=>({h:R('a²b'),why:`${R('a²b')} 含能开得尽方的因式 a²`}),
 ()=>{const k=pick([4,9]);return {h:R(k+'a'),why:`${R(k+'a')} 含能开得尽方的因数 ${k}`};},
 ()=>({h:R(F('x',2)),why:`${R(F('x',2))} 的被开方数含分母`}),
 ()=>({h:R('a³'),why:`${R('a³')} = a${R('a')}，含因式 a²`})])();}
function uniq(gen,n){const out=[];let g=0;while(out.length<n&&g++<300){const x=gen();if(!out.some(y=>y.h===x.h))out.push(x);}return out;}
const RULE=`最简二次根式要同时满足：① 被开方数不含分母（也不能是小数）；② 不含能开得尽方的因数或因式。`;
G[5]=[
 function(){const a=poolSimple(),w=uniq(poolNon,3);return MC({stem:`下列二次根式中，是<b>最简二次根式</b>的是？`,ans:a,wrong:w,
  hint:RULE,steps:[...w.map(x=>x.why+'，不是最简'),`${a.h} 满足两个条件，是最简二次根式 ✓`]});},
 function(){const a=poolNon(),w=uniq(poolSimple,3);return MC({stem:`下列二次根式中，<b>不是</b>最简二次根式的是？`,ans:a,wrong:w,
  hint:RULE,steps:[`${a.why}，所以它不是最简二次根式`,`其余选项都满足两个条件 ✓`]});},
 function(){const s=rnd(2,6),r=pick([2,3,5,6,7]),N=s*s*r;return FILL({stem:`把 ${R(N)} 化成最简二次根式 a${R(r)}，则 a = ？`,answer:s,ev:Math.sqrt(N)/Math.sqrt(r),
  hint:`找出 ${N} 里最大的平方因数。`,steps:[`${N} = ${s*s} × ${r}`,`${R(N)} = ${s}${R(r)}`,`所以 a = ${s}`]});},
 function(){const a=poolSimple(),w=uniq(poolNon,3);return MC({stem:`小根想挑一个已经"最简"、不用再化简的根式，应该选？`,ans:a,wrong:w,
  hint:RULE,steps:[...w.map(x=>x.why),`只有 ${a.h} 已经是最简二次根式 ✓`]});}
];
/* 第6关 同类二次根式 */
G[6]=[
 function(){const r=pick([2,3,5,6,7]);let th,ts,tv;
  if(Math.random()<.5){const s=rnd(1,3),N=s*s*r;th=R(F(1,N));const o=rad(1,s*r,r);ts=o.h;tv=Math.sqrt(1/N)-o.v;}else{const s=rnd(2,3);th=R(s*s*r);const o=rad(s,1,r);ts=o.h;tv=Math.sqrt(s*s*r)-o.v;}
  let t;do{t=rnd(1,4);}while(R(t*t*r)===th);
  const ans={h:R(t*t*r),sh:rad(t,1,r).h,cls:r};
  const others=shuffle([2,3,5,6,7].filter(x=>x!==r)).slice(0,3).map(rr=>{const u=rnd(1,3);return {h:R(u*u*rr),sh:rad(u,1,rr).h,cls:rr};});
  const q=MC({stem:`下列二次根式中，与 ${th} 是<b>同类二次根式</b>的是？`,ans,wrong:others,hint:`先把每个根式都化成最简，再比较根号里面的数。`,
  steps:[`${th} = ${ts}`,...[ans,...others].map(o=>`${o.h} = ${o.sh}`),`被开方数相同的是 ${ans.h} ✓`]});q.chk={tv,cls:r,others:others.map(o=>o.cls)};return q;},
 function(){const k1=rnd(1,3),k2=k1+rnd(1,2),a0=rnd(1,6),V=pick([2,3,5,6,7,10,11]);const c1=V-k1*a0,c2=V-k2*a0;
  const e1=lin(k1,c1,'a'),e2=lin(k2,c2,'a');
  const q=FILL({stem:`若最简二次根式 ${R(e1)} 与 ${R(e2)} 是同类二次根式，则 a = ？`,answer:a0,
  hint:`两个<b>最简</b>二次根式是同类 ⇔ 被开方数<b>相等</b>。`,steps:[`列方程：${e1} = ${e2}`,`解得 a = ${a0}`,`检验：此时两个被开方数都等于 ${V}，是最简二次根式 ✓`]});q.chk={k1,c1,k2,c2,V};return q;},
 function(){const r=pick([2,3,5,6,7]);let s1=rnd(1,4),s2;do{s2=rnd(1,4);}while(s2===s1);
  const pr=(x,y)=>`${R(x)} 与 ${R(y)}`;
  const ans={h:pr(s1*s1*r,s2*s2*r)};const st=[`${R(s1*s1*r)} = ${rad(s1,1,r).h}，${R(s2*s2*r)} = ${rad(s2,1,r).h}，被开方数都是 ${r} ✓`];
  const ws=[];const pool=shuffle([2,3,5,6,7]);const pairs=[];
  for(let i=0;i<3;i++){const r1=pool[i],r2=pool[(i+1)%5];const u=rnd(1,3),v=rnd(1,3);pairs.push([r1,r2]);ws.push({h:pr(u*u*r1,v*v*r2)});st.push(`${R(u*u*r1)} = ${rad(u,1,r1).h}，${R(v*v*r2)} = ${rad(v,1,r2).h}，不是同类`);}
  const q=MC({stem:`下列各组二次根式中，是<b>同类二次根式</b>的一组是？`,ans,wrong:ws,hint:`化成最简后，被开方数相同的才是同类。`,steps:st});q.chk={pairs};return q;}
];
/* 第7关 加减 */
function c7(){return pick([
 ()=>{const a=rnd(1,5),b=rnd(1,5),r=pick([2,3,5,6,7]);return {h:`${coef(a)}${R(r)} + ${coef(b)}${R(r)} = ${a+b}${R(r)}`,why:`同类二次根式系数相加：${a} + ${b} = ${a+b} ✓`,L:(a+b)*Math.sqrt(r),Rv:(a+b)*Math.sqrt(r)};},
 ()=>{const r=pick([2,3,5,6]);return {h:`${R(r)} + ${F(1,2)}${R(r)} = ${F(3,2)}${R(r)}`,why:`1 + ${F(1,2)} = ${F(3,2)}，所以等于 ${F(3,2)}${R(r)} ✓`,L:Math.sqrt(r)*1.5,Rv:1.5*Math.sqrt(r)};},
 ()=>{const b=rnd(1,4),a=b+rnd(2,4),r=pick([2,3,5,7]);return {h:`${a}${R(r)} ${M} ${coef(b)}${R(r)} = ${a-b}${R(r)}`,why:`系数相减：${a} ${M} ${b} = ${a-b} ✓`,L:a*Math.sqrt(r)-b*Math.sqrt(r),Rv:(a-b)*Math.sqrt(r)};}])();}
function w7(){return [
 ()=>{const p=pick([2,3,5]),q=pick([6,7,10,11]);return {h:`${R(p)} + ${R(q)} = ${R(p+q)}`,why:`${R(p)} 和 ${R(q)} 不是同类二次根式，不能合并`,L:Math.sqrt(p)+Math.sqrt(q),Rv:Math.sqrt(p+q)};},
 ()=>{const m=rnd(2,5),n=rnd(2,4),r=pick([2,3,5]);return {h:`${m} + ${n}${R(r)} = ${m+n}${R(r)}`,why:`${m} 是有理数，${n}${R(r)} 是根式，不能合并`,L:m+n*Math.sqrt(r),Rv:(m+n)*Math.sqrt(r)};},
 ()=>{const b=rnd(1,3),a=b+rnd(1,3),r=pick([2,3,5,7]);return {h:`${a}${R(r)} ${M} ${coef(b)}${R(r)} = ${a-b}`,why:`应得 ${rad(a-b,1,r).h}，根号部分不能丢`,L:(a-b)*Math.sqrt(r),Rv:a-b};},
 ()=>{const s=rnd(2,3),r=pick([2,3,5]);return {h:`${R(s*s*r)} = ${s*s}${R(r)}`,why:`${R(s*s*r)} = ${s}${R(r)}，开出来的是 ${s} 不是 ${s*s}`,L:Math.sqrt(s*s*r),Rv:s*s*Math.sqrt(r)};}];}
G[7]=[
 function(){const a=c7();const ws=shuffle(w7()).slice(0,3).map(f=>f());const q=MC({stem:`下列计算<b>正确</b>的是？`,ans:a,wrong:ws,
  hint:`只有<b>同类</b>二次根式才能合并，合并时系数相加、根号部分不变。`,steps:[...ws.map(w=>w.why+'，错误'),a.why]});q.chk={a,ws};return q;},
 function(){const r=pick([2,3,5,6]);let s1=rnd(1,4),s2;do{s2=rnd(1,4);}while(s2===s1);const plus=Math.random()<.5;
  if(!plus&&s1<s2){const t=s1;s1=s2;s2=t;}const k=plus?s1+s2:s1-s2;const A=rad(k,1,r);const op=plus?'+':M;
  return MC({stem:`计算：${R(s1*s1*r)} ${op} ${R(s2*s2*r)} = ？`,ev:plus?Math.sqrt(s1*s1*r)+Math.sqrt(s2*s2*r):Math.sqrt(s1*s1*r)-Math.sqrt(s2*s2*r),ans:A,
  wrong:[rad(1,1,plus?(s1*s1+s2*s2)*r:(s1*s1-s2*s2)*r),rad(s1*s2,1,r),rad(k+1,1,r),rad(k,1,2*r),rad(k,1,r*r+1)],hint:`先把两个根式分别化简，再合并。`,
  steps:[`${R(s1*s1*r)} = ${rad(s1,1,r).h}，${R(s2*s2*r)} = ${rad(s2,1,r).h}`,`${rad(s1,1,r).h} ${op} ${rad(s2,1,r).h} = (${s1} ${op} ${s2})${R(r)} = ${A.h}`]});},
 function(){const r=pick([2,3,5,7]);const a=rnd(2,6),b=rnd(1,5),c=rnd(1,a+b-1);
  return FILL({stem:`${a}${R(r)} + ${coef(b)}${R(r)} ${M} ${coef(c)}${R(r)} = k${R(r)}，则 k = ？`,answer:a+b-c,ev:(a*Math.sqrt(r)+b*Math.sqrt(r)-c*Math.sqrt(r))/Math.sqrt(r),
  hint:`把 ${R(r)} 当成一个"字母"，像合并同类项一样算系数。`,steps:[`系数：${a} + ${b} ${M} ${c} = ${a+b-c}`,`所以 k = ${a+b-c}`]});},
 function(){const q=rnd(2,4),r=pick([2,3,5,6]);const A=rad(q+1,q,r);
  return MC({stem:`计算：${R(r)} + ${F(1,q)}${R(r)} = ？`,ev:Math.sqrt(r)*(1+1/q),ans:A,wrong:[rad(2,q,r),rad(1,q+1,r),rad(2,1,r),rad(1,1,r+q)],
  hint:`${R(r)} 前面的系数是 1。`,steps:[`(1 + ${F(1,q)})${R(r)}`,`= ${F(q+1,q)}${R(r)}`]});}
];
/* 第8关 乘除、分母有理化、解方程 */
G[8]=[
 function(){const r=pick([2,3,5,6,7]);const k=pick([1,2,3,r,2*r,rnd(1,6)]);const A=rad(k,r,r);
  return MC({stem:`分母有理化：${F(k,R(r))} = ？`,ev:k/Math.sqrt(r),ans:A,wrong:[rad(k,1,r),{h:frac(k,r),v:k/r},rad(1,k,r),rad(k,r*r,r),rad(r,k,r)],
  hint:`分子和分母同时乘 ${R(r)}，因为 ${R(r)} × ${R(r)} = ${r}。`,steps:[`${F(k,R(r))} = ${F(k+' × '+R(r),R(r)+' × '+R(r))} = ${F(coef(k)+R(r),r)}`,`= ${A.h}`]});},
 function(){if(Math.random()<.5){let a,b;do{a=pick([2,3,5,6,7]);b=pick([2,3,6,8,10,12]);}while(a===b||isSq(a*b));const A=rad(1,1,a*b);
   return MC({stem:`计算：${R(a)} × ${R(b)} = ？`,ev:Math.sqrt(a)*Math.sqrt(b),ans:A,wrong:[rad(1,1,a+b),{h:String(a*b),v:a*b},rad(a,1,b),rad(2,1,a*b)],
   hint:`${R('a')} · ${R('b')} = ${R('ab')}，算完记得化简。`,steps:[`${R(a)} × ${R(b)} = ${R(a*b)}`,`化简：${R(a*b)} = ${A.h}`]});}
  let a,b;do{a=pick([2,3,5,6]);b=pick([2,3,6,8,12]);}while(a===b);const A=rad(1,1,b);
  return MC({stem:`计算：${R(a*b)} ÷ ${R(a)} = ？`,ev:Math.sqrt(a*b)/Math.sqrt(a),ans:A,wrong:[rad(1,1,a*b-a),{h:String(b),v:b},rad(1,1,a),rad(a,1,b)],
  hint:`${R('a')} ÷ ${R('b')} = ${R(F('a','b'))}。`,steps:[`${R(a*b)} ÷ ${R(a)} = ${R(a*b+' ÷ '+a)} = ${R(b)}`,`化简：${A.h}`]});},
 function(){const r=pick([2,3,5,6,7]);const plus=Math.random()<.6;const op=plus?'+':M;const x2=plus?`${M}${R(r)}`:R(r),x2w=plus?R(r):`${M}${R(r)}`;
  const q=MC({stem:`解方程：x² ${op} ${R(r)}x = 0`,ans:S_(`x₁ = 0，x₂ = ${x2}`),wrong:[S_(`x = ${x2}`),S_(`x₁ = 0，x₂ = ${x2w}`),S_(`x₁ = ${R(r)}，x₂ = ${M}${R(r)}`)],
  hint:`提公因式 x，变成两个因式相乘等于 0。别把 x = 0 弄丢了！`,steps:[`提公因式：x(x ${op} ${R(r)}) = 0`,`x = 0 或 x ${op} ${R(r)} = 0`,`所以 x₁ = 0，x₂ = ${x2}`]});
  q.chk={r,plus};return q;},
 function(){const k=rnd(2,5),m=rnd(2,5),h=rnd(1,4);const rhs=k*m*m;
  const st=[`两边同除以 ${k}：(x ${M} ${h})² = ${m*m}`,`开平方：x ${M} ${h} = ±${m}`,`x₁ = ${h} + ${m} = ${h+m}，x₂ = ${h} ${M} ${m} = ${num(h-m)}`];
  let q;
  if(Math.random()<.5)q=FILL({stem:`解方程 ${k}(x ${M} ${h})² = ${rhs}，它<b>较大</b>的根 x = ？`,answer:h+m,hint:`先两边除以 ${k}，再开平方，记得有 ± 两种情况。`,steps:st});
  else q=MC({stem:`解方程：${k}(x ${M} ${h})² = ${rhs}`,ans:S_(`x₁ = ${h+m}，x₂ = ${num(h-m)}`),wrong:[S_(`x = ${h+m}`),S_(`x₁ = ${num(m-h)}，x₂ = ${num(-m-h)}`),S_(`x₁ = ${h+m*m}，x₂ = ${num(h-m*m)}`)],
  hint:`先两边除以 ${k}，再开平方，记得有 ± 两种情况。`,steps:st});
  q.chk={k,h,rhs,roots:[h+m,h-m]};return q;},
 function(){if(Math.random()<.4){return MC({stem:`解不等式：2${R(3)}x + 2${R(6)} &gt; 3${R(2)}x`,ans:S_(`x &lt; 2${R(2)} + 2${R(3)}`),
   wrong:[S_(`x &gt; 2${R(2)} + 2${R(3)}`),S_(`x &lt; ${M}2${R(2)} ${M} 2${R(3)}`),S_(`x &gt; ${M}2${R(2)} ${M} 2${R(3)}`)],
   hint:`移项后看 x 的系数 2${R(3)} ${M} 3${R(2)} 是正还是负——除以负数要<b>变号</b>！`,
   steps:[`移项：(2${R(3)} ${M} 3${R(2)})x &gt; ${M}2${R(6)}`,`2${R(3)} = ${R(12)} &lt; ${R(18)} = 3${R(2)}，所以系数是负数`,`两边除以负数，不等号变向：x &lt; ${F(`${M}2${R(6)}`,`2${R(3)} ${M} 3${R(2)}`)} = ${F(`2${R(6)}`,`3${R(2)} ${M} 2${R(3)}`)}`,
   `分母有理化（乘 3${R(2)} + 2${R(3)}）：${F(`2${R(6)}(3${R(2)} + 2${R(3)})`,'18 '+M+' 12')} = ${F(`12${R(3)} + 12${R(2)}`,6)}`,`所以 x &lt; 2${R(2)} + 2${R(3)}`]});}
  let p,q;do{p=pick([2,3,5]);q=pick([2,3,5,6,7]);}while(p===q);
  return MC({stem:`解不等式：${R(p)}x &gt; ${R(p*q)}`,ans:S_(`x &gt; ${R(q)}`),wrong:[S_(`x &lt; ${R(q)}`),S_(`x &gt; ${q}`),S_(`x &gt; ${R(p*q)}`)],
  hint:`两边同时除以正数 ${R(p)}，不等号方向不变。`,steps:[`${R(p)} &gt; 0，两边同除以 ${R(p)}`,`x &gt; ${F(R(p*q),R(p))} = ${R(F(p*q,p))} = ${R(q)}`]});},
 function(){if(Math.random()<.5){return MC({stem:`已知 x &gt; 0，y &gt; 0，计算：${F(1,R('xy'))} ÷ ${F(1,R('x'))} = ？`,ans:S_(F(R('y'),'y')),
   wrong:[S_(R('y')),S_(F(R('x'),'x')),S_('y'+R('y'))],hint:`除以一个数等于乘它的倒数。`,
   steps:[`${F(1,R('xy'))} ÷ ${F(1,R('x'))} = ${F(1,R('xy'))} × ${R('x')} = ${F(R('x'),R('xy'))}`,`= ${F(1,R('y'))}`,`分母有理化：${F(1,R('y'))} = ${F(R('y'),'y')}`]});}
  return MC({stem:`已知 x &gt; 0，y &gt; 0，计算：${R(F('x','y'))} ÷ ${R(F(1,'xy'))} = ？`,ans:S_('x'),wrong:[S_('x²'),S_('y'),S_(F('x','y'))],
   hint:`${R('a')} ÷ ${R('b')} = ${R(F('a','b'))}，先把根号里的算出来。`,steps:[`${R(F('x','y'))} ÷ ${R(F(1,'xy'))} = ${R(F('x','y')+' × xy')}`,`= ${R('x²')}`,`x &gt; 0，所以结果为 x`]});}
];
if(typeof module!=='undefined')module.exports={G,rad,simp,frac};
