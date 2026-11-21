const $=id=>document.getElementById(id),wrap=$('wrap'),log=$('log'),t=$('t'),go=$('go');
let chats=JSON.parse(localStorage.getItem('elite')||'[]'),cur=null,busy=false,ctl=null,body=null;
const save=()=>localStorage.setItem('elite',JSON.stringify(chats));
const esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function md(s){return s.split('```').map((p,i)=>{
  if(i%2){const n=p.indexOf('\n'),lang=n>=0?p.slice(0,n).trim():'',code=n>=0?p.slice(n+1):p;
    return '<div class="code"><div class="ch"><span>'+esc(lang||'code')+'</span><button class="cp">Copy</button></div><pre>'+esc(code)+'</pre></div>'}
  let h=esc(p).replace(/`([^`\n]+)`/g,'<code>$1</code>').replace(/\*\*([^*\n]+)\*\*/g,'<b>$1</b>');
  h=h.replace(/(^|\n)((?:[-*] .+(?:\n|$))+)/g,(m,a,l)=>a+'<ul>'+l.trim().split('\n').map(x=>'<li>'+x.slice(2)+'</li>').join('')+'</ul>');
  return h.replace(/\n/g,'<br>')}).join('')}
const near=()=>log.scrollHeight-log.scrollTop-log.clientHeight<140;
function paint(){if(!body)return;const m=cur.msgs[cur.msgs.length-1],stick=near();
  body.innerHTML=m.content?md(m.content)+(busy?'<span class="cur"></span>':''):'<span class="think"><i></i><i></i><i></i></span>';
  if(stick)log.scrollTop=log.scrollHeight}
function row(m){const d=document.createElement('div');d.className='row '+(m.role==='user'?'u':'a');
  d.innerHTML=(m.role==='user'?'':'<div class="av"></div>')+'<div class="bd"></div>';
  const b=d.querySelector('.bd');m.role==='user'?b.textContent=m.content:b.innerHTML=md(m.content);wrap.appendChild(d);return b}
const ideas=[['Explain simply','How does the internet work?'],['Write code','Write a Python function to reverse a string'],['Brainstorm','Give me 5 startup ideas for students'],['Plan my day','Make a study plan for 2 hours']];
function render(){wrap.innerHTML='';body=null;
  if(!cur||!cur.msgs.length){wrap.innerHTML='<div class="hero"><div class="logo"></div><h1>How can I help today?</h1><p>Private intelligence that lives on your device.</p><div class="cards">'+
    ideas.map((x,i)=>'<button class="card" style="animation-delay:'+(.1+i*.08)+'s" data-q="'+x[1]+'"><b>'+x[0]+'</b><small>'+x[1]+'</small></button>').join('')+'</div></div>'}
  else cur.msgs.forEach(m=>body=row(m));
  const l=$('list');l.innerHTML='';chats.forEach(c=>{const d=document.createElement('div');d.className='it'+(c===cur?' on':'');
    d.innerHTML='<span></span><button class="x" title="Delete">✕</button>';d.firstChild.textContent=c.title;
    d.onclick=e=>{if(e.target.classList.contains('x')){chats=chats.filter(z=>z!==c);if(cur===c)cur=null;save()}else if(!busy)cur=c;render();$('side').classList.remove('open')};l.appendChild(d)});
  log.scrollTop=log.scrollHeight}
function btn(){go.textContent=busy?'■':'↑';go.title=busy?'Stop':'Send'}
async function send(q){q=q.trim();if(busy||!q)return;
  if(!cur){cur={title:'New chat',msgs:[]};chats.unshift(cur)}
  if(!cur.msgs.length)cur.title=q.slice(0,38);
  cur.msgs.push({role:'user',content:q});const a={role:'assistant',content:''};cur.msgs.push(a);
  t.value='';t.style.height='auto';busy=true;btn();render();paint();
  ctl=new AbortController();
  try{const r=await fetch('/chat',{method:'POST',signal:ctl.signal,body:JSON.stringify({messages:cur.msgs.slice(0,-1)})});
    const rd=r.body.getReader(),dc=new TextDecoder();
    for(;;){const{done,value}=await rd.read();if(done)break;a.content+=dc.decode(value,{stream:true});paint()}
  }catch(e){if(e.name!=='AbortError')a.content+='\n\nConnection lost.'}
  busy=false;ctl=null;if(!a.content)a.content='(stopped)';save();btn();paint()}
go.onclick=()=>busy?ctl&&ctl.abort():send(t.value);
t.onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send(t.value)}};
t.oninput=()=>{t.style.height='auto';t.style.height=Math.min(t.scrollHeight,180)+'px'};
wrap.onclick=e=>{const c=e.target.closest('.card'),p=e.target.closest('.cp');
  if(c)send(c.dataset.q);
  if(p){navigator.clipboard.writeText(p.closest('.code').querySelector('pre').textContent);p.textContent='Copied ✓';setTimeout(()=>p.textContent='Copy',1500)}};
const fresh=()=>{if(busy)return;cur=null;render();t.focus();$('side').classList.remove('open')};
$('new').onclick=fresh;$('menu').onclick=()=>$('side').classList.toggle('open');
document.onkeydown=e=>{if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();fresh()}};
async function ping(){try{const r=await fetch('/status');$('dot').className='dot'+(r.ok?' ok':'');$('st').textContent=r.ok?'Offline model ready':'Model not running'}catch{$('st').textContent='Server stopped'}}
ping();setInterval(ping,5000);render();t.focus();
