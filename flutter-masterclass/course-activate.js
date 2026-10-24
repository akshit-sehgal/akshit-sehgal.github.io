(function activateFieldguide(){
 const modules=window.FIELDGUIDE_MODULES||[];
 if(!modules.length)return;
 const ids=new Map(modules.map(m=>[m.id,m]));
 const navOriginal=renderNavigation,overviewOriginal=renderer.overview;
 for(const m of modules){
   const section={id:m.id,title:`Module ${m.number}: ${m.title}`,short:m.subtitle,minutes:m.minutes};
   SECTIONS.splice(SECTIONS.length-1,0,section);
   TRACKED.push(section);
   renderer[m.id]=()=>window.renderDeepCourse(m);
 }
 renderNavigation=function(query=''){
   navOriginal(query);
   const q=query.trim().toLowerCase();
   const matches=modules.filter(m=>!q||(`${m.number} ${m.title} ${m.subtitle} `+m.sections.map(s=>s.title).join(' ')).toLowerCase().includes(q));
   const items=matches.map(m=>`<a class="nav-link ${state.active===m.id?'active':''} ${state.completed.includes(m.id)?'done':''}" href="#/${m.id}" ${state.active===m.id?'aria-current="page"':''}><span class="nav-num">${String(m.number).padStart(2,'0')}</span><span class="nav-link-title">${esc(m.title)}</span><span class="nav-minutes">${state.completed.includes(m.id)?'✓':m.minutes+'m'}</span></a>`).join('');
   const divider=$('#lesson-nav .nav-divider');
   if(divider)divider.insertAdjacentHTML('beforebegin',`<div class="nav-divider"></div><div class="nav-group-label">MODULES 02–12 · DEEP DIVES</div>${items}`);
   if(matches.length)$('#lesson-nav .nav-empty')?.remove();
   const first=$('#lesson-nav .nav-group-label');if(first)first.textContent='MODULE 01 · FOUNDATIONS';
 };
 renderer.roadmap=function(){
   const links=MODULES.map(([name,description,project],i)=>{
     const id=i===0?'mental-model':modules.find(m=>m.number===i+1)?.id;
     return `<article class="roadmap-card"><span class="roadmap-number">MODULE ${String(i+1).padStart(2,'0')}</span><h3>${esc(name)}</h3><p>${esc(description)}</p><div style="font-size:11px;color:var(--muted)">PROJECT · ${esc(project)}</div><footer><span class="status-pill ${id?'available':''}">${id?'Available':'Coming soon'}</span>${id?`<a class="btn-link" href="#/${id}">Open module →</a>`:''}</footer></article>`;
   }).join('');
   return `<div class="overview-hero"><div><span class="kicker">YOUR PATH TO PRODUCTION</span><h1>From first widget<br>to release-ready.</h1><p>A progressive Flutter curriculum with interactive concepts, substantial Dart code, and engineering practices for real products.</p><div class="hero-chips"><span class="chip">${modules.length+1} modules published</span><span class="chip">12 modules in the curriculum</span></div></div><div class="overview-mark" aria-hidden="true">12</div></div><div class="overview-section-heading" style="margin-top:32px"><h2>The complete curriculum</h2></div><div class="roadmap-grid">${links}</div>`;
 };
 renderer.overview=function(){
   const extra=`<section class="overview-section"><div class="overview-section-heading"><h2>Go beyond the fundamentals</h2><span class="chip accent">${modules.length} published advanced modules</span></div><div class="roadmap-grid">${modules.map(m=>`<article class="roadmap-card"><span class="roadmap-number">MODULE ${String(m.number).padStart(2,'0')}</span><h3>${esc(m.title)}</h3><p>${esc(m.subtitle)}</p><footer><span class="status-pill available">${state.completed.includes(m.id)?'Completed':'Available'}</span><a class="btn-link" href="#/${m.id}">Study module →</a></footer></article>`).join('')}</div></section>`;
   return overviewOriginal().replace('<section class="overview-section"><div class="overview-section-heading"><h2>Your lesson 1 journey</h2>',extra+'<section class="overview-section"><div class="overview-section-heading"><h2>Your lesson 1 journey</h2>')
     .replace('Lesson 1 available now',`${modules.length+1} published modules`);
 };
 const getJson=(key)=>{try{return JSON.parse(localStorage.getItem('flutter-fieldguide:'+key)||'{}')}catch{return{}}};
 const persist=(key,v)=>{try{localStorage.setItem('flutter-fieldguide:'+key,JSON.stringify(v))}catch{}};
 document.addEventListener('click',e=>{
   const b=e.target.closest('button');if(!b)return;
   if(b.dataset.deepScroll){document.getElementById(b.dataset.deepScroll)?.scrollIntoView({behavior:'smooth',block:'start'});return;}
   if(b.dataset.deepStep){
     const [id,index]=b.dataset.deepStep.split(':'),m=ids.get(id),idx=Number(index),step=m?.diagram?.steps[idx];
     if(!step)return;
     const box=document.getElementById('deep-flow-'+id);
     if(box)box.innerHTML=`<span class="kicker">STAGE ${idx+1} / ${m.diagram.steps.length}</span><h3>${esc(step.name)}</h3><p>${step.detail}</p>`;
     document.querySelectorAll('[data-deep-step]').forEach(el=>{if(el.dataset.deepStep.startsWith(id+':')){const yes=el===b;el.classList.toggle('selected',yes);el.setAttribute('aria-pressed',yes?'true':'false');}});return;
   }
   if(b.dataset.deepHint){
     const [id,i]=b.dataset.deepHint.split(':'),el=document.getElementById(`deep-hint-${id}-${i}`);
     if(!el)return;el.hidden=!el.hidden;b.textContent=el.hidden?'Show hint ↓':'Hide hint ↑';b.setAttribute('aria-expanded',String(!el.hidden));return;
   }
 });
 document.addEventListener('change',e=>{
   const target=e.target;
   if(target.dataset.deepTask){
     const [id,index]=target.dataset.deepTask.split(':'),i=Number(index),storage=getJson('advanced-tasks'),done=storage[id]||[];
     storage[id]=target.checked?[...new Set([...done,i])]:done.filter(x=>x!==i);
     persist('advanced-tasks',storage);
     target.closest('.deep-task')?.classList.toggle('done',target.checked);
     const el=document.getElementById('deep-task-counter-'+id);if(el)el.textContent=`${storage[id].length} / ${ids.get(id).exercises.length} challenges complete`;
   }
   if(target.dataset.deepAnswer){
     const [id,index]=target.dataset.deepAnswer.split(':'),m=ids.get(id),i=Number(index),q=m?.quiz?.[i];if(!q)return;
     const answers=getJson('advanced-answers');answers[id]??={};answers[id][i]=Number(target.value);persist('advanced-answers',answers);
     const el=document.getElementById(`deep-feedback-${id}-${i}`);
     if(el)el.innerHTML=`<strong>${Number(target.value)===q.correct?'✓ Correct':'Try again'}</strong> ${esc(q.explanation)}`;
   }
 });
 render();
})();
