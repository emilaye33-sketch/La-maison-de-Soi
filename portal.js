/* La Maison de Soi — ouverture du portail, version guidée. */
(() => {
  const rootId = 'portal';
  const feelings = ['De l’enthousiasme','De l’espoir','De l’appréhension','De la curiosité','De la fatigue','De la méfiance','De la tristesse','Rien de particulier'];
  const wishes = ['Me sentir plus libre','Croire davantage en mes possibilités','Retrouver mon élan','Me sentir plus légère','Oser être pleinement moi','Créer une vie qui me ressemble'];
  const safe = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const defaultPortal = {feelings:[], feelingOther:'', wishes:[], wishOther:'', words:'', completed:false};
  let draft = {...defaultPortal, ...(state.portal || {})};
  if(!Array.isArray(draft.feelings)) draft.feelings=[];
  if(!Array.isArray(draft.wishes)) draft.wishes=[];
  let step = draft.completed ? 3 : 0;
  const css = document.createElement('style');
  css.textContent = '.portal-panel{margin:24px 0;padding:clamp(20px,4vw,36px);border:1px solid #efdbe1;border-radius:22px;background:linear-gradient(145deg,#fffdfb,#fff4f7);box-shadow:0 10px 35px #b7768d12}.portal-panel h2{font:normal clamp(26px,4vw,36px)/1.2 Georgia,serif;margin:10px 0 16px}.portal-intro{font:italic 19px/1.55 Georgia,serif;color:#80586b}.portal-choices{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin:18px 0}.portal-choice{display:flex;gap:10px;align-items:center;border:1px solid #ebd6dd;border-radius:13px;padding:13px;background:white;cursor:pointer}.portal-choice:has(input:checked){border-color:#b7768d;background:#fceef2}.portal-choice input{accent-color:#b7768d}.portal-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:22px}.portal-panel textarea,.portal-panel input[type=text]{width:100%;border:1px solid #e4cdd5;border-radius:12px;background:white;padding:12px;font:inherit}.portal-panel textarea{min-height:100px}.portal-status{min-height:1.3em;color:#9c4560}.portal-recap{background:white;border:1px solid #efdce3;border-radius:15px;padding:20px;margin:18px 0}.portal-panel .progress{margin:16px 0 22px}.portal-panel .progress .bar{background:#b7768d}.portal-panel .tiny{line-height:1.5}';
  document.head.appendChild(css);
  function persist(){state.portal={...draft};save();}
  function choices(items,key){
    return '<div class="portal-choices">'+items.map(label => '<label class="portal-choice"><input type="checkbox" data-choice="'+key+'" value="'+safe(label)+'" '+(draft[key].includes(label)?'checked':'')+'><span>'+safe(label)+'</span></label>').join('')+'</div>';
  }
  function list(items,other){
    const values=[...items,...(other.trim()?[other.trim()]:[])];
    return values.length ? values.map(safe).join(' · ') : 'Pas encore défini';
  }
  function draw(){
    const root=document.getElementById(rootId);
    if(!root)return;
    let body='';
    if(step===0)body='<h2>Bienvenue dans ta Maison de Soi</h2><p class="portal-intro">Ici, tu n’as rien à prouver, rien à réussir, et aucune version idéale de toi à jouer.</p><p>Cette maison est un lieu pour explorer ce que tu désires manifester, découvrir ce qui te retient parfois et construire, à ton rythme, une vie qui te ressemble.</p><p>Nous ne te promettons pas un déclic à chaque visite. Nous t’invitons à vivre une expérience, à observer ce qu’elle t’apporte et à avancer sans te juger.</p><p><b>Pour commencer, prends simplement un instant pour toi.</b></p>';
    if(step===1)body='<h2>Comment arrives-tu aujourd’hui ?</h2><p>Plusieurs émotions peuvent coexister, même contradictoires. Tu peux aussi ne rien ressentir de particulier.</p>'+choices(feelings,'feelings')+'<div class="field"><label for="portal-feeling-other">Un autre ressenti, avec tes mots (facultatif)</label><input type="text" id="portal-feeling-other" data-field="feelingOther" value="'+safe(draft.feelingOther)+'" placeholder="Ce qui me traverse…"></div>';
    if(step===2)body='<h2>Qu’aimerais-tu ouvrir dans ta vie ?</h2><p>Pas besoin de savoir comment y parvenir. Choisis ce qui résonne en toi aujourd’hui, sans te limiter à une seule envie.</p>'+choices(wishes,'wishes')+'<div class="field"><label for="portal-wish-other">Une autre envie (facultatif)</label><input type="text" id="portal-wish-other" data-field="wishOther" value="'+safe(draft.wishOther)+'" placeholder="Ce que j’aimerais m’autoriser…"></div><div class="field"><label for="portal-words">Si cette maison pouvait t’apporter une chose, ce serait… (facultatif)</label><textarea id="portal-words" data-field="words" placeholder="Tes mots, sans chercher une belle formule…">'+safe(draft.words)+'</textarea></div>';
    if(step===3)body='<h2>Ta porte est ouverte ✨</h2><p>Tu arrives avec tes propres émotions, tes envies et ton histoire. Elles ont toutes leur place ici.</p><div class="portal-recap"><p><b>Ce que tu ressens :</b> '+list(draft.feelings,draft.feelingOther)+'</p><p><b>Ce que tu souhaites accueillir :</b> '+list(draft.wishes,draft.wishOther)+'</p>'+(draft.words.trim()?'<p><b>Avec tes mots :</b> '+safe(draft.words)+'</p>':'')+'</div><p class="portal-intro">Tu n’as pas besoin d’être déjà devenue cette femme pour commencer à lui faire une place.</p><p>Ce premier instant est enregistré dans ton parcours. La suite t’attend dans les autres pièces de ta maison.</p><p class="tiny muted">Cette étape n’affirme pas qu’un blocage a disparu. Tu pourras revenir sur tes ressentis et les faire évoluer.</p>';
    root.innerHTML='<section class="portal-panel" aria-label="L’Ouverture du Portail"><p class="eyebrow">L’Ouverture du Portail · '+(step===3?'Ton accueil':'Étape '+(step+1)+' sur 3')+'</p><div class="progress"><div class="bar" style="width:'+((step+1)*25)+'%"></div></div>'+body+'<p class="portal-status" role="status"></p><div class="portal-actions">'+(step>0&&step<3?'<button type="button" class="btn ghost" data-back>← Retour</button>':'')+(step<3?'<button type="button" class="btn" data-next>'+(step===0?'Entrer dans ma maison':step===2?'Ouvrir ma porte':'Continuer')+' →</button>':'<button type="button" class="btn secondary" data-revisit>Revenir sur mes ressentis</button><button type="button" class="btn ghost" data-path>Explorer mon parcours →</button>')+'</div></section>';
    root.querySelectorAll('[data-choice]').forEach(input=>input.addEventListener('change',()=>{
      const key=input.dataset.choice;
      draft[key]=Array.from(root.querySelectorAll('[data-choice="'+key+'"]:checked'),x=>x.value);
      persist();
    }));
    root.querySelectorAll('[data-field]').forEach(input=>input.addEventListener('input',()=>{draft[input.dataset.field]=input.value;persist();}));
    root.querySelector('[data-next]')?.addEventListener('click',()=>{
      if(step===2){draft.completed=true;persist();}
      step++;draw();root.scrollIntoView({block:'start',behavior:'smooth'});
    });
    root.querySelector('[data-back]')?.addEventListener('click',()=>{step--;draw();});
    root.querySelector('[data-revisit]')?.addEventListener('click',()=>{step=1;draw();});
    root.querySelector('[data-path]')?.addEventListener('click',()=>nav('modules'));
  }
  const originalRender=window.render;
  window.render=function(){originalRender();draw();};
  draw();
})();
