
(function(){
 var B = window.BIZ;
 /* open-now signal, America/Phoenix */
 function phxNow(){ return new Date(new Date().toLocaleString('en-US',{timeZone:'America/Phoenix'})); }
 function fmt(mins){ var h=Math.floor(mins/60), m=mins%60, ap=h>=12?'PM':'AM'; h=h%12; if(h===0)h=12; return h+(m?(':'+String(m).padStart(2,'0')):'')+' '+ap; }
 function status(){
   var now = phxNow(), day = now.getDay(), cur = now.getHours()*60+now.getMinutes();
   var sessions = B.hours[day]||[];
   for (var i=0;i<sessions.length;i++){ if (cur>=sessions[i][0]&&cur<sessions[i][1]) return {open:true,text:'Open now · Closes '+fmt(sessions[i][1])+' · Front desk books 24/7'}; }
   for (var d=0; d<8; d++){ var dd=(day+d)%7, ss=B.hours[dd]||[];
     for (var j=0;j<ss.length;j++){ if (d===0&&ss[j][0]<=cur) continue;
       var when = d===0?'today':(d===1?'tomorrow':['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][dd]);
       return {open:false,text:'Salon closed · Opens '+fmt(ss[j][0])+' '+when+' · Front desk books 24/7'}; } }
   return {open:false,text:'Front desk books 24/7'};
 }
 var st = status(), dot=document.getElementById('statusDot'), txt=document.getElementById('statusText');
 if (dot&&txt){ dot.className='dot '+(st.open?'open':'closed'); txt.textContent=st.text; }
 var dayNames=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
 var rows=document.querySelectorAll('#hoursTable tr');
 rows.forEach(function(r){ if (r.getAttribute('data-day')===dayNames[phxNow().getDay()]) r.className='today'; });
 /* hero chip parity */
 /* simulation */
 var msgs=[].slice.call(document.querySelectorAll('#simMsgs .msg')), done=document.getElementById('simDone'), timers=[];
 function playSim(){ timers.forEach(clearTimeout); timers=[];
   msgs.forEach(function(m){m.classList.remove('show')}); if(done)done.classList.remove('show');
   msgs.forEach(function(m,i){ timers.push(setTimeout(function(){ m.classList.add('show'); if(i===msgs.length-1&&done) timers.push(setTimeout(function(){done.classList.add('show')},500)); }, 650*(i+1))); });
 }
 var rp=document.getElementById('simReplay'); if(rp) rp.addEventListener('click',playSim);
 var played=false;
 if ('IntersectionObserver' in window){ var io=new IntersectionObserver(function(e){ if(e[0].isIntersecting&&!played){ played=true; playSim(); io.disconnect(); } },{threshold:.3});
   var ph=document.querySelector('.phone'); if(ph) io.observe(ph); } else { playSim(); }
 /* forms */
 var cf=document.getElementById('contactForm');
 if (cf) cf.addEventListener('submit', function(ev){ ev.preventDefault();
   var note=document.getElementById('contactNote');
   var payload={access_key:'b9f27151-7eb3-4f7d-8809-85e49c76f481', subject:'Website callback request — '+B.name,
     name:document.getElementById('c-name').value, phone:document.getElementById('c-phone').value,
     email:document.getElementById('c-email').value, preferred_time:document.getElementById('c-when').value,
     message:document.getElementById('c-msg').value, from_site:B.name+' concept demo'};
   fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(payload)})
   .then(function(r){return r.json()}).then(function(j){ if(j.success){ cf.style.display='none'; document.getElementById('contactOk').classList.add('show'); }
     else { note.textContent='That did not go through — please call '+B.phone+'.'; } })
   .catch(function(){ note.textContent='That did not go through — please call '+B.phone+'.'; });
 });
 var bf=document.getElementById('bookForm');
 if (bf) bf.addEventListener('submit', function(ev){ ev.preventDefault(); bf.style.display='none'; document.getElementById('bookOk').classList.add('show'); });
 /* chat */
 var panel=document.getElementById('chatPanel'), openBtn=document.getElementById('chatOpen'),
     body=document.getElementById('cpBody'), quick=document.getElementById('cpQuick'),
     greet=document.getElementById('cpGreeting');
 if (greet) greet.textContent='Hi, this is the front desk at '+B.short+'. I can help with hours, services, directions, or take a booking request right now — day or night. What can I do for you?';
 function addMsg(text, me){ var d=document.createElement('div'); d.className='cp-msg'+(me?' me':''); d.textContent=text; body.appendChild(d); body.scrollTop=body.scrollHeight; }
 var topics=[['Book a visit','book'],['Hours','hours'],['Services','services'],['Where are you?','location'],['Prices','price']];
 topics.forEach(function(t){ var btn=document.createElement('button'); btn.type='button'; btn.textContent=t[0];
   btn.addEventListener('click',function(){ addMsg(t[0],true); setTimeout(function(){ addMsg(B.kb[t[1]]); },350); }); quick.appendChild(btn); });
 if (openBtn) openBtn.addEventListener('click',function(){ panel.classList.toggle('open'); });
})();
