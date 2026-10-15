export const heroPerspectives = [
  {name:'The Timber Residence',mask:'hero-timber.webp',photo:'residence-timber.webp',caption:'WARMTH / FORM / CONNECTION',description:'Layered rooflines, warm timber and an open entrance. A photographed architectural direction for a home with a sense of arrival.'},
  {name:'The Stone Residence',mask:'hero-stone.webp',photo:'residence-stone.webp',caption:'STONE / LIGHT / PERSPECTIVE',description:'Quiet stone surfaces, expansive glazing and deep architectural overhangs. A different perspective on contemporary living.'},
  {name:'The Glass Residence',mask:'hero-glass.webp',photo:'residence-glass.webp',caption:'GLASS / CURVES / POSSIBILITY',description:'Curved forms and layered glass balconies open up the view. Architecture that brings light and everyday experience together.'}
];

export function initHeroSequence({gsap,reduced,onExplore}) {
  const stage=document.querySelector('.hero-stage');
  const tilt=stage.querySelector('.building-tilt');
  const frames=document.createElement('div'); frames.className='hero-buildings';
  heroPerspectives.forEach((p,i)=>{const image=document.createElement('img');image.className='hero-building';image.src=`./assets/${p.mask}?v=13`;image.alt=`${p.name} — a sourced architectural photograph isolated against clouds`;image.width=1600;image.height=1000;image.decoding='async';image.dataset.perspective=String(i);image.style.opacity=i===0?'1':'0';image.style.visibility=i===0?'visible':'hidden';frames.append(image);});
  tilt.querySelector('.hero-building').replaceWith(frames);
  stage.querySelectorAll('.cloud-layer').forEach(layer=>{
    const plane=document.createElement('div');plane.className=layer.className;plane.setAttribute('aria-hidden','true');
    const drift=document.createElement('div');drift.className='cloud-drift';
    const image=document.createElement('img');image.src='./assets/cloud-bank.webp?v=13';image.alt='';drift.append(image);plane.append(drift);layer.replaceWith(plane);
  });
  for (const side of ['left','right']) {
    const wisp=document.createElement('div');wisp.className=`cloud-wisp cloud-wisp-${side}`;wisp.setAttribute('aria-hidden','true');
    const drift=document.createElement('div');drift.className='cloud-drift';const image=document.createElement('img');image.src=`./assets/cloud-puff-${side}.webp?v=13`;image.alt='';drift.append(image);wisp.append(drift);stage.append(wisp);
  }
  const veil=document.createElement('div');veil.className='cloud-veil';veil.setAttribute('aria-hidden','true');veil.innerHTML='<img src="./assets/cloud-bank.webp?v=13" alt=""><span></span>';stage.append(veil);
  const controls=document.createElement('div');controls.className='hero-scene-controls';controls.setAttribute('role','group');controls.setAttribute('aria-label','Architectural perspectives');
  controls.innerHTML='<div class="scene-meta"><span class="scene-number">01 / 03</span><span class="scene-name">THE TIMBER RESIDENCE</span></div><div class="scene-actions"><button class="scene-previous" aria-label="Previous building">←</button><div class="scene-choices"></div><button class="scene-next" aria-label="Next building">→</button><button class="scene-play" aria-label="Pause building sequence">Ⅱ</button></div><span class="scene-countdown" aria-hidden="true"></span>';
  const choices=controls.querySelector('.scene-choices');
  heroPerspectives.forEach((p,i)=>{const b=document.createElement('button');b.className='scene-choice';b.setAttribute('aria-label',`Show ${p.name}`);b.setAttribute('aria-pressed',String(i===0));b.innerHTML=`<img src="./assets/${p.photo}" alt="" width="80" height="52">`;b.addEventListener('click',()=>select(i,true));choices.append(b);});
  stage.append(controls);
  const hotspot=stage.querySelector('.hero-hotspot');hotspot.removeAttribute('data-detail');hotspot.setAttribute('aria-label','Explore this architectural perspective');hotspot.addEventListener('click',()=>onExplore(heroPerspectives[index],hotspot));
  let index=0, timer=null, progress=0, visible=true, focused=false, autoplay=!reduced, countdown=null, transition=null;
  const photos=[...frames.children]; const ambient=[]; const play=controls.querySelector('.scene-play');
  play.disabled=reduced;
  const allowed=()=>autoplay&&!reduced&&visible&&!document.hidden&&progress<.18&&!focused;
  function schedule(){
    clearTimeout(timer);countdown?.kill();
    stage.dataset.autoplay=allowed()?'running':'paused';
    play.textContent=reduced?'—':autoplay?'Ⅱ':'▶';play.setAttribute('aria-label',reduced?'Automatic changes disabled for reduced motion':autoplay?'Pause building sequence':'Play building sequence');
    const line=controls.querySelector('.scene-countdown');line.style.transform='scaleX(0)';
    if(!allowed())return;
    if(gsap)countdown=gsap.to(line,{scaleX:1,duration:6.5,ease:'none'});
    timer=setTimeout(()=>{if(!document.querySelector('dialog[open]')&&document.querySelector('.menu-toggle').getAttribute('aria-expanded')!=='true')select((index+1)%photos.length);else schedule();},6500);
  }
  function select(next,manual=false){
    next=(next+photos.length)%photos.length;if(manual)autoplay=false;
    if(next===index){schedule();return;}
    transition?.kill();
    const previous=index;index=next;
    stage.dataset.currentPerspective=String(index);
    controls.querySelector('.scene-number').textContent=`0${index+1} / 03`;
    controls.querySelector('.scene-name').textContent=heroPerspectives[index].name.toUpperCase();
    [...choices.children].forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));
    stage.querySelector('.image-word').style.backgroundImage=`url('./assets/${heroPerspectives[index].photo}')`;
    hotspot.querySelector('.hotspot-label').innerHTML=`A DIFFERENT PERSPECTIVE<small>${heroPerspectives[index].name}</small>`;
    if(gsap&&!reduced){
      photos.forEach((p,i)=>{if(i!==previous&&i!==index)gsap.set(p,{autoAlpha:0});});
      transition=gsap.timeline().to(photos[previous],{autoAlpha:0,xPercent:-7,scale:1.02,duration:1.1,ease:'power2.inOut'},0).fromTo(photos[index],{autoAlpha:0,xPercent:8,yPercent:3,scale:.95},{autoAlpha:1,xPercent:0,yPercent:0,scale:1,duration:1.4,ease:'power2.out'},.1);
    }else photos.forEach((p,i)=>{p.style.opacity=i===index?'1':'0';p.style.visibility=i===index?'visible':'hidden';});
    schedule();
  }
  controls.querySelector('.scene-next').addEventListener('click',()=>select(index+1,true));
  controls.querySelector('.scene-previous').addEventListener('click',()=>select(index-1,true));
  play.addEventListener('click',()=>{autoplay=!autoplay;focused=false;schedule();});
  controls.addEventListener('focusin',e=>{focused=e.target!==play;schedule();});
  controls.addEventListener('focusout',e=>{if(!controls.contains(e.relatedTarget)){focused=false;schedule();}});
  controls.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();select(index+(e.key==='ArrowRight'?1:-1),true);}});
  stage.dataset.currentPerspective='0';stage.querySelector('.image-word').style.backgroundImage="url('./assets/residence-timber.webp')";
  if(gsap&&!reduced){
    ambient.push(gsap.to('.cloud-layer-front .cloud-drift',{xPercent:4,yPercent:-1.5,scale:1.03,duration:16,repeat:-1,yoyo:true,ease:'sine.inOut'}));
    ambient.push(gsap.to('.cloud-layer-back .cloud-drift',{xPercent:-6,yPercent:2,duration:21,repeat:-1,yoyo:true,ease:'sine.inOut'}));
    ambient.push(gsap.to('.cloud-wisp-left .cloud-drift',{xPercent:12,yPercent:4,duration:18,repeat:-1,yoyo:true,ease:'sine.inOut'}));
    ambient.push(gsap.to('.cloud-wisp-right .cloud-drift',{xPercent:-12,yPercent:-3,duration:23,repeat:-1,yoyo:true,ease:'sine.inOut'}));
  }
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;ambient.forEach(t=>visible&&!document.hidden?t.play():t.pause());schedule();},{threshold:0});observer.observe(stage);
  document.addEventListener('visibilitychange',()=>{ambient.forEach(t=>visible&&!document.hidden?t.play():t.pause());schedule();});
  window.addEventListener('pagehide',()=>{clearTimeout(timer);ambient.forEach(t=>t.pause());});
  window.addEventListener('pageshow',()=>{ambient.forEach(t=>visible&&!document.hidden?t.play():t.pause());schedule();});
  schedule();
  return {setProgress(value){const was=progress<.18;progress=value;if(was!==(progress<.18))schedule();}};
}
