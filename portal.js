/* Module d’ouverture : brouillon local, sans modification des données existantes. */
(() => {
  const domains = [['home','Ma maison'],['work','Mon travail et ma liberté'],['money','Mon rapport à l’argent'],['love','Ma vie amoureuse'],['body','Mon corps et mon bien-être']];
  const fears = [['failure','La peur d’échouer'],['lack','La peur de manquer'],['judgment','Le regard des autres'],['guilt','La culpabilité de penser à moi'],['start','Je ne sais pas par où commencer'],['other','Autre chose']];
  let draft = { domains: [], fears: [], other: '', priority: '', permission: '', action: '', when: '' };
  let step = 0;
  const e = escapeHtml;
  const css = document.createElement('style');
  css.textContent = '.portal-choices{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px;margin:20px 0}.portal-choice{display:flex;gap:10px;align-items:center;padding:18px;border:1px solid #d8c6c1;border-radius:14px;background:#fffefa;cursor:pointer}.portal-choice:has(input:checked){background:#f4e5e3;border-color:#986c78}.portal-choice input{accent-color:#986c78}.portal-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}.portal-panel{border:1px solid #decac5;border-radius:18px;padding:24px;background:#fffcf9;margin:24px 0}.portal-panel h2{font:normal 27px Georgia,serif}.portal-panel .progress .bar{background:#986c78}.portal-panel li{margin:10px 0}.portal-panel input[type=datetime-local]{padding:12px;font:inherit;max-width:100%;border:1px solid #d8c6c1;border-radius:10px}';
  document.head.appendChild(css);
  function choices(items, key) {
    return `<div class="portal-choices">${items.map(([id,label]) => `<label class="portal-choice"><input type="checkbox" data-choice="${key}" value="${id}" ${draft[key].includes(id)?'checked':''}><span>${e(label)}</span></label>`).join('')}</div>`;
  }
  function guidance(d) {
    const f = new Set(d.fears), out = [];
    if(f.has('failure') && f.has('guilt')) out.push('Tu peux craindre de te tromper tout en ayant du mal à te donner du temps. Choisis un essai pour toi, court et réversible. Complète : « Je peux essayer… pendant dix minutes, sans avoir à réussir du premier coup. »');
    else {
      if(f.has('failure')) out.push('Réduis l’enjeu : quel essai pourrais-tu faire sans devoir réussir tout le projet ? Écris ce qui rendrait cet essai acceptable.');
      if(f.has('guilt')) out.push('Accorde-toi une permission précise : « Je m’autorise à… ». Tu peux commencer par un petit moment pour toi, sans devoir le mériter.');
    }
    if(f.has('lack')) out.push('Distingue ton envie de son coût : quel premier pas gratuit peux-tu faire ? Si une dépense est nécessaire, commence par vérifier le montant disponible.');
    if(f.has('judgment')) out.push('Tu choisis ce que tu partages : quelle première action pourrais-tu essayer dans un cadre où tu te sens à l’aise ?');
    if(f.has('start')) out.push('Tu n’as pas à tout commencer : sélectionne une priorité parmi tes portes, puis une action qui prend moins de quinze minutes.');
    if(f.has('lack') && f.has('guilt')) out.push('Pour ces deux freins ensemble, cherche un geste pour toi qui respecte tes moyens : prendre soin de toi peut aussi être gratuit.');
    if(f.has('other')) out.push('Pour ton frein personnel, demande-toi : de quoi aurais-je besoin pour rendre un premier essai possible ?');
    return out;
  }
  // Exposé pour vérifier les règles de combinaison sans lancer un navigateur.
  window.portalGuidance = guidance;
  function draw() {
    const root = document.getElementById('portal'); if(!root) return;
    let body = '';
    if(step===0) body = `<h2>Quelles portes souhaites-tu ouvrir ?</h2><p>Choisis les espaces de ta vie que tu veux explorer. Plusieurs réponses possibles.</p>${choices(domains,'domains')}`;
    if(step===1) body = `<h2>Qu’est-ce qui te retient aujourd’hui ?</h2><p>Plusieurs réponses possibles. Tu peux aussi continuer sans sélectionner de frein.</p>${choices(fears,'fears')}<div class="field" ${draft.fears.includes('other')?'':'hidden'}><label for="portal-other">Avec tes mots</label><textarea id="portal-other" data-field="other">${e(draft.other)}</textarea></div>`;
    if(step===2) body = `<h2>Ta clé pour avancer</h2><p>Voici des pistes à essayer à partir de tes choix. Garde celles qui te parlent.</p>${draft.fears.length?`<ul>${guidance(draft).map(t=>`<li>${e(t)}</li>`).join('')}</ul>`:'<p>Aucun frein sélectionné : pars de ce qui te donne envie et transforme-le en un premier geste accessible.</p>'}${draft.other?`<p><b>Ton autre frein :</b> ${e(draft.other)}</p>`:''}<div class="field"><label for="portal-priority">La porte que je choisis d’ouvrir en premier</label><select id="portal-priority" data-field="priority">${domains.filter(([id])=>draft.domains.includes(id)).map(([id,label])=>`<option value="${id}" ${draft.priority===id?'selected':''}>${e(label)}</option>`).join('')}</select></div>`;
    if(step===3) body = `<h2>Mon premier pas</h2><div class="field"><label for="portal-permission">Cette semaine, je m’autorise à…</label><textarea id="portal-permission" data-field="permission">${e(draft.permission)}</textarea></div><div class="field"><label for="portal-action">Mon action concrète, petite et réalisable</label><textarea id="portal-action" data-field="action" placeholder="Par exemple : consacrer dix minutes à préciser mon projet.">${e(draft.action)}</textarea></div><div class="field"><label for="portal-when">Quand est-ce que je choisis de la faire ?</label><input type="datetime-local" id="portal-when" data-field="when" value="${e(draft.when)}"></div>`;
    if(step===4) body = `<h2>Ta porte est entrouverte ✨</h2><p><b>Ma priorité :</b> ${e(domains.find(([id])=>id===draft.priority)?.[1]||'')}</p><p><b>Je m’autorise à :</b> ${e(draft.permission)}</p><p><b>Mon premier pas :</b> ${e(draft.action)}</p><p><b>Le moment choisi :</b> ${e(draft.when.replace('T',' à '))}</p><p class="tiny muted">Ce brouillon reste disponible pendant cette session. Il ne coche aucune étape à ta place. Tu peux enregistrer ce récapitulatif dans ton carnet.</p><button class="btn secondary" data-record>Enregistrer dans mon carnet</button>`;
    root.innerHTML = `<section class="portal-panel" aria-label="Mon ouverture du portail"><p class="eyebrow">Mon ouverture · Étape ${step+1} sur 5</p><div class="progress"><div class="bar" style="width:${(step+1)*20}%"></div></div>${body}<p role="status" id="portal-error"></p><div class="portal-actions">${step?'<button class="btn ghost" data-back>← Revenir</button>':''}${step<4?'<button class="btn" data-next>Continuer →</button>':'<button class="btn ghost" data-restart>Reprendre mes choix</button>'}</div></section>`;
    root.querySelectorAll('[data-choice]').forEach(input => input.onchange = () => {
      const key=input.dataset.choice; draft[key]=Array.from(root.querySelectorAll(`[data-choice="${key}"]:checked`),x=>x.value);
      if(!draft.domains.includes(draft.priority)) draft.priority=draft.domains[0]||'';
      if(key==='fears') draw();
    });
    root.querySelectorAll('[data-field]').forEach(input => input.oninput = () => {draft[input.dataset.field]=input.value;});
    root.querySelector('[data-next]')?.addEventListener('click',()=>{
      let error = step===0&&!draft.domains.length?'Choisis au moins une porte pour continuer.':step===3&&(!draft.permission.trim()||!draft.action.trim()||!draft.when)?'Complète ta permission, ton action et le moment choisi pour créer ton récapitulatif.':'';
      if(error){root.querySelector('#portal-error').textContent=error;return;}
      step++;draw();root.scrollIntoView({block:'start',behavior:'smooth'});
    });
    root.querySelector('[data-back]')?.addEventListener('click',()=>{step--;draw();});
    root.querySelector('[data-restart]')?.addEventListener('click',()=>{step=0;draw();});
    root.querySelector('[data-record]')?.addEventListener('click',function(){
      const text=`Mon ouverture du portail\nMa priorité : ${domains.find(([id])=>id===draft.priority)?.[1]}\nMes freins : ${fears.filter(([id])=>draft.fears.includes(id)).map(x=>x[1]).join(', ')||'Aucun sélectionné'}${draft.other?'\nAvec mes mots : '+draft.other:''}\nJe m’autorise à : ${draft.permission}\nMon premier pas : ${draft.action}\nQuand : ${draft.when.replace('T',' à ')}`;
      state.journal.unshift({kind:'Mon ouverture du portail',text,date:new Date().toLocaleDateString('fr-FR')});save();this.disabled=true;this.textContent='Récapitulatif ajouté au carnet ✓';
    });
  }
  const original = window.render;
  window.render = function(){original();draw();};
  draw();
})();
