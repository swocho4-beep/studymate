const app=document.getElementById("app");
const BOOKS=["জীববিজ্ঞান","রসায়ন","পদার্থবিজ্ঞান","বাংলাদেশ ও বিশ্বপরিচয় (BGS)"];
let s={items:[],i:0,answers:[],score:0,sec:0,timer:null,title:""};
const PK="study-bangla-progress-v4";
const SEEN="study-bangla-seen-v4";
const SESSION="study-bangla-session-v4";
const getSeen=()=>{try{return JSON.parse(localStorage.getItem(SEEN))||{}}catch{return{}}};
const saveSeen=x=>localStorage.setItem(SEEN,JSON.stringify(x));
const rand=(n)=>Math.floor(Math.random()*n);
const shuffle=(arr)=>{const a=[...arr];for(let i=a.length-1;i>0;i--){const j=rand(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
const variantQuestion=(q,variant)=>{
  const v=[
    q.question,
    "নিচের প্রশ্নটির সবচেয়ে নির্ভুল উত্তর কোনটি? "+q.question,
    "ধারণাটি ভালোভাবে বুঝে উত্তর দাও—"+q.question,
    "নিচের বিকল্পগুলোর মধ্যে কোনটি প্রশ্নটির বৈজ্ঞানিক/প্রামাণ্য ব্যাখ্যার সঙ্গে সবচেয়ে সামঞ্জস্যপূর্ণ? "+q.question,
    "পরীক্ষায় ধারণাভিত্তিকভাবে প্রশ্নটি এভাবে এলে সঠিক উত্তর নির্বাচন করো: "+q.question
  ];
  return v[variant%v.length];
};
const makeDisplayQ=(q)=>{
  const variant=rand(5);
  const opts=shuffle(q.options);
  const correctText=q.options[q.correct];
  return {...q,displayQuestion:variantQuestion(q,variant),options:opts,correct:opts.indexOf(correctText),variant};
};

const bn=n=>String(n).replace(/\d/g,d=>"০১২৩৪৫৬৭৮৯"[d]);
const esc=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const getP=()=>{try{return JSON.parse(localStorage.getItem(PK))||{}}catch{return{}}};
const saveP=x=>localStorage.setItem(PK,JSON.stringify(x));
const clearT=()=>{if(s.timer)clearInterval(s.timer);s.timer=null};
const fmt=x=>`${Math.floor(x/60)}:${String(Math.max(0,x%60)).padStart(2,"0")}`;

function home(){clearT();app.innerHTML=`
<section class="hero"><span class="pill">লগইন / সাইনআপ লাগবে না</span><h1>শুধু ৪টি বিষয়।<br><span>ফোকাসড প্রস্তুতি।</span></h1><p>জীববিজ্ঞান, রসায়ন, পদার্থবিজ্ঞান ও বাংলাদেশ ও বিশ্বপরিচয়—বই, অধ্যায়, MCQ এবং মডেল টেস্ট সব এক জায়গায়।</p>
<div class="stats"><div><b>৪</b><small>বিষয়</small></div><div><b>১০,০০০+</b><small>মূল অনুশীলনী MCQ</small></div><div><b>∞</b><small>নিজের মতো অনুশীলন</small></div></div></section>
<section class="wrap"><div class="head"><div><em>শুরু করো</em><h2>তুমি কী করতে চাও?</h2></div></div>
<div class="cards"><button onclick="books()">📚<b>বই ও অধ্যায়</b><small>অধ্যায় ধরে পড়া ও practice</small></button><button onclick="practice()">📝<b>শুধু MCQ</b><small>সরাসরি প্রশ্ন অনুশীলন</small></button><button onclick="mock()">⏱<b>মডেল টেস্ট</b><small>সময় ধরে ৫০ প্রশ্ন</small></button><button onclick="progress()">📊<b>প্রগ্রেস</b><small>সেরা স্কোর ও attempts</small></button></div></section>`}

function books(){clearT();app.innerHTML=`<section class="wrap"><button class="back" onclick="home()">← হোম</button><div class="head"><div><em>বিষয়</em><h2>যেকোনো একটি বেছে নাও</h2></div></div><div class="bookgrid">${BOOKS.map(x=>`<button class="book" onclick="openBook('${esc(x)}')"><span class="bookicon">📘</span><div><b>${esc(x)}</b><small>অধ্যায় ও MCQ</small></div></button>`).join("")}</div></section>`}

function openBook(name){const q=QUESTION_BANK.filter(x=>x.subject===name);const ch=[...new Set(q.map(x=>x.chapter))];app.innerHTML=`<section class="wrap"><button class="back" onclick="books()">← বিষয়</button><div class="head"><div><em>${esc(name)}</em><h2>অধ্যায় / section</h2></div><span class="count">${bn(q.length)}টি MCQ</span></div><div class="chaptergrid">${ch.map(c=>`<button class="chapter" onclick="chapter('${esc(name)}','${esc(c)}')"><b>${esc(c)}</b><span>${bn(q.filter(x=>x.chapter===c).length)} MCQ →</span></button>`).join("")}</div></section>`}
function chapter(subject,chapter){start(QUESTION_BANK.filter(x=>x.subject===subject&&x.chapter===chapter),`${subject} — ${chapter}`)}
function practice(){clearT();app.innerHTML=`<section class="wrap"><button class="back" onclick="home()">← হোম</button><div class="head"><div><em>MCQ</em><h2>শুধু MCQ</h2></div></div><div class="panel"><p>একটি বিষয় বেছে নিয়ে ২০, ৫০, ১০০ বা ২০০টি MCQ অনুশীলন করো।</p><select id="sub">${BOOKS.map(x=>`<option>${esc(x)}</option>`).join("")}</select><select id="num"><option value="20">২০টি</option><option value="50">৫০টি</option><option value="100">১০০টি</option><option value="200">২০০টি</option></select><button class="primary" onclick="randomTest()">MCQ শুরু করো →</button></div></section>`}
function pickFresh(pool,n,key){
 const seen=getSeen();
 const ids=seen[key]||[];
 const fresh=pool.filter(q=>!ids.includes(q.id));
 const fallback=pool.filter(q=>ids.includes(q.id));
 let picked=shuffle(fresh).slice(0,n);
 if(picked.length<n)picked=picked.concat(shuffle(fallback).slice(0,n-picked.length));
 const newIds=[...ids,...picked.map(q=>q.id)];
 seen[key]=newIds.slice(-Math.min(pool.length,Math.max(200,n*8)));
 saveSeen(seen);
 return picked;
}
function randomTest(){
 const sub=document.getElementById("sub").value,n=+document.getElementById("num").value;
 const pool=QUESTION_BANK.filter(x=>x.subject===sub);
 const a=pickFresh(pool,Math.min(n,pool.length),sub);
 start(a,sub);
}
function mock(){
 const a=pickFresh(QUESTION_BANK,50,"MODEL");
 start(a,"মডেল টেস্ট");
}
function start(items,title){clearT();s={items:shuffle(items).map(makeDisplayQ),i:0,answers:[],score:0,sec:Math.max(60,items.length*35),timer:null,title};renderQ();s.timer=setInterval(()=>{s.sec--;const t=document.getElementById("time");if(t)t.textContent=fmt(s.sec);if(s.sec<=0)finish(true)},1000)}
function renderQ(){const q=s.items[s.i],a=s.answers[s.i];app.innerHTML=`<section class="wrap quiz"><div class="quiztop"><button class="back" onclick="exitQuiz()">← বের হব</button><strong>⏱ <span id="time">${fmt(s.sec)}</span></strong></div><div class="bar"><span style="width:${s.i/s.items.length*100}%"></span></div><div class="meta"><span>${esc(s.title)}</span><b>${bn(s.i+1)} / ${bn(s.items.length)}</b></div><article class="qbox"><span class="tag">${esc(q.tag)} · ${q.variant>=3?"চ্যালেঞ্জ":"কঠিন"} · ধারণাভিত্তিক</span><h2>${esc(q.displayQuestion||q.question)}</h2><div class="opts">${q.options.map((o,i)=>`<button class="opt ${a!==undefined?(i===q.correct?"ok":i===a?"bad":"dim"):""}" ${a!==undefined?"disabled":""} onclick="choose(${i})"><i>${"ক খ গ ঘ"[i]}</i>${esc(o)}</button>`).join("")}</div>${a!==undefined?`<div class="explain"><b>${a===q.correct?"সঠিক উত্তর ✅":"ভুল উত্তর ❌"}</b><p>${esc(q.explanation)}</p></div><button class="primary" onclick="nextQ()">${s.i===s.items.length-1?"ফলাফল দেখো":"পরের প্রশ্ন →"}</button>`:""}</article></section>`}
function choose(i){if(s.answers[s.i]!==undefined)return;s.answers[s.i]=i;if(i===s.items[s.i].correct)s.score++;renderQ()}
function nextQ(){if(s.i===s.items.length-1)finish(false);else{s.i++;renderQ()}}
function finish(timeout){clearT();const pct=Math.round(s.score/s.items.length*100),p=getP(),key=s.title;let x=p[key]||{attempts:0,best:0};x.attempts++;x.best=Math.max(x.best,pct);p[key]=x;saveP(p);app.innerHTML=`<section class="result"><div class="resultcard"><span class="pill">${timeout?"সময় শেষ":"পরীক্ষা শেষ"}</span><div class="circle">${bn(pct)}%</div><h2>${pct>=90?"দারুণ!":pct>=70?"খুব ভালো!":pct>=50?"আরও অনুশীলন করো":"আবার চেষ্টা করো!"}</h2><p>${bn(s.items.length)}টির মধ্যে <b>${bn(s.score)}</b>টি সঠিক।</p><button class="primary" onclick="start(s.items,s.title)">আবার দাও</button> <button class="ghost" onclick="home()">হোমে যাও</button></div></section>`}
function exitQuiz(){if(confirm("এই পরীক্ষা ছেড়ে যাবে?")){clearT();home()}}
function definitions(){
 clearT();
 app.innerHTML=`<section class="wrap"><button class="back" onclick="home()">← হোম</button>
 <div class="head"><div><em>CONCEPTS</em><h2>গুরুত্বপূর্ণ সংজ্ঞা</h2></div></div>
 <div class="defgrid">${DEFINITIONS.map(d=>`<article class="definition"><span class="tag">${esc(d.subject)}</span><h3>${esc(d.term)}</h3><p>${esc(d.definition)}</p></article>`).join("")}</div></section>`;
}
function progress(){clearT();const p=getP(),keys=Object.keys(p),v=Object.values(p);app.innerHTML=`<section class="wrap"><button class="back" onclick="home()">← হোম</button><div class="head"><div><em>প্রগ্রেস</em><h2>তোমার অগ্রগতি</h2></div></div><div class="progresscards"><div><b>${bn(keys.length)}</b><small>অংশে অনুশীলন</small></div><div><b>${bn(v.reduce((a,x)=>a+(x.attempts||0),0))}</b><small>মোট চেষ্টা</small></div><div><b>${bn(keys.length?Math.round(v.reduce((a,x)=>a+x.best,0)/keys.length):0)}%</b><small>সেরা স্কোরের গড়</small></div></div><div class="plist">${keys.length?keys.map(k=>`<div><b>${esc(k)}</b><span>সেরা ${bn(p[k].best)}% · ${bn(p[k].attempts)} বার</span></div>`).join(""):`<div class="empty">এখনও কোনো test দেওয়া হয়নি।</div>`}</div><button class="danger" onclick="resetProgress()">সব প্রগ্রেস মুছুন</button></section>`}
function resetProgress(){if(confirm("সব local progress মুছে ফেলবে?")){localStorage.removeItem(PK);progress()}}
function toggleTheme(){const d=document.documentElement.classList.toggle("dark");localStorage.setItem("theme3",d?"dark":"light");document.getElementById("theme").textContent=d?"☀":"☾"}
if(localStorage.getItem("theme3")==="dark")document.documentElement.classList.add("dark");
home();