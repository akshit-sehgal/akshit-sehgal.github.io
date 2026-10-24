window.renderDeepCourse = function renderDeepCourse(m) {
  const tasks = JSON.parse(localStorage.getItem('flutter-fieldguide:advanced-tasks') || '{}');
  const answers = JSON.parse(localStorage.getItem('flutter-fieldguide:advanced-answers') || '{}');
  const checked = tasks[m.id] || [];
  const answered = answers[m.id] || {};
  const sectionHtml = m.sections.map((s,i) => `<section class="lesson-block deep-section" id="deep-${m.id}-${i}">
    <div class="deep-label">SECTION ${i+1} / ${m.sections.length}</div><h2>${esc(s.title)}</h2>
    <p class="deep-lead">${esc(s.lead)}</p>
    <div class="deep-why"><strong>Why this matters</strong><p>${s.why}</p></div>
    ${(s.paragraphs||[]).map(p=>`<p>${p}</p>`).join('')}
    ${(s.points||[]).length?`<div class="deep-points">${s.points.map(p=>`<div><span>✓</span><p>${p}</p></div>`).join('')}</div>`:''}
    ${(s.codes||[]).map(c=>`<div class="deep-code-label"><strong>${esc(c.title||'Working example')}</strong><p>${esc(c.description||'')}</p></div>${codeBlock(c.source,c.filename||'main.dart',{dartpad:!!c.dartpad})}${c.note?note(c.note,'green'):''}`).join('')}
    ${s.production?note(`<strong>Production consideration:</strong> ${s.production}`,'warn'):''}
    ${s.practice?`<div class="deep-challenge"><b>TRY IT YOURSELF</b><p>${s.practice}</p></div>`:''}
  </section>`).join('');
  const diagram=m.diagram?`<section class="lesson-block"><h2>${esc(m.diagram.title)}</h2><p>${m.diagram.intro}</p>
    <div class="deep-flow">${m.diagram.steps.map((s,i)=>`<button class="deep-flow-step ${i===0?'selected':''}" data-deep-step="${m.id}:${i}" type="button" aria-pressed="${i===0}">
      <span>${i+1}</span><b>${esc(s.name)}</b><small>${esc(s.summary)}</small></button>`).join('<b class="deep-arrow">→</b>')}</div>
    <div class="deep-flow-result" id="deep-flow-${m.id}"><span class="kicker">STAGE 1 / ${m.diagram.steps.length}</span><h3>${esc(m.diagram.steps[0].name)}</h3><p>${m.diagram.steps[0].detail}</p></div>
    <p class="deep-caption">Interactive conceptual diagram — not a running Flutter instance.</p></section>`:'';
  const exerciseHtml=m.exercises.map((t,i)=>`<div class="deep-task ${checked.includes(i)?'done':''}">
    <label><input type="checkbox" data-deep-task="${m.id}:${i}" ${checked.includes(i)?'checked':''}/><span><strong>${esc(t.title)}</strong><small>${esc(t.detail)}</small></span></label>
    <button type="button" data-deep-hint="${m.id}:${i}" aria-expanded="false">Show hint ↓</button>
    <div class="deep-hint" id="deep-hint-${m.id}-${i}" hidden>${t.hint}</div>
  </div>`).join('');
  const quizHtml=m.quiz.map((q,i)=>`<div class="deep-quiz"><h3>${i+1}. ${esc(q.q)}</h3>
    ${q.choices.map((a,j)=>`<label><input type="radio" name="deep-quiz-${m.id}-${i}" data-deep-answer="${m.id}:${i}" value="${j}" ${answered[i]===j?'checked':''}/><span>${esc(a)}</span></label>`).join('')}
    <div class="deep-feedback" id="deep-feedback-${m.id}-${i}" role="status">${answered[i]!==undefined?`<strong>${answered[i]===q.correct?'✓ Correct':'Try again'}</strong> ${esc(q.explanation)}`:''}</div></div>`).join('');
  const project=m.project?`<section class="lesson-block"><span class="kicker">CAPSTONE · MODULE ${m.number}</span><h2>${esc(m.project.title)}</h2><p class="deep-lead">${m.project.brief}</p>
    <div class="deep-milestones">${m.project.steps.map((t,i)=>`<div><b>${i+1}</b><p>${t}</p></div>`).join('')}</div>
    ${m.project.commands?codeBlock(m.project.commands,'Terminal'):''}
    ${m.project.code?codeBlock(m.project.code,'capstone.dart',{dartpad:!!m.project.dartpad}):''}
    ${m.project.verify?note(`<strong>Acceptance criteria:</strong> ${m.project.verify}`,'green'):''}</section>`:'';
  return hero(esc(m.title),esc(m.description),`MODULE ${String(m.number).padStart(2,'0')} · PRODUCTION FLUTTER`,[
    `${m.sections.length} deep dives`,`${m.exercises.length} exercises`,`${m.quiz.length} quiz questions`
  ])+`<div class="chapter-content">
    <div class="deep-objectives"><span class="kicker">LEARNING OUTCOMES</span><div>${m.outcomes.map(x=>`<span>✓ ${esc(x)}</span>`).join('')}</div></div>
    <nav class="deep-toc" aria-label="Module sections"><span class="mini-heading">JUMP TO A SECTION</span><div>${m.sections.map((s,i)=>`<button type="button" data-deep-scroll="deep-${m.id}-${i}"><b>${String(i+1).padStart(2,'0')}</b>${esc(s.title)}</button>`).join('')}</div></nav>
    ${diagram}${sectionHtml}${project}
    <section class="lesson-block"><h2>Hands-on exercises</h2><p>Apply each concept in real Dart or Flutter code. Tick a challenge when you've verified the result.</p>
      <p class="check-stats" id="deep-task-counter-${m.id}">${checked.length} / ${m.exercises.length} challenges complete</p>${exerciseHtml}</section>
    <section class="lesson-block"><h2>Knowledge check</h2><p>Choose an answer to reveal the explanation. Your responses persist in this browser.</p>${quizHtml}</section>
    <section class="lesson-block"><h2>Production readiness checklist</h2><div class="deep-production">${m.production.map(x=>`<div><span>✓</span><section><strong>${esc(x.title)}</strong><p>${x.detail}</p></section></div>`).join('')}</div>
      ${m.references?.length?`<h3>Official documentation and packages</h3><div class="deep-resources">${m.references.map(r=>`<a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.label)} ↗</a>`).join('')}</div>`:''}
    </section>
    ${note('<strong>Running examples:</strong> Pure-Dart and standalone Flutter samples can run in DartPad. Code using third-party packages, device APIs, or widget-test imports requires a local Flutter project. The “Copy + DartPad” button appears only where supported.','green')}
  </div>`;
};
