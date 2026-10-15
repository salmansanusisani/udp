import { initHeroSequence } from './hero-sequence.js?v=13';
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const heroSequence = initHeroSequence({gsap,reduced,onExplore:openHeroPerspective});
$('#copyright-year').textContent = new Date().getFullYear();
const heroType = $('.hero-heading').cloneNode(true);
heroType.classList.add('hero-type-outline');
heroType.setAttribute('aria-hidden','true');
heroType.querySelector('h1').removeAttribute('id');
$('.hero-stage').append(heroType);
// Filled lettering sits behind architecture; a light contour carries only the
// occluded part across the foreground, following the supplied Housen reference.
const architectureType = document.createElement('span');
architectureType.className = 'architecture-type-outline';
architectureType.setAttribute('aria-hidden','true');
architectureType.innerHTML = $('#architecture-title').innerHTML;
$('#architecture-title').setAttribute('aria-label','Look beyond.');
$('.architecture-photo').append(architectureType);
$$('.property-rear-word').forEach(word => {
  const contour=document.createElement('span');
  contour.className='property-type-outline';
  contour.setAttribute('aria-hidden','true');
  contour.innerHTML=word.innerHTML;
  word.parentElement.append(contour);
});

// Native controls remain usable even if the animation library is unavailable.
const menu = $('.menu-toggle');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); $('#mobile-nav').hidden = true; $('#site-header').classList.remove('menu-is-open'); document.body.classList.remove('modal-open'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); $('#mobile-nav').hidden = !open; $('#site-header').classList.toggle('menu-is-open', open); document.body.classList.toggle('modal-open', open); });
$$('#mobile-nav a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

const properties = [
  {title:'The Terrace Residence', location:'MAITAMA / PRESENTATION CONCEPT', kind:'PRIVATE RESIDENCE', image:'residence-aerial.webp', description:'Layered terraces, open-air living and a quiet relationship with the landscape. An architectural direction for those who want light, generous space and a private view.', specs:[['Perspective','Terraced living'],['Character','Light / landscape / privacy'],['Next step','A personalised property brief']]},
  {title:'The Courtyard House', location:'ASOKORO / PRESENTATION CONCEPT', kind:'GARDEN RETREAT', image:'residence-courtyard.webp', description:'Timber, glass and greenery frame a more intimate way to live. A courtyard-inspired direction that brings the outside in and makes room for a slower everyday rhythm.', specs:[['Perspective','Courtyard living'],['Character','Warmth / quiet / connection'],['Next step','Explore your ideal retreat']]},
  {title:'The Glass Residence', location:'JABI / PRESENTATION CONCEPT', kind:'CONTEMPORARY LIVING', image:'residence-glass.webp', description:'A considered interplay of curved forms, generous balconies and expansive glazing. A contemporary architectural direction for a life with a different point of view.', specs:[['Perspective','Contemporary living'],['Character','Form / glazing / open space'],['Next step','Create your residence brief']]}
];
let modalOpener;
function openDialog(dialog, opener) { closeMenu(); modalOpener = opener; dialog.showModal(); document.body.classList.add('modal-open'); }
function closeDialog(dialog) { dialog.close(); }
function openHeroPerspective(p, opener) {
  $('#dialog-image').src=`./assets/${p.photo}`;$('#dialog-image').alt=p.name+' — sourced architectural photograph';
  $('#dialog-location').textContent='ARCHITECTURAL PERSPECTIVE / DESIGN REFERENCE';$('#dialog-kind').textContent=p.caption;
  $('#dialog-title').textContent=p.name;$('#dialog-description').textContent=p.description;
  $('#dialog-specs').replaceChildren();openDialog($('#property-dialog'),opener);
}
[$('#property-dialog'), $('#credits-dialog')].forEach(dialog => { dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); modalOpener?.focus({preventScroll:true}); }); dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } }); });
$$('[data-detail]').forEach(button => button.addEventListener('click', () => { const p = properties[Number(button.dataset.detail)]; $('#dialog-image').src = `./assets/${p.image}`; $('#dialog-image').alt = p.title + ' — sourced architectural photograph'; $('#dialog-location').textContent = p.location; $('#dialog-kind').textContent = p.kind; $('#dialog-title').textContent = p.title; $('#dialog-description').textContent = p.description; $('#dialog-specs').replaceChildren(...p.specs.map(([term,value]) => { const row=document.createElement('div'); const dt=document.createElement('dt'); const dd=document.createElement('dd'); dt.textContent=term; dd.textContent=value; row.append(dt,dd); return row; })); openDialog($('#property-dialog'), button); }));
$('.dialog-close').addEventListener('click', () => closeDialog($('#property-dialog')));
$('#dialog-enquire').addEventListener('click', () => { const title=$('#dialog-title').textContent; modalOpener=null; closeDialog($('#property-dialog')); $('#interest').value='Finding a residence'; $('[name=message]').value=`I’m interested in an architectural direction like ${title}.`; $('#contact').scrollIntoView({behavior:reduced?'instant':'smooth'}); $('[name=name]').focus({preventScroll:true}); });
$('#credits-open').addEventListener('click', e => openDialog($('#credits-dialog'), e.currentTarget));
$('.credits-close').addEventListener('click', () => closeDialog($('#credits-dialog')));
$$('[data-interest]').forEach(a => a.addEventListener('click', () => $('#interest').value=a.dataset.interest));

$$('[data-filter]').forEach(button => button.addEventListener('click', () => { $$('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b===button))); $$('.property-card').forEach(card => card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter); ScrollTrigger?.refresh(); }));
const serviceArt = [ ['residence-aerial.webp','FIND YOUR\nPLACE.'],['residence-glass.webp','SEE THE\nPOSSIBILITY.'],['interior-photograph.webp','SHAPE YOUR\nFUTURE.'] ];
$$('.service').forEach((service,i) => service.addEventListener('toggle', () => { if (!service.open) return; $$('.service').forEach(other => { if (other!==service) other.open=false; }); $('#expertise-image').src=`./assets/${serviceArt[i][0]}`; $('#expertise-image-title').textContent=serviceArt[i][1]; ScrollTrigger?.refresh(); }));
$('#enquiry-form').addEventListener('submit', e => { e.preventDefault(); const form=e.currentTarget; if (!form.reportValidity()) return; const data=Object.fromEntries(new FormData(form)); data.created=new Date().toISOString(); let stored=false; try { const entries=JSON.parse(localStorage.getItem('udp-preview-enquiries')||'[]'); if (!Array.isArray(entries)) throw Error(); localStorage.setItem('udp-preview-enquiries',JSON.stringify([...entries.slice(-9),data])); stored=true; } catch {} const feedback=$('#form-feedback'); feedback.replaceChildren(document.createTextNode(stored?'Your preview enquiry has been saved on this device.':'Your preview enquiry is ready to download.')); const download=document.createElement('button'); download.type='button'; download.className='download-enquiry'; download.textContent='Download a copy ↗'; download.addEventListener('click', () => { const text=`UDP — Preview enquiry\n\nName: ${data.name}\nEmail: ${data.email}\nInterest: ${data.interest}\n\n${data.message}\n\nCreated: ${data.created}\nThis is a local preview. No message was sent.`; const url=URL.createObjectURL(new Blob([text],{type:'text/plain'})); const a=document.createElement('a'); a.href=url; a.download='udp-enquiry.txt'; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000); }); feedback.append(download); form.reset(); });

if (gsap && ScrollTrigger && !reduced) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.set('.hero-brand-transition',{autoAlpha:0,scale:.7,y:60});
  // Animation lives inside a native sticky stage; scrolling remains normal.
  const hero=gsap.timeline({scrollTrigger:{trigger:'.cloud-hero',start:'top top',end:'bottom bottom',scrub:1,onUpdate:self=>{ heroSequence.setProgress(self.progress); const phase=self.progress<.35?0:self.progress<.8?1:2; $('#hero-chapter-label').textContent=['01 / A NEW PERSPECTIVE','02 / THROUGH THE CLOUDS','03 / YOUR NEXT CHAPTER'][phase]; $$('.hero-chapter i').forEach((dot,i)=>dot.style.background=i===phase?'var(--forest)':'#163c2d50'); }}});
  hero.to('.hero-heading',{y:-65,autoAlpha:0,duration:.28,ease:'power1.in'},0)
      .to('.hero-depth',{y:-90,scale:1.18,duration:.36,ease:'none'},0)
      .to('.cloud-layer-front',{yPercent:-9,scale:1.15,duration:.3,ease:'none'},0)
      .to('.cloud-layer-back',{yPercent:-14,scale:1.12,duration:.36,ease:'none'},0)
      .to('.hero-hotspot,.hero-scene-controls',{autoAlpha:0,y:15,duration:.12},.05)
      .fromTo('.cloud-veil',{autoAlpha:0,scale:.8,yPercent:12},{autoAlpha:1,scale:1.18,yPercent:0,duration:.2,ease:'power1.inOut'},.16)
      .to('.hero-depth',{autoAlpha:0,scale:.9,y:-170,duration:.16},.32)
      .to('.hero-brand-transition',{autoAlpha:1,scale:1,y:0,duration:.24},.4)
      .to('.cloud-veil',{autoAlpha:0,yPercent:-32,scale:1.35,duration:.24,ease:'power2.inOut'},.44)
      .to('.cloud-layer-front',{xPercent:-28,yPercent:16,scale:1.22,duration:.3,ease:'none'},.4)
      .to('.cloud-layer-back',{xPercent:22,yPercent:10,duration:.3,ease:'none'},.4)
      .to('.cloud-wisp-left',{xPercent:-35,autoAlpha:.2,duration:.35},.35)
      .to('.cloud-wisp-right',{xPercent:35,autoAlpha:.2,duration:.35},.35)
      .to('.sky-background',{autoAlpha:.15,duration:.3},.4)
      .to('.hero-brand-transition',{scale:1.08,y:-35,duration:.17,ease:'none'},.68)
      .to('.hero-brand-transition',{autoAlpha:0,y:-110,duration:.15},.85)
      .to('.hero-bottom',{autoAlpha:0,y:-25,duration:.15},.8);
  gsap.from('.hero-heading .eyebrow',{y:15,opacity:0,duration:1,delay:.1});
  gsap.from('.hero-heading h1',{y:35,opacity:0,duration:1.2,delay:.15});
  gsap.from('.hero-buildings',{y:45,opacity:0,duration:1.2,delay:.2,ease:'power2.out'});
  gsap.from('.site-header .brand,.desktop-nav,.nav-contact',{y:-15,opacity:0,duration:1,stagger:.1});
  gsap.to('.float-one',{y:-110,rotation:-3,ease:'none',scrollTrigger:{trigger:'.perspective',start:'top bottom',end:'bottom top',scrub:1}});
  gsap.to('.float-two',{y:70,rotation:2,ease:'none',scrollTrigger:{trigger:'.perspective',start:'top bottom',end:'bottom top',scrub:1}});
  gsap.to('.perspective-spark',{rotation:120,ease:'none',scrollTrigger:{trigger:'.perspective',start:'top bottom',end:'bottom top',scrub:1}});
  // Identical source and foreground framing keeps the roofline occlusion exact.
  const architecture=gsap.timeline({scrollTrigger:{trigger:'.architecture-story',start:'top top',end:'bottom bottom',scrub:1}});
  architecture.to('.architecture-background,.architecture-foreground',{scale:1.06,ease:'none',duration:1},0).to('.architecture-photo h2,.architecture-type-outline',{y:16,scale:1,ease:'none',duration:1},0);
  $$('.collection-heading,.expertise-heading,.perspective-bottom,.contact-copy,.enquiry-form,.property-card').forEach(el=>gsap.from(el,{y:45,opacity:0,duration:.9,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
  gsap.fromTo('.interior-frame',{scale:.88,rotationX:7},{scale:1,rotationX:0,ease:'none',scrollTrigger:{trigger:'.interior',start:'top 90%',end:'top 15%',scrub:1}});
  gsap.to('.interior-frame>img',{yPercent:12,ease:'none',scrollTrigger:{trigger:'.interior',start:'top bottom',end:'bottom top',scrub:1}});
  gsap.to('.reading-progress span',{scaleX:1,ease:'none',scrollTrigger:{trigger:document.documentElement,start:0,end:'max',scrub:true}});
  if (fine) {
    const tilt=$('.building-tilt');
    $('.hero-stage').addEventListener('pointermove',e=>{ const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5; gsap.to(tilt,{rotationY:x*9,rotationX:-y*6,x:x*18,y:y*10,duration:1.2,ease:'power2.out'}); });
    $('.hero-stage').addEventListener('pointerleave',()=>gsap.to(tilt,{rotationY:0,rotationX:0,x:0,y:0,duration:1}));
    $$('.depth-card').forEach(card=>{ card.addEventListener('pointermove',e=>{ const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5; gsap.to(card,{rotationY:x*5,rotationX:-y*5,transformPerspective:1000,duration:.6}); }); card.addEventListener('pointerleave',()=>gsap.to(card,{rotationY:0,rotationX:0,duration:.6})); });
    const cursor=$('.custom-cursor'); const xTo=gsap.quickTo(cursor,'x',{duration:.2,ease:'power2.out'}),yTo=gsap.quickTo(cursor,'y',{duration:.2,ease:'power2.out'});
    window.addEventListener('pointermove',e=>{xTo(e.clientX);yTo(e.clientY);});
    $$('.property-scene').forEach(card=>{card.addEventListener('pointerenter',()=>{cursor.classList.add('active');gsap.to(cursor,{scale:1,duration:.2});});card.addEventListener('pointerleave',()=>{cursor.classList.remove('active');gsap.to(cursor,{scale:.3,duration:.2});});});
    $$('.magnetic').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();gsap.to(el,{x:(e.clientX-r.left-r.width/2)*.12,y:(e.clientY-r.top-r.height/2)*.12,duration:.4});});el.addEventListener('pointerleave',()=>gsap.to(el,{x:0,y:0,duration:.5}));});
  }
  document.fonts.ready.then(()=>ScrollTrigger.refresh());
  window.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
}
