const API=window.API_URL,$=id=>document.getElementById(id);
let S={accounts:[],categories:[],transactions:[],dashboard:{}},M=new Date(),saving=false,processing=false;
const cacheKey='mm-final-cache',queueKey='mm-final-queue';
let Q=[];
const money=n=>new Intl.NumberFormat('th-TH',{style:'currency',currency:'THB'}).format(Number(n)||0);
function toast(t){$('toast').textContent=t;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),1800)}
function saveCache(){localStorage.setItem(cacheKey,JSON.stringify(S));localStorage.setItem(queueKey,JSON.stringify(Q))}
function loadCache(){try{const x=JSON.parse(localStorage.getItem(cacheKey));if(x){S=x;render()}Q=JSON.parse(localStorage.getItem(queueKey)||'[]')||[]}catch(e){Q=[]}}
async function apiGet(){const r=await fetch(API+'?action=bootstrap&_='+Date.now(),{cache:'no-store'});const j=await r.json();if(!j.success)throw Error(j.error||'โหลดไม่สำเร็จ');return j.data}
async function apiPost(body){const r=await fetch(API,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(body)});const j=await r.json();if(!j.success)throw Error(j.error||'บันทึกไม่สำเร็จ');return j}
function syncState(){ $('sync').textContent=(processing||Q.length)?('● รอซิงก์ '+Q.length+' รายการ'):'● ซิงก์แล้ว' }
async function sync(silent=true){if(processing||Q.length){syncState();return}try{const d=await apiGet();S=d;saveCache();render();syncState()}catch(e){$('sync').textContent='● ออฟไลน์';if(!silent)toast('เชื่อม Google Sheets ไม่สำเร็จ')}}
function enqueue(body){Q.push(body);saveCache();syncState();processQueue()}
async function processQueue(){if(processing||!Q.length)return;processing=true;syncState();while(Q.length){try{await apiPost(Q[0]);Q.shift();saveCache();syncState()}catch(e){processing=false;syncState();toast('ข้อมูลเก็บไว้แล้ว รอซิงก์อัตโนมัติ');return}}processing=false;try{const d=await apiGet();S=d;saveCache();render();syncState();toast('✓ ซิงก์เรียบร้อย')}catch(e){syncState()}}
function catName(id){const c=S.categories.find(x=>x.id===id);return c?c.name:id||''}
function accountName(id){const a=S.accounts.find(x=>x.id===id);return a?a.name:id||''}
function txRows(a){if(!a.length)return '<div class="empty">ยังไม่มีรายการ</div>';return a.map(t=>`<div class="row tx" data-id="${t.id}"><div class="left"><span class="bubble">${t.type==='รายรับ'?'↓':t.type==='โอนเงิน'?'↔':'↑'}</span><div><b>${t.title||catName(t.category)||t.type}</b><small>${t.source?('จาก '+t.source+' · '):''}${new Date(t.datetime).toLocaleDateString('th-TH')}</small></div></div><b class="${t.type==='รายรับ'?'plus':t.type==='รายจ่าย'?'minus':''}">${t.type==='รายรับ'?'+':t.type==='รายจ่าย'?'-':''}${money(t.amount)}</b></div>`).join('')}
function filterTx(){const q=$('q').value.toLowerCase(),a=$('af').value,t=$('tf').value;return S.transactions.filter(x=>(!q||((x.title||'')+(x.note||'')+(x.source||'')+catName(x.category)).toLowerCase().includes(q))&&(!a||(x.fromAccount===a||x.toAccount===a))&&(!t||x.type===t))}
function catRows(){const b=document.querySelector('.cat-tab.on'),typ=b?b.dataset.ct:'รายจ่าย';const a=S.categories.filter(c=>c.type===typ&&c.status==='ใช้งาน');return a.length?a.map(c=>`<div class="row cat-edit" data-id="${c.id}"><div class="left"><span class="bubble">${c.icon||'📌'}</span><div><b>${c.name}</b><small>${c.type}</small></div></div><span>แก้ไข ›</span></div>`).join(''):'<div class="empty">ยังไม่มีหมวดหมู่</div>'}
function render(){
 const d=S.dashboard||{};$('total').textContent=money(d.totalBalance);$('income').textContent=money(d.income);$('expense').textContent=money(d.expense);
 $('cards').innerHTML=S.accounts.filter(a=>a.status==='ใช้งาน').map(a=>`<div class="card"><span>${a.icon||'💳'}</span><small>${a.name}</small><b>${money(a.balance)}</b></div>`).join('');
 $('recent').innerHTML=txRows(S.transactions.slice(0,6));$('alltx').innerHTML=txRows(filterTx());
 const op=S.accounts.filter(a=>a.status==='ใช้งาน').map(a=>`<option value="${a.id}">${a.icon||''} ${a.name}</option>`).join('');
 $('from').innerHTML=op;$('to').innerHTML=op;$('af').innerHTML='<option value="">ทุกบัญชี</option>'+op;
 $('accList').innerHTML=S.accounts.map(a=>`<div class="row acc" data-id="${a.id}"><div class="left"><span class="bubble">${a.icon||'💳'}</span><div><b>${a.name}</b><small>${a.accountType}</small></div></div><b>${money(a.balance)}</b></div>`).join('');
 $('catList').innerHTML=catRows();bind();summary();
}
function bind(){document.querySelectorAll('.tx').forEach(x=>x.onclick=()=>editTx(x.dataset.id));document.querySelectorAll('.acc').forEach(x=>x.onclick=()=>editAcc(x.dataset.id));document.querySelectorAll('.cat-edit').forEach(x=>x.onclick=()=>editCat(x.dataset.id))}
function page(p){document.querySelectorAll('.page').forEach(x=>x.classList.toggle('on',x.id===p));document.querySelectorAll('.nav').forEach(x=>x.classList.toggle('on',x.dataset.page===p));$('title').textContent={home:'สวัสดี 👋',history:'รายการทั้งหมด',summary:'สรุปผล',accounts:'บัญชีของฉัน',categories:'หมวดหมู่'}[p]||'';if(p==='summary')summary()}
document.querySelectorAll('.nav,.goto').forEach(x=>x.onclick=()=>page(x.dataset.page));
function setType(t){
 $('etype').value=t;document.querySelectorAll('.segments button').forEach(x=>x.classList.toggle('on',x.dataset.t===t));
 $('accountLabel').textContent=t==='โอนเงิน'?'โอนจากบัญชี':'บัญชี';
 $('tow').hidden=t!=='โอนเงิน';$('catw').hidden=t==='โอนเงิน';$('sourcew').hidden=t!=='รายรับ';
 $('cat').innerHTML=S.categories.filter(c=>c.type===t&&c.status==='ใช้งาน').map(c=>`<option value="${c.id}">${c.icon||''} ${c.name}</option>`).join('');
}
function openTx(){
 $('form').reset();$('eid').value='';$('mtitle').textContent='บันทึกรายการ';$('del').hidden=true;$('moreFields').hidden=true;$('moreBtn').textContent='+ รายละเอียดเพิ่มเติม';
 $('dt').value=new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,16);setType('รายจ่าย');$('dlg').showModal();
}
$('fab').onclick=openTx;$('addMobile').onclick=openTx;$('close').onclick=()=>$('dlg').close();
document.querySelectorAll('.segments button').forEach(x=>x.onclick=()=>setType(x.dataset.t));
$('moreBtn').onclick=()=>{$('moreFields').hidden=!$('moreFields').hidden;$('moreBtn').textContent=$('moreFields').hidden?'+ รายละเอียดเพิ่มเติม':'− ซ่อนรายละเอียด'};
function editTx(id){
 const t=S.transactions.find(x=>x.id===id);if(!t)return;
 $('eid').value=t.id;$('mtitle').textContent='แก้ไขรายการ';setType(t.type);$('dt').value=(t.datetime||'').slice(0,16);$('amt').value=t.amount;$('from').value=t.fromAccount;$('to').value=t.toAccount||'';$('cat').value=t.category||'';$('source').value=t.source||'';$('desc').value=t.title||'';$('note').value=t.note||'';$('moreFields').hidden=false;$('moreBtn').textContent='− ซ่อนรายละเอียด';$('del').hidden=false;$('dlg').showModal();
}
$('form').onsubmit=e=>{
 e.preventDefault();
 const id0=$('eid').value,t=$('etype').value;
 const id=id0||('TXN-C-'+Date.now()+'-'+Math.random().toString(36).slice(2,7).toUpperCase());
 const d={id,datetime:$('dt').value,type:t,fromAccount:$('from').value,toAccount:t==='โอนเงิน'?$('to').value:'',category:t==='โอนเงิน'?'':$('cat').value,source:t==='รายรับ'?$('source').value.trim():'',title:$('desc').value.trim(),amount:Number($('amt').value),note:$('note').value.trim()};
 if(!d.fromAccount)return toast('กรุณาเลือกบัญชี'); if(!d.amount||d.amount<=0)return toast('กรุณาใส่จำนวนเงิน'); if(t==='โอนเงิน'&&(!d.toAccount||d.toAccount===d.fromAccount))return toast('กรุณาเลือกบัญชีปลายทาง');
 $('dlg').close();
 if(id0)S.transactions=S.transactions.map(x=>x.id===id0?{...x,...d}:x);else S.transactions.unshift(d);
 saveCache();render();enqueue({action:id0?'updateTransaction':'addTransaction',data:d});toast(id0?'แก้ไขแล้ว':'บันทึกแล้ว');
};
$('del').onclick=()=>{const id=$('eid').value;if(!id||!confirm('ลบรายการนี้ใช่ไหม?'))return;$('dlg').close();S.transactions=S.transactions.filter(x=>x.id!==id);saveCache();render();enqueue({action:'deleteTransaction',id});toast('ลบแล้ว')};
function summary(){
 const y=M.getFullYear(),m=M.getMonth(),a=S.transactions.filter(t=>{const d=new Date(t.datetime);return d.getFullYear()===y&&d.getMonth()===m});
 $('month').textContent=M.toLocaleDateString('th-TH',{month:'long',year:'numeric'});
 let inc=0,exp=0,c={};a.forEach(t=>{if(t.type==='รายรับ')inc+=Number(t.amount)||0;if(t.type==='รายจ่าย'){exp+=Number(t.amount)||0;c[t.category]=(c[t.category]||0)+(Number(t.amount)||0)}});
 $('si').textContent=money(inc);$('se').textContent=money(exp);$('sn').textContent=money(inc-exp);
 const mom=a.filter(t=>t.type==='รายรับ'&&((t.source||'').trim().includes('แม่')||(t.title||'').trim().includes('แม่')));
 $('motherTotal').textContent=money(mom.reduce((s,t)=>s+(Number(t.amount)||0),0));$('motherCount').textContent=mom.length+' ครั้ง';
 $('motherList').innerHTML=mom.length?mom.map(t=>`<div class="minirow"><span>${new Date(t.datetime).toLocaleDateString('th-TH')} · ${t.title||'แม่ให้เงิน'} · ${accountName(t.fromAccount)}</span><b>${money(t.amount)}</b></div>`).join(''):'<div class="empty">เดือนนี้ยังไม่มีรายการจากแม่</div>';
 const mx=Math.max(1,...Object.values(c));$('cats').innerHTML=Object.keys(c).length?Object.entries(c).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div class="barline"><div class="barhead"><span>${catName(k)}</span><b>${money(v)}</b></div><div class="bar"><i style="width:${v/mx*100}%"></i></div></div>`).join(''):'<div class="empty">ยังไม่มีรายจ่าย</div>';
 $('balances').innerHTML=S.accounts.map(x=>`<div class="minirow"><span>${x.icon||'💳'} ${x.name}</span><b>${money(x.balance)}</b></div>`).join('');
}
$('prev').onclick=()=>{M.setMonth(M.getMonth()-1);summary()};$('next').onclick=()=>{M.setMonth(M.getMonth()+1);summary()};
['q','af','tf'].forEach(id=>$(id).addEventListener(id==='q'?'input':'change',()=>{$('alltx').innerHTML=txRows(filterTx());bind()}));
$('addAcc').onclick=()=>{$('aform').reset();$('aid').value='';$('adlg').showModal()};$('aclose').onclick=()=>$('adlg').close();
function editAcc(id){const a=S.accounts.find(x=>x.id===id);if(!a)return;$('aid').value=id;$('aname').value=a.name;$('atype').value=a.accountType;$('opening').value=a.openingBalance;$('aicon').value=a.icon;$('adlg').showModal()}
$('aform').onsubmit=async e=>{e.preventDefault();const id=$('aid').value,d={id,name:$('aname').value,accountType:$('atype').value,openingBalance:Number($('opening').value),icon:$('aicon').value};$('adlg').close();try{await apiPost({action:id?'updateAccount':'addAccount',data:d});await sync(true);toast('✓ บันทึกบัญชีแล้ว')}catch(e){toast('บันทึกบัญชีไม่สำเร็จ')}};
document.querySelectorAll('.cat-tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.cat-tab').forEach(x=>x.classList.remove('on'));b.classList.add('on');$('catList').innerHTML=catRows();bind()});
$('addCat').onclick=()=>{$('cform').reset();$('cid').value='';const b=document.querySelector('.cat-tab.on');$('ctype').value=b?b.dataset.ct:'รายจ่าย';$('cicon').value='📌';$('ctitle').textContent='เพิ่มหมวดหมู่';$('cdel').hidden=true;$('cdlg').showModal()};
$('cclose').onclick=()=>$('cdlg').close();
function editCat(id){const c=S.categories.find(x=>x.id===id);if(!c)return;$('cid').value=id;$('ctype').value=c.type;$('cname').value=c.name;$('cicon').value=c.icon||'📌';$('ctitle').textContent='แก้ไขหมวดหมู่';$('cdel').hidden=false;$('cdlg').showModal()}
$('cform').onsubmit=async e=>{e.preventDefault();const id=$('cid').value,d={id,type:$('ctype').value,name:$('cname').value,icon:$('cicon').value};$('cdlg').close();try{await apiPost({action:id?'updateCategory':'addCategory',data:d});await sync(true);toast('✓ บันทึกหมวดหมู่แล้ว')}catch(e){toast('บันทึกหมวดหมู่ไม่สำเร็จ')}};
$('cdel').onclick=async()=>{const id=$('cid').value;if(!id||!confirm('ลบหมวดหมู่นี้ใช่ไหม? รายการเก่าจะยังอยู่'))return;$('cdlg').close();try{await apiPost({action:'deleteCategory',id});await sync(true);toast('✓ ลบหมวดหมู่แล้ว')}catch(e){toast('ลบหมวดหมู่ไม่สำเร็จ')}};
$('date').textContent=new Date().toLocaleDateString('th-TH',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
loadCache();processQueue();if(!Q.length)sync(false);document.addEventListener('visibilitychange',()=>{if(!document.hidden){processQueue();if(!Q.length)sync(true)}});setInterval(()=>{if(Q.length)processQueue();else sync(true)},15000);
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js');
