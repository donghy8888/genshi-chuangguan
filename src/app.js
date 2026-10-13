/* ================= 关卡信息 ================= */
const LV=[
 {name:'热身：开平方',short:'热身开方',icon:'🌱',tip:`${R(9)} = 3，因为 3² = 9。算术平方根一定是<b>非负数</b>。小数、分数也一样：${R('0.25')} = 0.5，${R(F(1,4))} = ${F(1,2)}。`},
 {name:'根式有意义的条件',short:'有意义条件',icon:'🔑',tip:`${R('a')} 有意义 ⇔ 被开方数 a <b>≥ 0</b>。如果式子有分母，还要<b>分母 ≠ 0</b>。`},
 {name:'√(a²) = |a| 与正负号',short:'去根号看正负',icon:'⚖️',tip:`${R('a²')} = |a|：a ≥ 0 时等于 a；a &lt; 0 时等于 ${M}a。先判断正负，再去绝对值！`},
 {name:'化简二次根式',short:'化简根式',icon:'✂️',tip:`把平方因数"搬"出来：${R(48)} = ${R('16 × 3')} = 4${R(3)}。分母里不留根号：${R(F(1,5))} = ${F(R(5),5)}。`},
 {name:'最简二次根式',short:'最简根式',icon:'💎',tip:`最简二次根式：① 被开方数不含分母（也不是小数）；② 不含能开得尽方的因数或因式。`},
 {name:'同类二次根式',short:'同类根式',icon:'👯',tip:`先化成最简，被开方数相同的就是同类：${R(12)} = 2${R(3)} 和 ${R(27)} = 3${R(3)} 是同类。`},
 {name:'二次根式加减',short:'根式加减',icon:'➕',tip:`像合并同类项：只合并同类二次根式，系数相加、根号不变。注意 ${R(2)} + ${R(3)} ≠ ${R(5)}！`},
 {name:'乘除与分母有理化',short:'乘除有理化',icon:'🚀',tip:`${R('a')} · ${R('b')} = ${R('ab')}（a、b ≥ 0）。分母有理化：分子分母同乘一个根式，让分母不含根号。解方程别忘了有两个根！`}
];
const BOSS={name:'本章 Boss：根号大魔王',short:'Boss 关',icon:'👹',tip:'综合八个知识点的 10 道题，答对 8 道就能击败 Boss！你已经练过所有招式了，加油！'};
const TITLES=['根号萌新','根号学徒','开方小能手','化简达人','根式骑士','有理化勇者','去根号大师','根式王者','二次根式之神'];
const BADGES=[
 {id:'first',e:'🌱',n:'第一次打卡',d:'完成第一次每日打卡'},
 {id:'s3',e:'🔥',n:'根号新手',d:'连续打卡 3 天'},
 {id:'s7',e:'🧙',n:'去根号大师',d:'连续打卡 7 天'},
 {id:'pass1',e:'🚩',n:'初次通关',d:'通过任意一关'},
 {id:'star3',e:'⭐',n:'一关三星',d:'任意一关拿到 3 星'},
 {id:'combo5',e:'⚡',n:'五连击',d:'一次练习中连续答对 5 题'},
 {id:'clear',e:'🧹',n:'错题清零',d:'把错题本里的题全部掌握'},
 {id:'all',e:'🗺️',n:'全部通关',d:'通过全部 8 个关卡'},
 {id:'boss',e:'👑',n:'本章Boss击败',d:'击败二次根式大魔王'},
 {id:'xp500',e:'💎',n:'经验500',d:'累计获得 500 XP'},
 {id:'q100',e:'📚',n:'百题勇士',d:'累计答题 100 道'},
 {id:'allstar',e:'🌟',n:'满星收集家',d:'8 关全部 3 星'},
 {id:'t30',e:'⏱️',n:'专注半小时',d:'累计学习满 30 分钟'},
 {id:'t2h',e:'⏳',n:'学习两小时',d:'累计学习满 2 小时'},
 {id:'focus10',e:'🎯',n:'单次专注10分',d:'单次练习专注满 10 分钟'}
];

/* ================= 存档 ================= */
const KEY='genshi_chuangguan_v1';
const DEF={v:1,xp:0,levels:{},boss:{passed:false,best:0,stars:0},wrong:[],sessionNo:0,checkins:[],badges:{},kp:{},tot:{ans:0,cor:0},maxCombo:0,sound:false,lessonSeen:{},sheets:[],sheetUnlock:[],attempts:[],study:{todayMs:0,todayDate:'',byDate:{},totalMs:0,longestSessionMs:0,sessionsCount:0}};
function load(){try{const raw=JSON.parse(localStorage.getItem(KEY)||'null');const o=Object.assign(JSON.parse(JSON.stringify(DEF)),raw||{});if(!o.lessonSeen)o.lessonSeen={};if(!o.sheets)o.sheets=[];if(!o.sheetUnlock)o.sheetUnlock=[];if(!Array.isArray(o.attempts))o.attempts=[];o.study=Object.assign(JSON.parse(JSON.stringify(DEF.study)),o.study||{});if(!o.study.byDate)o.study.byDate={};return o;}catch(e){return JSON.parse(JSON.stringify(DEF));}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
let S=load();
function ds(dt){return dt.getFullYear()+'-'+String(dt.getMonth()+1).padStart(2,'0')+'-'+String(dt.getDate()).padStart(2,'0');}
function today(){return ds(new Date());}
function addDays(s,n){const p=s.split('-').map(Number);return ds(new Date(p[0],p[1]-1,p[2]+n));}
function streak(){const set=new Set(S.checkins);let d=today();if(!set.has(d))d=addDays(d,-1);let c=0;while(set.has(d)){c++;d=addDays(d,-1);}return c;}
function lvInfo(xp){let L=1,need=100,acc=0;while(xp>=acc+need){acc+=need;L++;need=100+(L-1)*50;}return {L,cur:xp-acc,need,title:TITLES[Math.min(L-1,TITLES.length-1)]};}
const lvPassed=n=>!!(S.levels[n]&&S.levels[n].passed);
const lvUnlocked=n=>n===1||lvPassed(n-1)||(S.sheetUnlock||[]).includes(n);
const ALL8=[1,2,3,4,5,6,7,8];
const allPassed=()=>ALL8.every(lvPassed);
function curLevel(){for(let n=1;n<=8;n++)if(!lvPassed(n))return n;return 0;}
const activeWrong=()=>S.wrong.filter(w=>!w.mastered);
const dueWrong=()=>{const t=today();return S.wrong.filter(w=>!w.mastered&&w.due<=t&&w.after<=S.sessionNo);};

/* ================= 学习计时 ================= */
let studyClock={running:false,paused:false,sessionMs:0,tickAt:0,flushAt:0,raf:0};
function ensureStudyDay(){const t=today();if(!S.study)S.study=JSON.parse(JSON.stringify(DEF.study));
 if(S.study.todayDate!==t){S.study.todayDate=t;S.study.todayMs=S.study.byDate[t]||0;}}
function fmtDur(ms){ms=Math.max(0,Math.floor(ms/1000));const h=Math.floor(ms/3600),m=Math.floor((ms%3600)/60),sec=ms%60;
 const p=n=>String(n).padStart(2,'0');return h>0?`${h}:${p(m)}:${p(sec)}`:`${p(m)}:${p(sec)}`;}
function fmtDurCN(ms){ms=Math.max(0,Math.floor(ms/1000));const h=Math.floor(ms/3600),m=Math.floor((ms%3600)/60),sec=ms%60;
 if(h>0)return `${h} 小时 ${m} 分`;if(m>0)return `${m} 分 ${sec} 秒`;return `${sec} 秒`;}
function studyAccrue(now){if(!studyClock.running||studyClock.paused||!studyClock.tickAt)return;
 const d=Math.max(0,now-studyClock.tickAt);if(!d)return;studyClock.tickAt=now;studyClock.sessionMs+=d;
 ensureStudyDay();const t=today();S.study.todayMs=(S.study.todayMs||0)+d;S.study.byDate[t]=(S.study.byDate[t]||0)+d;S.study.totalMs=(S.study.totalMs||0)+d;}
function studyFlush(force){const now=Date.now();studyAccrue(now);if(!force&&now-studyClock.flushAt<4500)return;studyClock.flushAt=now;save();}
function updateTimerUI(){const el=document.getElementById('liveTimer');if(!el)return;
 el.querySelector('.tval').textContent=fmtDur(studyClock.sessionMs);el.classList.toggle('pause',studyClock.paused);}
function studyTick(){if(!studyClock.running)return;studyAccrue(Date.now());updateTimerUI();
 if(Date.now()-studyClock.flushAt>=5000)studyFlush(true);
 studyClock.raf=requestAnimationFrame(studyTick);}
function startStudyTimer(){ensureStudyDay();studyClock.running=true;studyClock.paused=document.hidden;studyClock.sessionMs=0;studyClock.tickAt=Date.now();studyClock.flushAt=Date.now();
 if(studyClock.raf)cancelAnimationFrame(studyClock.raf);studyClock.raf=requestAnimationFrame(studyTick);}
function stopStudyTimer(){if(!studyClock.running)return;studyFlush(true);
 const sessMs=studyClock.sessionMs;S.study.longestSessionMs=Math.max(S.study.longestSessionMs||0,sessMs);
 if(sessMs>=3000){S.study.sessionsCount=(S.study.sessionsCount||0)+1;}
 studyClock.running=false;studyClock.paused=false;studyClock.tickAt=0;if(studyClock.raf){cancelAnimationFrame(studyClock.raf);studyClock.raf=0;}
 save();checkBadges();}
function pauseStudyTimer(){if(!studyClock.running||studyClock.paused)return;studyAccrue(Date.now());studyClock.paused=true;studyClock.tickAt=0;studyFlush(true);updateTimerUI();}
function resumeStudyTimer(){if(!studyClock.running||!studyClock.paused)return;if(document.hidden)return;studyClock.paused=false;studyClock.tickAt=Date.now();updateTimerUI();}
document.addEventListener('visibilitychange',()=>{if(!studyClock.running)return;if(document.hidden)pauseStudyTimer();else if(view==='quiz'&&sess&&!sess.showLesson)resumeStudyTimer();});
window.addEventListener('pagehide',()=>studyFlush(true));
window.addEventListener('beforeunload',()=>studyFlush(true));
function studyDaysStreak(){ensureStudyDay();const bd=S.study.byDate||{};let d=today();if(!(bd[d]>0))d=addDays(d,-1);let c=0;while((bd[d]||0)>0){c++;d=addDays(d,-1);}return c;}
function weekStudyBars(){ensureStudyDay();const labels=['日','一','二','三','四','五','六'];const now=new Date();const t=today();
 const days=[];for(let i=6;i>=0;i--){const dt=new Date(now.getFullYear(),now.getMonth(),now.getDate()-i);days.push(ds(dt));}
 const vals=days.map(d=>S.study.byDate[d]||0);const mx=Math.max(5*60*1000,...vals);
 return `<div class="weekbars">${days.map((d,i)=>{const h=Math.max(4,Math.round((vals[i]/mx)*56));const wd=labels[new Date(d+'T12:00:00').getDay()];
  return `<div class="wb ${d===t?'td':''}" title="${d} ${fmtDurCN(vals[i])}"><div class="bar ${vals[i]>0?'on':''}" style="height:${vals[i]?h:4}px"></div><div class="wd">${wd}</div></div>`;}).join('')}</div>`;}
function studyEncourage(){ensureStudyDay();const todayMs=S.study.todayMs||0;const dsSt=studyDaysStreak();
 if(todayMs>=15*60*1000)return '🌟 今天练了好久，小根为你骄傲！';
 if(todayMs>=5*60*1000)return '💪 今天很棒！已经专注学习 5 分钟以上啦～';
 if(todayMs>=60*1000)return '✨ 开了个好头，再练一会儿就更稳了！';
 if(dsSt>=3)return `🔥 已经连续 ${dsSt} 天有学习记录，保持火苗！`;
 if((S.study.totalMs||0)>0)return '🌱 每天一点点，根号会越来越乖的。';
 return '⏱️ 开始答题后会自动计时，首页能看到你的努力～';}
function studyCardHtml(){ensureStudyDay();const tMs=S.study.todayMs||0,tot=S.study.totalMs||0;
 const todays=(S.attempts||[]).filter(a=>a.date===today()&&!a.variant);
 const n=todays.length,correct=todays.filter(a=>a.firstCorrect).length,hinted=todays.filter(a=>a.hintUsed).length;
 const avg=n?Math.round(todays.reduce((sum,a)=>sum+(a.firstTimeMs||0),0)/n):0;
 return `<div class="card timecard" id="studyCard"><div class="row"><div style="font-size:34px">⏱️</div><div class="sp"><div style="font-size:18px;font-weight:900">学习时长</div><div class="sub">只在答题时计时 · 切到后台会暂停</div></div></div>
 <div class="row" style="margin-top:12px;gap:16px"><div class="sp center"><div class="tbig" id="homeTodayDur">${fmtDur(tMs)}</div><div class="tlab">今日学习</div></div>
 <div class="sp center"><div class="tbig">${fmtDur(tot)}</div><div class="tlab">累计学习</div></div></div>
 <div class="sub" style="margin-top:12px;font-weight:800">本周学习</div>${weekStudyBars()}
 ${n?`<div class="pill" style="margin-top:10px">今日首答：${correct}/${n} 正确 · 提示 ${hinted} 题 · 平均每题 ${fmtDurCN(avg)}</div>`:''}
 <div class="encourage">${studyEncourage()}</div>
 ${(S.study.sessionsCount||0)?`<div class="sub" style="margin-top:8px">练习 ${S.study.sessionsCount} 次 · 最长一次 ${fmtDurCN(S.study.longestSessionMs||0)}</div>`:''}</div>`;}

/* ================= 声音 / 特效 ================= */
let AC=null;
function beep(type){if(!S.sound)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const ns=type==='ok'?[523,659,784]:type==='win'?[523,659,784,1047,1319]:[392,349];const t0=AC.currentTime;
 ns.forEach((f,i)=>{const o=AC.createOscillator(),g=AC.createGain();o.type='triangle';o.frequency.value=f;const t=t0+i*.09;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.18,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.28);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+.3);});}catch(e){}}
function confetti(n){n=n||40;const cs=['#ff7a59','#ffc83d','#4ade80','#4fc3ff','#9b83ff','#ff6fb5'];
 for(let i=0;i<n;i++){const c=document.createElement('div');c.className='cf';c.style.left=Math.random()*100+'vw';c.style.background=pick(cs);
  c.style.setProperty('--dx',(Math.random()*160-80)+'px');c.style.setProperty('--rot',(Math.random()*900-450)+'deg');c.style.setProperty('--t',(1.2+Math.random()*1.3)+'s');
  c.style.animationDelay=Math.random()*.3+'s';if(Math.random()<.4)c.style.borderRadius='50%';document.body.appendChild(c);setTimeout(()=>c.remove(),3000);}}
function floatTxt(t){const d=document.createElement('div');d.className='xpf';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),1300);}
function toast(t,gold){const d=document.createElement('div');d.className='toast'+(gold?' gold':'');d.innerHTML=t;document.getElementById('toasts').appendChild(d);setTimeout(()=>d.remove(),3200);}
function addXP(n){const b=lvInfo(S.xp).L;S.xp+=n;const a=lvInfo(S.xp);if(a.L>b){setTimeout(()=>{toast(`🎉 升级啦！Lv.${a.L}「${a.title}」`,true);confetti(50);beep('win');},500);}}
function checkBadges(){const st=streak();const L=S.levels;const res=[];
 const stuy=S.study||DEF.study;
 const cond={first:S.checkins.length>0,s3:st>=3,s7:st>=7,pass1:Object.values(L).some(x=>x.passed),star3:Object.values(L).some(x=>x.stars>=3),combo5:S.maxCombo>=5,
  clear:S.wrong.some(w=>w.mastered)&&activeWrong().length===0,all:allPassed(),boss:S.boss.passed,xp500:S.xp>=500,q100:S.tot.ans>=100,
  allstar:ALL8.every(n=>L[n]&&L[n].stars>=3),t30:(stuy.totalMs||0)>=30*60*1000,t2h:(stuy.totalMs||0)>=2*60*60*1000,focus10:(stuy.longestSessionMs||0)>=10*60*1000};
 BADGES.forEach(b=>{if(cond[b.id]&&!S.badges[b.id]){S.badges[b.id]=today();res.push(b);}});
 res.forEach((b,i)=>setTimeout(()=>{toast(`${b.e} 获得新徽章：${b.n}！`,true);beep('win');},900+i*700));
 if(res.length)save();return res;}

/* ================= 吉祥物「小根」 ================= */
function mascot(m,s){s=s||64;const eyes=m==='happy'?'<path d="M30 46 q6 -8 12 0 M58 46 q6 -8 12 0" stroke="#4a2c00" stroke-width="4" fill="none" stroke-linecap="round"/>'
 :'<circle cx="36" cy="45" r="5.5" fill="#4a2c00"/><circle cx="64" cy="45" r="5.5" fill="#4a2c00"/><circle cx="38" cy="43" r="2" fill="#fff"/><circle cx="66" cy="43" r="2" fill="#fff"/>';
 const mouth=m==='think'?'<path d="M43 62 q7 4 14 0" stroke="#4a2c00" stroke-width="4" fill="none" stroke-linecap="round"/>':'<path d="M40 58 q10 12 20 0" stroke="#4a2c00" stroke-width="4" fill="#ff7a7a" stroke-linecap="round"/>';
 return `<svg class="mascot" width="${s}" height="${s}" viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="50" cy="95" rx="26" ry="4" fill="rgba(0,0,0,.15)"/>
 <path d="M50 10 C80 10 92 34 92 58 C92 82 74 92 50 92 C26 92 8 82 8 58 C8 34 20 10 50 10Z" fill="#ffc94a" stroke="#e8a21a" stroke-width="3"/>
 <path d="M50 10 C58 2 66 2 70 6" stroke="#e8a21a" stroke-width="4" fill="none" stroke-linecap="round"/>${eyes}
 <circle cx="25" cy="58" r="6" fill="#ff9a9a" opacity=".7"/><circle cx="75" cy="58" r="6" fill="#ff9a9a" opacity=".7"/>${mouth}
 <path d="M32 76 l5 -2.5 l6 10 l9 -20 h16" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
 ${m==='think'?'<path d="M84 26 q4 8 0 11 q-4 -3 0 -11z" fill="#7cc7ff"/>':''}</svg>`;}

/* ================= 出题 ================= */
function genFrom(lv,used){const gens=G[lv];let q;for(let t=0;t<30;t++){q=pick(gens)();if(!used.has(q.id))break;}used.add(q.id);q.kp=lv;return q;}
function genLevel(lv,n){const used=new Set();const order=shuffle(G[lv].map((_,i)=>i));const out=[];
 for(let i=0;i<n;i++){let q=null;if(i<order.length){for(let t=0;t<20;t++){const x=G[lv][order[i]]();if(!used.has(x.id)){q=x;break;}}}
  if(!q)q=genFrom(lv,used);else used.add(q.id);q.kp=lv;out.push({q});}
 return out;}
function genBoss(){const used=new Set();const out=[];for(let lv=1;lv<=8;lv++)out.push({q:genFrom(lv,used)});out.push({q:genFrom(rnd(4,8),used)});out.push({q:genFrom(rnd(4,8),used)});return out;}

/* ================= 会话 ================= */
let sess=null,lastRes=null,view='home',calOff=0,pendingSess=null,impUI={step:'list',topics:{},note:'',preview:null,thumb:null,viewId:null};
function startSession(mode,lv,opts){opts=opts||{};
 if(mode==='review'&&!dueWrong().length){toast('现在没有需要复习的题啦 🎉');return;}
 const needLesson=(mode==='level'||mode==='boss')&&!opts.skipLesson;
 const lid=mode==='boss'?'boss':String(lv);
 if(needLesson&&!S.lessonSeen[lid]){pendingSess={mode,lv};closeModal();go('lesson');return;}
 beginQuiz(mode,lv);}
function beginQuiz(mode,lv){let qs;
 S.sessionNo++;save();
 if(mode==='level')qs=genLevel(lv,5);
 else if(mode==='boss')qs=genBoss();
 else if(mode==='review')qs=shuffle(dueWrong()).slice(0,10).map(w=>({q:w.q,sr:w.id}));
 else{const due=shuffle(dueWrong()).slice(0,3).map(w=>({q:w.q,sr:w.id}));const L=curLevel()||rnd(1,8);const used=new Set(due.map(d=>d.q.id));
  const fresh=genLevel(L,5).filter(x=>!used.has(x.q.id));qs=due.concat(fresh).slice(0,5);while(qs.length<5)qs.push({q:genFrom(rnd(1,8),used)});}
 sess={mode,lv,qs,i:0,correct:0,combo:0,usedHint:false,xp:0,locked:false,hint:false,choice:-1};pendingSess=null;closeModal();startStudyTimer();go('quiz');}
function cur(){const it=sess.qs[sess.i];if(it&&it.startStudyMs===undefined)it.startStudyMs=studyClock.sessionMs;return it;}
function pickOpt(j){if(!sess||sess.locked)return;sess.choice=j;judge(j===cur().q.answer);}
function normNum(s){s=String(s).trim().replace(/[０-９]/g,c=>String.fromCharCode(c.charCodeAt(0)-65248)).replace(/[．。]/g,'.').replace(/[−－—]/g,'-').replace(/\s/g,'');
 if(/^-?\d+\/\d+$/.test(s)){const p=s.split('/');return Number(p[0])/Number(p[1]);}if(!/^-?(\d+\.?\d*|\.\d+)$/.test(s))return NaN;return Number(s);}
function submitFill(){if(!sess||sess.locked)return;const el=document.getElementById('fin');const v=normNum(el.value);
 if(isNaN(v)){el.classList.remove('bad');void el.offsetWidth;el.classList.add('bad');toast('请输入一个数字哦～');return;}
 sess.fillVal=el.value;judge(Math.abs(v-cur().q.answer)<1e-9);}
function addWrong(q,meta){meta=meta||{};const t=today();const skill=classifyQuestion(q);const ex=S.wrong.find(w=>w.qid===q.id&&!w.mastered);
 if(ex){ex.streak=0;ex.due=t;ex.after=Math.min(ex.after||0,S.sessionNo);ex.miss=(ex.miss||1)+1;ex.skillId=skill.id;ex.skillLabel=skill.label;if(meta.fromSheet)ex.fromSheet=true;return;}
 S.wrong.push({id:'w'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),qid:q.id,q,kp:q.kp,skillId:skill.id,skillLabel:skill.label,streak:0,due:t,after:S.sessionNo,mastered:false,added:t,miss:1,fromSheet:!!meta.fromSheet});}
function judge(ok){
 const it=cur(),q=it.q;
 // Measure active study time, excluding time spent with the page in the background.
 studyAccrue(Date.now());
 // A retry is another attempt at the same learning item, not a second new question.
 const isRetry=it.retryStage===1;
 const elapsed=Math.max(0,studyClock.sessionMs-(isRetry?(it.retryStartStudyMs??studyClock.sessionMs):(it.startStudyMs??studyClock.sessionMs)));
 sess.locked=true;sess.last=ok;it.res=ok?1:0;if(!isRetry)it.firstRes=ok?1:0;
 if(!isRetry){
  S.tot.ans++;
  const k=S.kp[q.kp]||(S.kp[q.kp]=[]);k.push(ok?1:0);if(k.length>10)k.shift();
  let gain=2;
  if(ok){S.tot.cor++;sess.correct++;sess.combo++;S.maxCombo=Math.max(S.maxCombo,sess.combo);gain=10+Math.min(sess.combo-1,5)*2;}
  else sess.combo=0;
  sess.xp+=gain;addXP(gain);
  if(it.sr){const w=S.wrong.find(x=>x.id===it.sr);if(w){if(ok){w.streak++;if(w.streak>=3){w.mastered=true;w.mdate=today();it.mastered=true;}else{w.due=addDays(today(),w.streak===1?1:3);w.after=0;}}
    else{w.streak=0;w.due=today();w.after=S.sessionNo+1;w.miss=(w.miss||1)+1;}}}
  else if(!ok)addWrong(q);
  save();checkBadges();render();
  if(ok){confetti(sess.combo>=3?55:32);floatTxt(`+${gain} XP`);beep('ok');}else{document.querySelectorAll('.cf').forEach(c=>c.remove());beep('no');}
 }else{
  // Retry feedback does not double-count stats, XP, combo, or wrong-book entries.
  if(it.attemptLog){it.attemptLog.retryCorrect=!!ok;it.attemptLog.retryTimeMs=elapsed;}
  save();if(ok){beep('ok');}else{beep('no');}
 }
 if(!isRetry){
  it.firstTimeMs=elapsed;
  const skill=classifyQuestion(q);it.skillId=skill.id;it.skillLabel=skill.label;it.attemptLog={date:today(),questionId:q.id,kp:q.kp,skillId:skill.id,skillLabel:skill.label,questionType:q.type,mode:sess.mode,variant:!!it.isVariant,firstCorrect:!!ok,hintUsed:!!it.hintUsed,firstTimeMs:elapsed,timestamp:Date.now()};
  S.attempts.push(it.attemptLog);if(S.attempts.length>500)S.attempts.splice(0,S.attempts.length-500);
  save();
 }
 showSheet(ok,it);
}
const PRAISE=['太棒了！','完全正确！','你真厉害！','漂亮！','稳稳的！','聪明！','就是这样！'];
const COMFORT=['差一点点，没关系！','错了也是在进步哦～','别担心，我们一起看看！','这题有个小陷阱～'];
function ansHtml(q){return q.type==='mc'?q.options[q.answer]:String(q.answer);}
function stepsHtml(q){return `<div class="steps"><b>📖 讲解</b><ol>${q.steps.map(s=>`<li>${s}</li>`).join('')}</ol></div>`;}
function showSheet(ok,it){const q=it.q;const sh=document.getElementById('sheet');const inn=sh.querySelector('.in');
 let extra='';if(it.sr&&ok)extra=it.mastered?'<div class="pill g">🎉 这道错题已经掌握啦！</div>':'<div class="pill g">复习进度 +1，再对几次就掌握啦</div>';
 if(!ok)extra='<div class="pill o">已放进错题本，过几天再来挑战它 📒</div>';
 const retryButton=!ok&&it.retryStage!==1;
 inn.className='in '+(ok?'ok':'no');
 inn.innerHTML=`<div class="fbh">${mascot(ok?'happy':'think',58)}<div><div class="t">${ok?pick(PRAISE):pick(COMFORT)}</div>
 <div class="sub">${ok?(sess.combo>=2?`连击 ×${sess.combo}！继续保持 🔥`:'继续加油！'):(retryButton?'先看懂讲解，再把这道题独立做出来。':'没关系，再看一遍讲解，我们再试一次。')}</div></div></div>
 ${ok?'':`<div class="ansline">💡 ${q.hint}</div><div class="ansline">正确答案：${ansHtml(q)}</div>`}
 ${ok?`<details style="margin-top:10px"><summary class="sub" style="font-weight:700">看看讲解 ▸</summary>${stepsHtml(q)}</details>`:stepsHtml(q)}
 ${extra}<button class="btn ${ok?'ok':'pri'} block" id="nextBtn" style="margin-top:14px" onclick="${retryButton?'retryOriginal()':'nextQ()'}">${retryButton?'我明白了，重做原题 ↻':(sess.i+1>=sess.qs.length?'看看成绩 🏁':(ok?'下一题 →':'继续下一步 →'))}</button>`;
 inn.scrollTop=0;sh.classList.add('show');}
function hideSheet(){document.getElementById('sheet').classList.remove('show');}
function retryOriginal(){if(!sess)return;const it=cur();it.retryStage=1;it.retryStartStudyMs=studyClock.sessionMs;hideSheet();sess.locked=false;sess.hint=false;sess.choice=-1;sess.fillVal='';render();window.scrollTo(0,0);}
function nextQ(){if(!sess)return;hideSheet();const it=cur();if(shouldAddVariant(it,S.attempts)&&!it.variantAdded){it.variantAdded=true;const lv=it.q.kp;const gens=G[lv];if(gens&&gens.length){let q2=null;for(let n=0;n<12;n++){const candidate=pick(gens)();candidate.kp=lv;if(candidate.id!==it.q.id&&!sess.qs.some(x=>x.q.id===candidate.id)){q2=candidate;break;}}if(q2)sess.qs.splice(sess.i+1,0,{q:q2,isVariant:true});}}
 sess.i++;sess.locked=false;sess.hint=false;sess.choice=-1;if(sess.i>=sess.qs.length)finish();else{render();window.scrollTo(0,0);}}
function useHint(){sess.hint=true;sess.usedHint=true;cur().hintUsed=true;render();}
function quitQuiz(){modal(`<div class="center">${mascot('normal',70)}<h2>要先休息一下吗？</h2><p class="sub">已经答过的题会记录下来，但这一轮不算完成哦。</p></div>
 <div class="stack"><button class="btn pur block" onclick="closeModal()">继续答题 💪</button><button class="btn ghost block" onclick="closeModal();hideSheet();stopStudyTimer();sess=null;go('home')">先休息一下</button></div>`);}
function finish(){const s=sess;const score=officialQuizScore(s.qs);const tot=score.tot,c=score.c;const r={mode:s.mode,lv:s.lv,c,tot,xp:s.xp,stars:0,pass:false};
 if(s.mode==='level'||s.mode==='boss'){const need=s.mode==='boss'?8:4;r.pass=c>=need;r.need=need;
  if(r.pass)r.stars=2+(c===tot?1:0);
  if(s.mode==='level'){const L=S.levels[s.lv]||{stars:0,best:0,passed:false,plays:0};r.first=!L.passed&&r.pass;L.plays++;L.best=Math.max(L.best,c);
   if(r.pass){L.passed=true;L.stars=Math.max(L.stars,r.stars);}S.levels[s.lv]=L;}
  else{r.first=!S.boss.passed&&r.pass;S.boss.best=Math.max(S.boss.best||0,c);if(r.pass){S.boss.passed=true;S.boss.stars=Math.max(S.boss.stars||0,r.stars);}}
  if(r.pass){const b=30+r.stars*10+(s.mode==='boss'?100:0);addXP(b);r.xp+=b;}}
 if(s.mode==='daily'){const t=today();if(!S.checkins.includes(t)){S.checkins.push(t);r.checkin=true;addXP(30);r.xp+=30;}}
 r.mastered=s.qs.filter(x=>x.mastered).length;
 r.studyMs=studyClock.sessionMs;stopStudyTimer();save();checkBadges();lastRes=r;sess=null;go('result');
 if(r.pass||r.checkin){confetti(90);beep('win');}}

/* ================= 视图 ================= */
function go(v){view=v;render();window.scrollTo(0,0);}
function render(){const app=document.getElementById('app');if(view==='quiz'&&!sess)view='home';if(view==='lesson'&&!pendingSess&&!(sess&&sess.showLesson))view='home';
 const V={home:vHome,map:vMap,wrong:vWrong,badge:vBadge,quiz:vQuiz,result:vResult,import:vImport,lesson:vLesson}[view]||vHome;app.innerHTML=V();
 const nav=document.getElementById('nav');const hideNav=view==='quiz'||view==='result'||view==='lesson';nav.style.display=hideNav?'none':'';app.classList.toggle('noNav',hideNav);
 nav.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.v===view||(view==='import'&&b.dataset.v==='home')));}
function stars3(n){return [1,2,3].map(i=>`<span class="${i<=n?'':'star-off'}">⭐</span>`).join('');}
function topBar(){const L=lvInfo(S.xp);return `<div class="top"><div class="lvchip"><span class="lvnum">Lv.${L.L}</span><div style="flex:1;min-width:0"><div class="lvt">${L.title} · ${L.cur}/${L.need} XP</div><div class="xpbar"><i style="width:${Math.round(L.cur/L.need*100)}%"></i></div></div></div>
 <div class="fire" title="连续打卡天数">🔥 ${streak()}</div><button class="iconbtn" onclick="openSettings()" aria-label="设置">⚙️</button></div>`;}
function greet(){const st=streak(),done=S.checkins.includes(today());if(done)return '今天已经打卡啦！你真棒～想多练一组也可以哦 ✨';
 if(st>0)return `已经连续 ${st} 天啦！今天也来点燃火苗吧 🔥`;if(S.tot.ans===0)return '嗨！我是小根～每天 5 道题，我们一起慢慢变强！';return '欢迎回来！今天只要 5 道题，5 分钟就能搞定～';}
function vHome(){const done=S.checkins.includes(today());const due=dueWrong().length;const cl=curLevel();const nrev=Math.min(due,3);const np=ALL8.filter(lvPassed).length;
 return `${topBar()}<div class="hero">${mascot('happy',78)}<div class="bub">${greet()}</div></div>
 ${studyCardHtml()}
 <div class="card daily"><div class="row"><div class="sp"><div class="sub">每日打卡</div><div class="big">${done?'今日任务已完成 ✅':'今日任务：5 道题'}</div></div><div style="font-size:42px">${done?'🏅':'🎯'}</div></div>
 <div style="margin:8px 0 12px">${nrev?`<span class="pill o">🔁 复习错题 ${nrev} 题</span>`:''}<span class="pill">✨ 新题 ${5-nrev} 题</span><span class="pill g">⏱️ 约 5 分钟</span></div>
 <button class="btn ${done?'pur':'pri'} block" id="dailyBtn" onclick="startSession('daily')">${done?'再练一组 💪':'开始今日挑战 🚀'}</button></div>
 <div class="card"><div class="row"><div class="sp"><div class="sub">闯关进度</div><div style="font-size:18px;font-weight:900">${cl?`第 ${cl} 关 · ${LV[cl-1].name}`:(S.boss.passed?'全部通关！Boss 已击败 👑':'Boss 关已解锁！👹')}</div></div>
 <div style="font-size:15px;font-weight:800;color:var(--pur)">${np}/8</div></div>
 <div class="prog" style="margin:10px 0 12px"><i style="width:${np/8*100}%"></i></div>
 <button class="btn gold block" onclick="openLevel(${cl||9})">${cl?'继续闯关 ⚔️':'挑战 Boss 👹'}</button></div>
 <div class="card impcard" id="importCard" onclick="openImport()" style="cursor:pointer"><div class="row"><div style="font-size:40px">📷</div><div class="sp"><div class="big" style="font-size:20px;font-weight:900">导入试卷</div><div class="sub">拍一张作业 / 从相册选图，小根帮你对照知识点练</div></div><div style="font-size:22px">›</div></div>${(S.sheets&&S.sheets.length)?`<div class="sub" style="margin-top:8px">已保存 ${S.sheets.length} 份试卷</div>`:''}</div>
 ${due?`<div class="card row" onclick="go('wrong')" style="cursor:pointer"><div style="font-size:34px">📒</div><div class="sp"><b>有 ${due} 道错题等你复习</b><div class="sub">复习对 3 次就算掌握啦</div></div><div style="font-size:22px">›</div></div>`:''}
 <div class="card">${calHtml()}</div>`;}
function calHtml(){const now=new Date();const first=new Date(now.getFullYear(),now.getMonth()+calOff,1);const y=first.getFullYear(),m=first.getMonth();
 const days=new Date(y,m+1,0).getDate(),w0=first.getDay();const set=new Set(S.checkins),t=today();let cells='日一二三四五六'.split('').map(x=>`<div class="cw">${x}</div>`).join('');let cnt=0;
 for(let i=0;i<w0;i++)cells+='<div class="cd e"></div>';
 for(let d=1;d<=days;d++){const k=ds(new Date(y,m,d));const on=set.has(k);if(on)cnt++;cells+=`<div class="cd ${on?'on':''} ${k===t?'td':''}">${on?'<span class="fl">🔥</span>':''}<span class="dn">${d}</span></div>`;}
 return `<div class="calh"><button onclick="calOff--;render()" aria-label="上个月">‹</button><div class="center"><b style="font-size:17px">📅 ${y}年${m+1}月 打卡日历</b><div class="sub">本月打卡 ${cnt} 天 · 连胜 🔥${streak()} 天</div></div><button onclick="calOff++;render()" aria-label="下个月">›</button></div><div class="cal">${cells}</div>`;}
function vMap(){const xs=[50,74,76,56,30,22,36,62,50];const gap=150,top0=70;let nodes='';const pts=[];const cl=curLevel();
 for(let n=1;n<=9;n++){const isB=n===9;const y=top0+(n-1)*gap+(isB?14:0);const x=xs[n-1];pts.push(`${x},${y}`);
  const unlocked=isB?allPassed():lvUnlocked(n);const passed=isB?S.boss.passed:lvPassed(n);const st=isB?(S.boss.stars||0):(S.levels[n]?S.levels[n].stars:0);
  const info=isB?BOSS:LV[n-1];const isCur=isB?(unlocked&&!passed):n===cl;
  nodes+=`<button class="node ${isB?'boss':''} ${unlocked?(passed?'passed':''):'locked'} ${isCur?'cur':''}" style="left:${x}%;top:${y}px" onclick="openLevel(${n})" aria-label="${info.name}">
  ${isCur?'<div class="cur-flag">⬇️</div>':''}<div class="c">${unlocked?(isB?'👹':n):'🔒'}</div><div class="lb">${isB?'Boss 关':n+'. '+info.short}</div>
  <div class="st">${unlocked?stars3(st):''}</div></button>`;}
 const H=top0+8*gap+110;
 return `${topBar()}<div class="ptitle">🗺️ 二次根式大冒险</div><div class="sub" style="color:#fff;margin:2px 4px 0">每关 5 题，答对 4 题就过关！全部通关解锁 Boss</div>
 <div class="map" style="height:${H}px"><svg class="path" viewBox="0 0 100 ${H}" preserveAspectRatio="none"><polyline points="${pts.join(' ')}" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="7" stroke-dasharray="2 14" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>${nodes}</div>`;}
function openLevel(n){const isB=n===9;const unlocked=isB?allPassed():lvUnlocked(n);
 if(!unlocked){toast(isB?'通过全部 8 关就能挑战 Boss 哦 🔒':`先通过第 ${n-1} 关就能解锁啦 🔒`);return;}
 const info=isB?BOSS:LV[n-1];const L=isB?S.boss:S.levels[n];const st=L?(L.stars||0):0;
 modal(`<div class="center"><div style="font-size:52px">${info.icon}</div><h2>${isB?'':'第 '+n+' 关 · '}${info.name}</h2><div style="font-size:22px">${stars3(st)}</div></div>
 <div class="hintb"><b>📝 闯关小贴士</b><br>${info.tip}</div>
 <div class="sub" style="margin-top:10px;line-height:1.7">${isB?'共 10 题，答对 8 题击败 Boss。':'共 5 题，答对 4 题过关。'}<br>⭐ 过关 · 全对 +1⭐ · 不用提示 +1⭐</div>
 <div class="stack"><button class="btn pri block" id="startBtn" onclick="startSession('${isB?'boss':'level'}',${n})">${isB?'挑战 Boss 👹':'开始闯关 ⚔️'}</button><button class="btn ghost block" onclick="closeModal()">再看看</button></div>`);}
function vQuiz(){const it=cur(),q=it.q;const info=LV[q.kp-1];
 const dots=sess.qs.map((x,j)=>{const res=x.firstRes!==undefined?x.firstRes:x.res;return `<span class="dot ${res===1?'g':res===0?'o':''} ${j===sess.i?'cur':''}" title="${x.isVariant?'变式练习':(res===1?'首次答对':res===0?'首次答错':'未作答')}"></span>`;}).join('');
 const title=sess.mode==='daily'?'🎯 每日打卡':sess.mode==='boss'?'👹 Boss 关':sess.mode==='review'?'🔁 错题复习':`第 ${sess.lv} 关`;
 let body;
 if(q.type==='mc'){body=`<div class="opts">${q.options.map((o,j)=>{const c=sess.locked?(j===q.answer?'right':(j===sess.choice?'wrongc':'dim')):'';
  return `<button class="opt ${c}" ${sess.locked?'disabled':''} onclick="pickOpt(${j})"><span class="ol">${'ABCD'[j]}</span><span class="ot">${o}</span></button>`;}).join('')}</div>`;}
 else{body=`<div class="card" style="padding:14px"><div class="sub" style="margin:0 0 8px">✍️ 填一个数（可以写小数）</div><div class="fill"><input id="fin" type="text" inputmode="decimal" autocomplete="off" placeholder="?" ${sess.locked?'disabled':''} value="${sess.locked?String(sess.fillVal).replace(/["<>&]/g,''):''}" onkeydown="if(event.key==='Enter')submitFill()">
  <button class="btn pri" style="min-width:96px" onclick="submitFill()" ${sess.locked?'disabled':''}>确定</button></div></div>`;}
 return `<div class="qtop"><button class="iconbtn" onclick="quitQuiz()" aria-label="退出">✕</button><div class="dots">${dots}</div><div class="live-timer ${studyClock.paused?'pause':''}" id="liveTimer" title="本局学习计时"><span class="dot"></span><span class="tval">${fmtDur(studyClock.sessionMs)}</span></div></div>
 <div class="row" style="color:#fff;font-weight:800;margin:10px 4px 0"><div class="sp">${title}</div>${sess.combo>=2?`<div class="combo ${sess.locked&&sess.last?'pop':''}">⚡×${sess.combo}</div>`:`<div style="opacity:.9">${sess.i+1}/${sess.qs.length}</div>`}</div>
 <div class="card qcard"><span class="qtag">${info.icon} ${info.name}</span>${it.sr?'<span class="qtag rev">🔁 错题复习</span>':''}
 <div class="stem">${q.stem}</div>${sess.hint?`<div class="hintb">💡 ${q.hint}</div>`:''}</div>
 ${body}
 <div class="qbar" style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap">${!sess.locked&&!sess.hint?`<button class="btn ghost" style="flex:1;background:rgba(255,255,255,.85)" onclick="useHint()">💡 给我一点提示</button>`:''}${(sess.mode==='level'||sess.mode==='boss')?`<button class="btn ghost" style="flex:1;background:rgba(255,255,255,.85)" onclick="reopenLesson()">📖 再看一遍公式</button>`:''}</div>`;}
function vResult(){const r=lastRes;if(!r)return vHome();let head,body='';
 const xpL=`<div class="pill" style="font-size:16px">+${r.xp} XP</div>${r.studyMs?`<div class="pill g" style="font-size:16px">⏱️ 本局 ${fmtDur(r.studyMs)}</div>`:''}`;
 if(r.mode==='level'||r.mode==='boss'){
  if(r.pass){head=`${mascot('happy',90)}<h2 style="font-size:26px">${r.mode==='boss'?'Boss 被你打败啦！👑':'闯关成功！'}</h2><div class="bigstars">${stars3(r.stars)}</div>`;
   body=`<div class="score">${r.c} / ${r.tot}</div>${xpL}${r.first&&r.mode==='level'&&r.lv<8?`<p><b>🔓 第 ${r.lv+1} 关已解锁！</b></p>`:''}${r.first&&r.mode==='level'&&r.lv===8?'<p><b>🔓 Boss 关已解锁！</b></p>':''}${r.stars<3?`<p class="sub">把还不熟的题再练一练，就有机会拿到 3 星 ⭐</p>`:''}`;}
  else{head=`${mascot('normal',90)}<h2 style="font-size:24px">就差一点点！</h2>`;body=`<div class="score">${r.c} / ${r.tot}</div><p>答对 ${r.need} 题就能过关。错的题已经放进错题本，看过讲解再来一次，一定行！💪</p>${xpL}`;}}
 else if(r.mode==='daily'){head=`${mascot('happy',90)}<h2 style="font-size:26px">${r.checkin?'今日打卡成功！':'加练完成！'}</h2><div style="font-size:50px">🔥 ${streak()}</div><div class="sub">连续打卡天数</div>`;
  body=`<div class="score" style="margin-top:8px">${r.c} / ${r.tot}</div>${xpL}${r.mastered?`<p>🎉 有 ${r.mastered} 道错题被你彻底掌握！</p>`:''}<p class="sub">明天再来，火苗会越来越旺哦～</p>`;}
 else{head=`${mascot('happy',90)}<h2>复习完成！</h2>`;body=`<div class="score">${r.c} / ${r.tot}</div>${xpL}${r.mastered?`<p>🎉 ${r.mastered} 道错题已掌握！</p>`:'<p>每道错题连续答对 3 次就掌握啦～</p>'}`;}
 let btns='';
 if(r.mode==='level'){if(r.pass&&r.lv<8)btns+=`<button class="btn pri block" onclick="openLevel(${r.lv+1})">下一关 →</button>`;if(r.pass&&r.lv===8)btns+=`<button class="btn pri block" onclick="openLevel(9)">挑战 Boss 👹</button>`;
  btns+=`<button class="btn ${r.pass?'pur':'pri'} block" onclick="startSession('level',${r.lv})">再来一次 🔄</button><button class="btn ghost block" onclick="go('map')">返回地图 🗺️</button>`;}
 else if(r.mode==='boss')btns=`<button class="btn pri block" onclick="startSession('boss',9)">再战 Boss 🔄</button><button class="btn ghost block" onclick="go('map')">返回地图 🗺️</button>`;
 else btns=`<button class="btn pri block" onclick="go('home')">回到首页 🏠</button><button class="btn ghost block" onclick="go('wrong')">去错题本 📒</button>`;
 return `<div class="card res" style="margin-top:30px">${head}${body}<div class="stack">${btns}</div></div>`;}
function dueTxt(w){const t=today();if(w.due<=t)return w.after>S.sessionNo?'下一轮练习复习':'今天可复习';if(w.due===addDays(t,1))return '明天复习';const p=w.due.split('-');return `${+p[1]}月${+p[2]}日复习`;}
function vWrong(){const act=activeWrong(),due=dueWrong(),mas=S.wrong.filter(w=>w.mastered).length;
 const recommendation=recommendSkill(LV.map((_,i)=>S.kp[i+1]||[]));
 const subskillRecommendation=recommendSubskill(S.attempts);
 const subskillCard=subskillRecommendation
  ? `<div class="card"><h2>🔎 具体技能诊断</h2><div style="font-weight:900;font-size:16px">${subskillRecommendation.label}</div><div class="sub" style="margin:7px 0;line-height:1.6">已有 ${subskillRecommendation.total} 次首答记录，正确率 ${subskillRecommendation.percent}%。建议先回到对应知识点练习，再用新题检查是否改善。</div><button class="btn sec block" onclick="startSession('level',${Number(subskillRecommendation.id.split('-')[0])})">练习对应知识点 →</button><div class="sub" style="margin-top:7px">这是根据题目文字的初步标签生成的建议；复杂题的精确步骤诊断仍需后续完善。</div></div>`
  : `<div class="card"><h2>🔎 具体技能诊断</h2><div class="sub" style="line-height:1.6">每个技能至少积累 3 次首答记录后，才会显示薄弱技能建议。目前还没有足够的同类题记录。</div></div>`;
 const recommendationCard= recommendation.level
  ? `<div class="card"><h2>🧭 下一步学什么？</h2><div style="font-weight:900;font-size:17px">${LV[recommendation.level-1].icon} ${LV[recommendation.level-1].name}</div><div class="sub" style="line-height:1.6;margin:7px 0">${recommendation.reason}。当前记录：${recommendation.count} 题，正确率 ${recommendation.percent}%。先把这一块练稳，再往后推进。</div><button class="btn pri block" onclick="startSession('level',${recommendation.level})">开始这组基础练习 →</button></div>`
  : `<div class="card"><h2>🧭 下一步学什么？</h2><div style="font-weight:900;font-size:17px">🎯 ${recommendation.reason}</div><div class="sub" style="margin-top:7px">可以挑战 Boss，或选一关做变式练习。</div><button class="btn pri block" onclick="startSession('boss')">挑战综合题 →</button></div>`;
 const kps=LV.map((l,i)=>{const a=S.kp[i+1]||[];const stat=skillSnapshot(a);const pct=stat.percent;const nw=act.filter(w=>w.kp===i+1).length;
  const status=stat.status;
  return `<div class="kp"><div class="row"><span>${l.icon} ${l.name}</span><span class="sp"></span><span class="sub">${a.length?`近${a.length}题 ${pct}% · ${status}`:'未练习'}${nw?` · 待复习 ${nw}`:''}</span></div><div class="prog" style="height:12px;margin-top:5px"><i style="width:${pct}%;${pct>=80?'background:linear-gradient(90deg,#4ade80,#22c55e)':''}"></i></div></div>`;}).join('');
 const items=act.slice().sort((a,b)=>a.due<b.due?-1:1).map(w=>`<details class="witem"><summary><div class="row" style="margin-bottom:4px"><span class="pill">${LV[w.kp-1].short}</span>${w.fromSheet?'<span class="pill o">来自试卷</span>':''}<span class="sp"></span><span class="sr">${[0,1,2].map(i=>`<i class="${i<w.streak?'f':''}"></i>`).join('')}</span><span class="sub" style="margin-left:6px">${dueTxt(w)}</span></div><div class="wst">${w.q.stem}</div><div class="sub">技能标签：${w.skillLabel||classifyQuestion(w.q).label} · 点开看答案和讲解 ▸</div></summary>
  <div class="ansline">正确答案：${ansHtml(w.q)}</div>${stepsHtml(w.q)}</details>`).join('');
 return `${topBar()}<div class="ptitle">📒 错题本</div>
 <div class="card"><div style="font-size:18px;font-weight:900">待复习 ${act.length} 题 · 已掌握 ${mas} 题</div><div class="sub" style="line-height:1.6">错题会在下一轮练习、1 天后、3 天后再出现，连续答对 3 次 <span class="sr"><i class="f"></i><i class="f"></i><i class="f"></i></span> 就算掌握</div>
 <button class="btn ${due.length?'pri':'ghost'} block" id="reviewBtn" style="margin-top:12px" onclick="startSession('review')" ${due.length?'':'disabled'}>${due.length?`开始复习（${Math.min(due.length,10)} 题）🔁`:(act.length?'暂时没有到期的错题，晚点再来 ⏰':'错题本空空的，真棒 🎉')}</button></div>
 ${recommendationCard}
 ${subskillCard}
 <div class="card"><h2>📊 掌握进度</h2><div class="sub" style="margin-bottom:4px">按每个知识点最近 10 次答题计算；推荐路径按前置知识顺序判断</div>${kps}</div>
 ${act.length?`<div class="card"><h2>📝 错题列表</h2>${items}</div>`:''}`;}
function vBadge(){const L=lvInfo(S.xp);const acc=S.tot.ans?Math.round(S.tot.cor/S.tot.ans*100):0;const got=BADGES.filter(b=>S.badges[b.id]).length;
 return `${topBar()}<div class="ptitle">🏆 我的成就</div>
 <div class="card center">${mascot('happy',70)}<div style="font-size:22px;font-weight:900">Lv.${L.L} · ${L.title}</div><div class="prog" style="margin:10px 0 4px"><i style="width:${L.cur/L.need*100}%;background:linear-gradient(90deg,#ffe07a,#ffb02e)"></i></div><div class="sub">还差 ${L.need-L.cur} XP 升到 Lv.${L.L+1}「${TITLES[Math.min(L.L,TITLES.length-1)]}」</div></div>
 <div class="card"><div class="stat"><div><b>${S.xp}</b>总 XP</div><div><b>🔥${streak()}</b>连续打卡</div><div><b>${S.tot.ans}</b>累计答题</div><div><b>${acc}%</b>正确率</div><div><b>⚡${S.maxCombo}</b>最高连击</div><div><b>${S.checkins.length}</b>打卡天数</div></div></div>
 <div class="card"><h2>🎖️ 徽章 ${got}/${BADGES.length}</h2><div class="bgrid">${BADGES.map(b=>`<div class="bdg ${S.badges[b.id]?'on':'off'}"><div class="e">${b.e}</div><div class="n">${b.n}</div><div class="d">${S.badges[b.id]?'✅ '+S.badges[b.id]:b.d}</div></div>`).join('')}</div></div>`;}
function modal(h){const m=document.getElementById('modal');m.querySelector('.box').innerHTML=h;m.classList.add('show');}
function closeModal(){document.getElementById('modal').classList.remove('show');}
document.getElementById('modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal();});
function openSettings(){modal(`<h2>⚙️ 设置</h2>
 <div class="row" style="margin:14px 0"><div class="sp"><b>🔊 音效</b><div class="sub">答对 / 答错时播放小音效</div></div><button class="switch ${S.sound?'on':''}" onclick="S.sound=!S.sound;save();this.classList.toggle('on');beep('ok')" aria-label="音效开关"></button></div>
 <div class="hintb" style="font-size:14px">进度只保存在这台设备的这个浏览器里（localStorage）。清除浏览器数据或换浏览器打开，进度会丢失。</div>
 <div class="stack"><button class="btn pur block" onclick="closeModal()">好的</button><button class="btn ghost block danger" id="resetBtn" style="font-size:15px" onclick="confirmReset()">重置全部进度…</button></div>`);}
function confirmReset(){modal(`<div class="center"><div style="font-size:50px">⚠️</div><h2>确定要重置吗？</h2><p class="sub">XP、星星、徽章、打卡记录、错题本都会被清空，而且<b>不能恢复</b>。</p></div>
 <div class="stack"><button class="btn ghost block" onclick="openSettings()">不了，返回</button><button class="btn block" id="resetYes" style="background:#e5484d;color:#fff;box-shadow:0 5px 0 #a8262b" onclick="doReset()">确定清空</button></div>`);}
function doReset(){stopStudyTimer();localStorage.removeItem(KEY);S=load();sess=null;pendingSess=null;closeModal();go('home');toast('进度已重置，重新出发吧！🌱');}

/* ================= 课前小课堂 ================= */
const LESSONS={
1:{title:'热身：开平方',icon:'🌱',say:'嗨！这一关超级简单，就像开礼物～完全平方数直接开就行！',
 formulasHtml:null,
 example:{q:`算一算：${R(36)} = ？`,steps:[`想：哪个正数 × 自己 = 36？`,`6 × 6 = 36`,`所以 ${R(36)} = 6（算术平方根是非负数）`]},
 kou:'完全平方数直接开。'},
2:{title:'有意义条件',icon:'🔑',say:'根号可娇气啦——里面不能是负数，分母也不能是零！',
 formulasHtml:`${R('a')} 有意义 ⇔ a ≥ 0<br>若有分母，还要 <b>分母 ≠ 0</b>`,
 example:{q:`要使 ${R('x − 3')} 有意义，x ？`,steps:[`被开方数 ≥ 0：x − 3 ≥ 0`,`移项：x ≥ 3`]},
 kou:'根号里不能负，分母不能零。'},
3:{title:'√(a²)=|a|',icon:'⚖️',say:'拿出字母前，先问问它是正还是负——结果其实是绝对值哦！',
 formulasHtml:`${R('a²')} = |a|<br>a ≥ 0 → 等于 a；a &lt; 0 → 等于 −a`,
 example:{q:`若 x &lt; 2，化简 ${R('(x − 2)²')}`,steps:[`${R('(x − 2)²')} = |x − 2|`,`因为 x &lt; 2，所以 x − 2 &lt; 0`,`|x − 2| = 2 − x`]},
 kou:'拿出字母先问正负，结果是绝对值。'},
4:{title:'化简二次根式',icon:'✂️',say:'把最大的完全平方因数"搬"出来，根号就会变瘦～',
 formulasHtml:`${R('a²b')} = |a|${R('b')}　（b ≥ 0）`,
 example:{q:`化简：${R(12)}`,steps:[`12 = 4 × 3，4 是完全平方数`,`${R(12)} = ${R(4)} × ${R(3)} = 2${R(3)}`]},
 kou:'拆出最大完全平方因数。'},
5:{title:'最简二次根式',icon:'💎',say:'"最简"就是根号里面干干净净：没有平方因数，也没有分母！',
 formulasHtml:`最简二次根式要同时满足：<br>① 被开方数<b>不含</b>能开得尽方的因数/因式<br>② 被开方数<b>不含分母</b>（也不能是小数）`,
 example:{q:`${R(18)} 是最简吗？`,steps:[`${R(18)} = ${R('9 × 2')} = 3${R(2)}`,`含完全平方因数 9，所以不是最简`,`最简形式是 3${R(2)}`]},
 kou:'里面干净、没有分母。'},
6:{title:'同类二次根式',icon:'👯',say:'先化成最简，再看根号里面是不是同一个数——一样就是同类！',
 formulasHtml:`最简后被开方数相同 ⇔ 同类二次根式<br>例：${R(12)}=2${R(3)} 与 ${R(27)}=3${R(3)} 是同类`,
 example:{q:`${R(8)} 与 ${R(18)} 是同类吗？`,steps:[`${R(8)} = 2${R(2)}，${R(18)} = 3${R(2)}`,`被开方数都是 2 → 是同类 ✓`]},
 kou:'化简完看里面一不一样。'},
7:{title:'二次根式加减',icon:'➕',say:'只有同类才能合并，就像合并同类项。乱加可不行哦！',
 formulasHtml:`同类：系数相加，根号不变<br>${R(2)} + ${R(3)} ≠ ${R(5)}　（不是同类！）`,
 example:{q:`计算：${R(8)} + ${R(18)}`,steps:[`${R(8)}=2${R(2)}，${R(18)}=3${R(2)}`,`2${R(2)} + 3${R(2)} = 5${R(2)}`]},
 kou:'同类才能加减，别乱合并。'},
8:{title:'乘除与分母有理化',icon:'🚀',say:'乘除好办：根号乘根号，被开方数相乘。分母有根号？两边同乘一个，分母就干净啦！',
 formulasHtml:`${R('a')} · ${R('b')} = ${R('ab')}　（a、b ≥ 0）<br>${F(1,R('a'))} = ${F(R('a'),'a')}`,
 example:{q:`分母有理化：${F(1,R(3))}`,steps:[`分子分母同乘 ${R(3)}`,`${F(1,R(3))} = ${F(R(3),R(3)+'·'+R(3))} = ${F(R(3),3)}`]},
 kou:'分子分母同乘根号，分母变干净。'},
boss:{title:'Boss 战前速记',icon:'👹',say:'大魔王来了！把八句口诀过一遍，就像带齐装备再出战～',
 formulasHtml:null,example:null,kou:null,isBoss:true}
};
// fix L1 formulasHtml
LESSONS[1].formulasHtml=`完全平方数直接开：${R(9)}=3，${R(36)}=6<br>${R('0.25')}=0.5　·　${R(F(1,4))}=${F(1,2)}`;
const KOU8=[
[1,'完全平方数直接开。'],[2,'根号里不能负，分母不能零。'],[3,'拿出字母先问正负，结果是绝对值。'],
[4,'拆出最大完全平方因数。'],[5,'里面干净、没有分母。'],[6,'化简完看里面一不一样。'],
[7,'同类才能加减，别乱合并。'],[8,'分子分母同乘根号，分母变干净。']];
function lessonId(mode,lv){return mode==='boss'?'boss':String(lv);}
function vLesson(){const ps=pendingSess||(sess&&sess.showLesson?{mode:sess.mode,lv:sess.lv,fromQuiz:true}:null);
 if(!ps)return vHome();const lid=lessonId(ps.mode,ps.lv);const L=LESSONS[lid]||LESSONS[1];const seen=!!S.lessonSeen[lid];
 let body='';
 if(L.isBoss){body=`<ul class="chklist">${KOU8.map(([n,k])=>`<li>${LV[n-1].icon} <b>第${n}关</b> · ${k}</li>`).join('')}</ul>`;}
 else{body=`<div class="formula">${L.formulasHtml}</div>
 <div class="ex"><div class="ttl">📝 例题：${L.example.q}</div><ol style="margin:6px 0;padding-left:22px;line-height:1.8">${L.example.steps.map(x=>`<li>${x}</li>`).join('')}</ol></div>
 <div class="kou">🗣️ 记住口诀：${L.kou}</div>`;}
 const goBtn=ps.fromQuiz
  ?`<button class="btn pri block" id="lessonGo" onclick="closeLessonReview()">回到题目 →</button>`
  :`<button class="btn pri block" id="lessonGo" onclick="finishLesson(false)">学会了，开始闯关！⚔️</button>${seen?`<button class="btn ghost block" id="lessonSkip" onclick="finishLesson(true)">跳过小课堂，直接答题</button>`:''}`;
 return `<div class="qtop"><button class="iconbtn" onclick="cancelLesson()" aria-label="返回">←</button><div class="sp" style="text-align:center;font-weight:900;font-size:18px">📖 课前小课堂</div><div style="width:46px"></div></div>
 <div class="card lesson" style="margin-top:12px"><div class="row">${mascot('happy',64)}<div class="sp"><div style="font-size:20px;font-weight:900">${L.icon} ${L.title}</div><div class="sub" style="margin-top:4px;line-height:1.5">${L.say}</div></div></div>
 ${body}</div><div class="stack" style="margin:14px 4px">${goBtn}</div>`;}
function finishLesson(skipOnly){if(!pendingSess)return;const lid=lessonId(pendingSess.mode,pendingSess.lv);
 if(!skipOnly||!S.lessonSeen[lid]){S.lessonSeen[lid]=true;save();}
 const {mode,lv}=pendingSess;beginQuiz(mode,lv);}
function cancelLesson(){if(sess&&sess.showLesson){sess.showLesson=false;go('quiz');resumeStudyTimer();return;}pendingSess=null;go('map');}
function reopenLesson(){if(!sess)return;pauseStudyTimer();sess.showLesson=true;pendingSess={mode:sess.mode,lv:sess.lv,fromQuiz:true};go('lesson');}
function closeLessonReview(){if(sess)sess.showLesson=false;pendingSess=null;go('quiz');resumeStudyTimer();}

/* ================= 导入试卷 ================= */
const SHEET_PRE=[2,3,4,5,6,7,8]; // 对照作业预勾选
function openImport(){impUI={step:'list',topics:{},note:'',preview:null,thumb:null,viewId:null};go('import');}
function vImport(){if(impUI.step==='scan')return vImpScan();if(impUI.step==='result')return vImpResult();if(impUI.step==='detail')return vImpDetail();return vImpList();}
function vImpList(){const list=(S.sheets||[]).slice().reverse();
 return `${topBar()}<div class="ptitle">📷 导入试卷</div>
 <div class="card"><div class="row">${mascot('happy',60)}<div class="sp"><b>把作业拍给我看看～</b><div class="sub">小根会对照二次根式知识点，帮你挑出要练的关卡</div></div></div>
 <div class="stack" style="margin-top:14px">
  <label class="btn pri block filebtn" id="pickCam">📸 拍照<input type="file" accept="image/*" capture="environment" onchange="onSheetFile(event)"></label>
  <label class="btn pur block filebtn" id="pickLib">🖼️ 从相册选择<input type="file" accept="image/*" onchange="onSheetFile(event)"></label>
 </div>
 <p class="sub" style="margin-top:10px;line-height:1.5">提示：本机不会真正 OCR，小根会按「二次根式」作业帮你勾好常见知识点，你再确认哪些不会 / 做错啦。</p></div>
 <div class="card"><h2>📁 我的试卷 ${list.length?`(${list.length})`:''}</h2>
 ${list.length?list.map(sh=>`<button class="sheet-item" onclick="viewSheet('${sh.id}')"><img class="sheet-thumb" src="${sh.thumb||sh.data}" alt=""><div class="sp"><b>${sh.date}</b><div class="sub">${(sh.topics||[]).map(t=>LV[t-1]?LV[t-1].short:'').filter(Boolean).join(' · ')||'未标记知识点'}</div>${sh.note?`<div class="sub" style="margin-top:2px">📝 ${esc(sh.note).slice(0,40)}</div>`:''}</div></button>`).join(''):'<div class="sub">还没有导入过试卷，拍一张试试吧～</div>'}
 </div>
 <button class="btn ghost block" onclick="go('home')">← 返回首页</button>`;}
function esc(t){return String(t||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function onSheetFile(ev){const f=ev.target.files&&ev.target.files[0];if(!f)return;if(!f.type.startsWith('image/')){toast('请选择图片哦');return;}
 const rd=new FileReader();rd.onload=()=>compressSheet(rd.result);rd.readAsDataURL(f);ev.target.value='';}
function compressSheet(dataUrl){const img=new Image();img.onload=()=>{const max=900;let w=img.width,h=img.height;if(w>max){h=Math.round(h*max/w);w=max;}
  const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h);
  const full=c.toDataURL('image/jpeg',0.72);const tw=180,th=Math.round(h*tw/w);const c2=document.createElement('canvas');c2.width=tw;c2.height=th;c2.getContext('2d').drawImage(img,0,0,tw,th);
  impUI.preview=full;impUI.thumb=c2.toDataURL('image/jpeg',0.6);impUI.note='';impUI.topics={};SHEET_PRE.forEach(n=>impUI.topics[n]=true);impUI.step='scan';render();
  setTimeout(()=>{impUI.step='result';render();window.scrollTo(0,0);},1200+Math.random()*300);};
 img.onerror=()=>toast('图片打不开，换一张试试～');img.src=dataUrl;}
function vImpScan(){return `${topBar()}<div class="card scan">${mascot('think',90)}<div class="eye">👀</div><h2>小根正在看你的试卷…</h2><div class="sub">对照二次根式知识点中</div><div class="bar"><i></i></div>
 ${impUI.preview?`<img class="prevw" style="margin-top:16px;max-height:160px" src="${impUI.preview}" alt="预览">`:''}</div>`;}
function vImpResult(){const topics=ALL8.map(n=>{const on=!!impUI.topics[n];return `<button type="button" class="tgl ${on?'on':''}" onclick="toggleTopic(${n})"><span class="ck">${on?'✓':''}</span><span>${LV[n-1].icon} ${LV[n-1].name}</span></button>`;}).join('');
 return `${topBar()}<div class="ptitle">✨ 识别结果</div>
 <div class="card"><div class="row">${mascot('happy',58)}<div class="sp"><b>小根对照了你的试卷，建议从这些知识点开始练～</b><div class="sub">勾选「我不会 / 做错了」的知识点</div></div></div>
 ${impUI.preview?`<img class="prevw" style="margin:12px 0" src="${impUI.preview}" alt="试卷预览">`:''}
 <div style="margin-top:8px">${topics}</div>
 <div style="margin-top:14px"><b>📝 备注（可选）</b><div class="sub">比如：第 3 题不会、第 5 题做错了</div>
 <textarea class="note" id="sheetNote" placeholder="这道题我不会 / 这道题做错了…" oninput="impUI.note=this.value">${esc(impUI.note)}</textarea></div>
 <div class="stack" style="margin-top:14px"><button class="btn pri block" id="confirmImport" onclick="confirmImport()">确认，开始练这些 ✓</button>
 <button class="btn ghost block" onclick="saveSheetOnly()">先存到试卷本（不练）</button></div></div>`;}
function saveSheetOnly(){const note=(document.getElementById('sheetNote')||{}).value||impUI.note||'';
 const picked=ALL8.filter(n=>impUI.topics[n]);
 const id='sh'+Date.now().toString(36);
 const sheet={id,date:today(),data:impUI.preview,thumb:impUI.thumb||impUI.preview,topics:picked,note:note.trim(),added:Date.now()};
 try{S.sheets=S.sheets||[];S.sheets.push(sheet);save();}catch(e){sheet.data=sheet.thumb;try{S.sheets.push(sheet);save();}catch(e2){toast('存储空间不够');return;}}
 toast('已存入我的试卷 📁');impUI={step:'list',topics:{},note:'',preview:null,thumb:null,viewId:null};render();}
function toggleTopic(n){impUI.topics[n]=!impUI.topics[n];render();}
function confirmImport(){const picked=ALL8.filter(n=>impUI.topics[n]);if(!picked.length){toast('至少勾选一个知识点哦');return;}
 const note=(document.getElementById('sheetNote')||{}).value||impUI.note||'';
 const id='sh'+Date.now().toString(36);
 const sheet={id,date:today(),data:impUI.preview,thumb:impUI.thumb||impUI.preview,topics:picked,note:note.trim(),added:Date.now()};
 try{S.sheets=S.sheets||[];S.sheets.push(sheet);save();}catch(e){// quota: drop full image keep thumb
  sheet.data=sheet.thumb;try{S.sheets.push(sheet);save();}catch(e2){toast('存储空间不够，试试清掉旧试卷～');return;}}
 // unlock
 const set=new Set(S.sheetUnlock||[]);picked.forEach(n=>set.add(n));S.sheetUnlock=[...set];
 // seed wrong book 1-2 per topic
 const used=new Set();let seeded=0;
 picked.forEach(lv=>{const n=1+(Math.random()<.5?1:0);for(let i=0;i<n;i++){const q=genFrom(lv,used);addWrong(q,{fromSheet:true});seeded++;}});
 save();checkBadges();
 toast(`已解锁 ${picked.length} 个知识点，错题本 +${seeded} 题 📒`,true);confetti(40);
 impUI={step:'list',topics:{},note:'',preview:null,thumb:null,viewId:null};go('import');}
function viewSheet(id){impUI.viewId=id;impUI.step='detail';render();}
function vImpDetail(){const sh=(S.sheets||[]).find(x=>x.id===impUI.viewId);if(!sh){impUI.step='list';return vImpList();}
 return `${topBar()}<div class="ptitle">📄 试卷详情</div>
 <div class="card"><div class="sub">${sh.date}</div>
 <img class="prevw" style="margin:10px 0" src="${sh.data||sh.thumb}" alt="试卷">
 <div><b>关联知识点</b></div>
 <div style="margin:8px 0">${(sh.topics||[]).map(t=>`<span class="pill">${LV[t-1].icon} ${LV[t-1].short}</span>`).join('')||'<span class="sub">无</span>'}</div>
 ${sh.note?`<div class="hintb"><b>📝 备注</b><br>${esc(sh.note)}</div>`:''}
 <div class="stack" style="margin-top:14px">
  <button class="btn pri block" onclick="practiceSheetTopics('${sh.id}')">练这些知识点 ⚔️</button>
  <button class="btn ghost block" onclick="impUI.step='list';render()">← 返回列表</button>
  <button class="btn ghost block danger" onclick="deleteSheet('${sh.id}')">删除这份试卷</button>
 </div></div>`;}
function practiceSheetTopics(id){const sh=(S.sheets||[]).find(x=>x.id===id);if(!sh||!sh.topics.length)return;
 const lv=sh.topics.find(n=>lvUnlocked(n))||sh.topics[0];openLevel(lv);}
function deleteSheet(id){S.sheets=(S.sheets||[]).filter(x=>x.id!==id);save();impUI.step='list';render();toast('已删除');}


ensureStudyDay();
render();
