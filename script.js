// ===== EDIT HERE: real timings (24-hour) and WhatsApp number (with country code, e.g. "919876543210") =====
const PHONE="";
const OPEN={open:"08:00",close:"20:00"};
const WK=[["08:00","09:30","Class 8–10 · Maths"],["09:30","11:00","Class 8–10 · Science"],["11:00","12:30","Class 11–12 · Physics"],["12:30","14:00","Lunch break"],["14:00","15:30","Class 11–12 · Chemistry"],["15:30","17:00","JEE / NEET · Maths"],["17:00","18:00","Doubt session"],["18:00","19:30","JEE / NEET · Biology"]];
const SCHEDULE={1:WK,2:WK,3:WK,4:WK,5:WK,6:[["09:00","11:00","Weekly test"],["11:00","13:00","Test discussion"],["14:00","16:00","Doubt session"]],0:[]};
// =========================================================================================================
const N=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],$=i=>document.getElementById(i);
const mins=t=>{const[a,b]=t.split(":").map(Number);return a*60+b};
const fmt=t=>{let[h,m]=t.split(":").map(Number);const p=h>=12?"PM":"AM";h=h%12||12;return h+":"+String(m).padStart(2,"0")+" "+p};
function ist(){const p=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Kolkata",hour12:false,weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"}).formatToParts(new Date());const g=t=>p.find(x=>x.type===t).value;return{day:N.indexOf(g("weekday")),h:+g("hour")%24,m:+g("minute"),s:+g("second"),date:`${g("weekday")}, ${g("day")} ${g("month")} ${g("year")}`}}
const S0=7*60,S1=21*60;let picked=null,built=null,stripDay=null;
function buildDays(t){const b=$("days");b.innerHTML="";[1,2,3,4,5,6,0].forEach(d=>{const x=document.createElement("button");x.textContent=N[d];x.dataset.d=d;if(d===t)x.className="today";x.onclick=()=>{picked=d;tick()};b.appendChild(x)})}
function buildStrip(list){const s=$("strip");s.innerHTML='<div class="needle" id="needle"></div>';if(!list.length){s.insertAdjacentHTML("beforeend",'<div style="padding:24px;color:var(--mut)">No classes today. Enjoy the holiday!</div>')}
list.forEach((r,i)=>{const l=(mins(r[0])-S0)/(S1-S0)*100,w=(mins(r[1])-mins(r[0]))/(S1-S0)*100;const e=document.createElement("div");e.className="blk"+(/break/i.test(r[2])?" brk":"");e.id="b"+i;e.style.cssText=`left:${l}%;width:calc(${w}% - 3px)`;e.title=r[2];e.textContent=r[2].split("·").pop().trim();s.appendChild(e)});
$("ticks").innerHTML=[7,10,13,16,19,21].map(h=>`<span>${fmt(h+":00")}</span>`).join("")}
function tick(){const t=ist(),nm=t.h*60+t.m+t.s/60;
$("clock").innerHTML=String(t.h%12||12).padStart(2,"0")+":"+String(t.m).padStart(2,"0")+":"+String(t.s).padStart(2,"0")+"<small>"+(t.h>=12?"PM":"AM")+"</small>";$("date").textContent=t.date;
if(picked===null)picked=t.day;if(built!==t.day){buildDays(t.day);built=t.day}
const td=SCHEDULE[t.day]||[];if(stripDay!==t.day){buildStrip(td);stripDay=t.day}
const nd=$("needle");if(nd){nd.style.left=Math.max(0,Math.min(100,(nm-S0)/(S1-S0)*100))+"%";nd.style.display=(nm<S0||nm>S1)?"none":"block"}
const open=td.length>0&&nm>=mins(OPEN.open)&&nm<mins(OPEN.close);$("status").className="badge "+(open?"open":"closed");$("statusText").textContent=open?"Open now":(td.length?"Closed now":"Closed today");
let cur=null,nxt=null;td.forEach((r,i)=>{if(nm>=mins(r[0])&&nm<mins(r[1]))cur=i;else if(nm<mins(r[0])&&nxt===null)nxt=i});
td.forEach((r,i)=>{const e=$("b"+i);if(e)e.classList.toggle("cur",i===cur)});
if(cur!==null){const r=td[cur];$("nowTitle").textContent="Now: "+r[2];$("nowSub").textContent=`${fmt(r[0])} – ${fmt(r[1])} · ${Math.ceil(mins(r[1])-nm)} min left`;$("prog").style.width=(nm-mins(r[0]))/(mins(r[1])-mins(r[0]))*100+"%"}
else if(nxt!==null){const r=td[nxt],x=Math.ceil(mins(r[0])-nm);$("nowTitle").textContent="Next: "+r[2];$("nowSub").textContent=`Starts ${fmt(r[0])} · in ${x>=60?Math.floor(x/60)+" h "+x%60+" min":x+" min"}`;$("prog").style.width="0%"}
else{$("nowTitle").textContent=td.length?"Classes over for today":"No classes today";$("nowSub").textContent="Check the timetable for other days.";$("prog").style.width="0%"}
const L=SCHEDULE[picked]||[];$("rows").innerHTML=L.length?L.map((r,i)=>{let c="",s="";if(picked===t.day){if(i===cur){c="current";s="Running now"}else if(i===nxt){c="next";s="Up next"}else if(nm>=mins(r[1])){c="done";s="Finished"}else s="Later"}return `<tr class="${c}"><td>${fmt(r[0])} – ${fmt(r[1])}</td><td>${r[2]}</td><td>${s}</td></tr>`}).join(""):`<tr><td colspan="3">No classes on ${N[picked]}.</td></tr>`;
document.querySelectorAll("#days button").forEach(b=>b.setAttribute("aria-pressed",String(+b.dataset.d===picked)))}
$("send").onclick=()=>{const n=$("fn").value.trim(),p=$("fp").value.trim();if(!n||p.replace(/\D/g,"").length<10){$("msg").textContent="Please enter the student name and a 10-digit phone number.";return}
if(!PHONE){$("msg").textContent="Details noted. The academy WhatsApp number is not set yet, so it cannot be sent from here.";return}
open("https://wa.me/"+PHONE+"?text="+encodeURIComponent(`Hello Kiran Academy, I want a demo class for ${n} (${$("fc").value}). My number: ${p}`),"_blank");$("msg").textContent="Opening WhatsApp…"};
if(PHONE)$("ph").textContent="+"+PHONE;$("yr").textContent=new Date().getFullYear();
tick();setInterval(tick,1000);
// stats computed from the timetable above
(function(){const v=Object.values(SCHEDULE);let cls=0,mn=0,db=0;v.forEach(d=>d.forEach(r=>{if(/break/i.test(r[2]))return;cls++;const m=mins(r[1])-mins(r[0]);if(/doubt/i.test(r[2]))db+=m;else mn+=m}));
const T={cls,days:v.filter(d=>d.length).length,hrs:Math.round(mn/60),dbt:Math.round(db/60)};
const go=e=>{const to=T[e.dataset.c],t0=performance.now();(function f(t){const p=Math.min(1,(t-t0)/1400);e.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(t0)};
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){go(x.target);io.unobserve(x.target)}}),{threshold:.6});document.querySelectorAll("[data-c]").forEach(e=>io.observe(e));
const ro=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");ro.unobserve(x.target)}}),{threshold:.1});document.querySelectorAll(".rv").forEach(e=>ro.observe(e));
addEventListener("scroll",()=>{const h=document.documentElement;$("sp").style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100||0)+"%"},{passive:true});
$("tg").onclick=()=>{const r=document.documentElement,d=r.dataset.theme==="dark"||(!r.dataset.theme&&matchMedia("(prefers-color-scheme:dark)").matches);r.dataset.theme=d?"light":"dark"}})();

// ===== live sky: hero changes with real India time =====
(function(){
const P=[[0,[10,12,40],[28,26,80]],[5,[24,26,74],[92,62,110]],[6.5,[52,72,150],[240,140,80]],[9,[30,84,170],[90,160,225]],[15,[30,84,170],[90,160,225]],[17.5,[60,60,140],[240,120,60]],[19,[26,24,70],[110,60,100]],[20.5,[10,12,40],[28,26,80]],[24,[10,12,40],[28,26,80]]];
const mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
function sky(){const t=ist(),h=t.h+t.m/60;let i=0;while(h>P[i+1][0])i++;const k=(h-P[i][0])/(P[i+1][0]-P[i][0]);
const top=mix(P[i][1],P[i+1][1],k),bot=mix(P[i][2],P[i+1][2],k);
document.querySelector(".hero").style.background=`linear-gradient(180deg,rgb(${top}),rgb(${bot}))`;
const day=h>=6&&h<18,tt=day?(h-6)/12:(h>=18?(h-18)/12:(h+6)/12);
const g=$("glow"),r=$("rays");g.classList.toggle("moon",!day);
const x=8+84*tt,y=70-52*Math.sin(Math.PI*tt);g.style.left=x+"%";g.style.top=y+"%";r.style.left=`calc(${x}% - 35vmax)`;r.style.top=`calc(${y}% - 35vmax)`;r.style.opacity=day?.5:.12;
const night=h<5.5||h>19.5?1:(h<6.5?(6.5-h):(h>18.5?h-18.5:0));$("stars").style.opacity=Math.min(1,night);
const nm=h<5?["🌙","Late night"]:h<7?["🌅","Sunrise"]:h<12?["🌤️","Morning"]:h<16?["☀️","Afternoon"]:h<18.5?["🌇","Evening"]:h<20?["🌆","Sunset"]:["🌙","Night"];
$("skyIco").textContent=nm[0];$("skyTxt").textContent="Sky over Pimpri right now: "+nm[1]}
let st="";for(let n=0;n<45;n++)st+=`radial-gradient(${1+n%2}px ${1+n%2}px at ${(n*37)%100}% ${(n*53)%90}%,#fff,transparent),`;
$("stars").style.background=st.slice(0,-1);sky();setInterval(sky,30000);
})();
// ===== batch finder =====
(function(){const q=$("qc"),g=$("qg"),res=$("res");
function run(){const c=q.value,gl=g.value;let name,why,key,sel;
if(gl==="j"){name="JEE batch";why="Concept classes, daily practice and mock tests for engineering entrance.";key=/JEE/;sel="JEE / NEET"}
else if(gl==="n"){name="NEET batch";why="Physics, Chemistry and Biology with regular practice tests for medical entrance.";key=/NEET|Biology|Chemistry|Physics/;sel="JEE / NEET"}
else if(gl==="d"){name="Doubt sessions + regular batch";why="A fixed hour to clear doubts one-to-one, along with your class batch.";key=/Doubt/;sel=c==="8"?"Class 8–10":"Class 11–12"}
else{name=c==="8"?"Class 8–10 board batch":"Class 11–12 board batch";why="Subject classes with weekly tests, planned around board exams.";key=c==="8"?/Class 8/:/Class 11/;sel=c==="8"?"Class 8–10":"Class 11–12"}
const day=[1,2,3,4,5].find(d=>(SCHEDULE[d]||[]).length)||1;const L=(SCHEDULE[day]||[]).filter(r=>key.test(r[2]));
res.innerHTML=`<h3>${name}</h3><p style="margin:0 0 8px">${why}</p><b>Timings (Mon–Fri, sample):</b><ul>${L.map(r=>`<li>${fmt(r[0])} – ${fmt(r[1])} · ${r[2]}</li>`).join("")||"<li>Timings coming soon</li>"}</ul><a class="btn p" href="#enquiry" id="go">Book a demo for this batch</a>`;
res.classList.add("show");$("go").onclick=()=>{$("fc").value=sel}}
q.onchange=g.onchange=run;run()})();
// ===== 3D tilt on cards (mouse only) =====
document.querySelectorAll(".course").forEach(c=>{c.addEventListener("pointermove",e=>{if(e.pointerType!=="mouse")return;const b=c.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;c.style.transform=`perspective(700px) rotateY(${x*9}deg) rotateX(${-y*9}deg) translateY(-3px)`});c.addEventListener("pointerleave",()=>c.style.transform="")});

