/* Site-wide motion layer */
(function(){
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var fine=window.matchMedia&&matchMedia('(pointer: fine)').matches;
var SS={get:function(k){try{return sessionStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{sessionStorage.setItem(k,v)}catch(e){}},del:function(k){try{sessionStorage.removeItem(k)}catch(e){}}};

/* ---- smooth scroll ---- */
var lenis=null;
if(!reduce&&window.Lenis){
  try{
    lenis=new Lenis({duration:1.15,easing:function(t){return Math.min(1,1.001-Math.pow(2,-10*t))},smoothWheel:true});
    (function raf(t){lenis.raf(t);requestAnimationFrame(raf)})(performance.now());
    document.addEventListener('click',function(e){
      var a=e.target.closest('a[href^="#"]');if(!a)return;var id=a.getAttribute('href');if(id.length<2)return;
      var el=document.querySelector(id);if(el){e.preventDefault();lenis.scrollTo(el,{offset:-90})}
    });
  }catch(e){lenis=null}
}
window.SidFX={lenis:lenis,reduce:reduce,fine:fine};

/* ---- page wipe ---- */
var pt=document.createElement('div');pt.className='pt';pt.setAttribute('aria-hidden','true');pt.innerHTML='<b>Siddhant</b>';
document.body.appendChild(pt);
if(!reduce&&SS.get('sid-pt')){SS.del('sid-pt');pt.classList.add('leave');pt.addEventListener('animationend',function(){pt.classList.remove('leave')},{once:true})}
window.addEventListener('pageshow',function(e){if(e.persisted){pt.classList.remove('enter','leave')}});
document.addEventListener('click',function(e){
  if(reduce||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  var a=e.target.closest('a[href]');if(!a||a.target==='_blank')return;
  var h=a.getAttribute('href');if(!h||h.charAt(0)==='#'||/^(https?:|mailto:|tel:|javascript:)/i.test(h)||!/\.html/i.test(h))return;
  var here=location.pathname.split('/').pop()||'index.html';if(h.split('#')[0].split('?')[0]===here&&h.indexOf('#')>-1)return;
  e.preventDefault();SS.set('sid-pt','1');pt.classList.add('enter');
  setTimeout(function(){location.href=a.href},560);
});

/* ---- cursor ---- */
if(fine&&!reduce){
  var dot=document.createElement('div'),ring=document.createElement('div');
  dot.className='cur';ring.className='cur-ring';ring.innerHTML='<span></span>';
  dot.setAttribute('aria-hidden','true');ring.setAttribute('aria-hidden','true');
  document.body.appendChild(dot);document.body.appendChild(ring);
  var mx=-100,my=-100,rx=-100,ry=-100,lab=ring.firstChild;
  addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;dot.style.transform='translate('+mx+'px,'+my+'px)'},{passive:true});
  (function loop(){rx+=(mx-rx)*.18;ry+=(my-ry)*.18;ring.style.transform='translate('+rx+'px,'+ry+'px)';requestAnimationFrame(loop)})();
  document.addEventListener('mouseover',function(e){
    var c=e.target.closest('[data-cursor]'),l=e.target.closest('a,button,select,input,textarea,label,.jstep,.chip');
    if(l&&(!c||c.contains(l)&&c!==l)){ring.classList.remove('lab');ring.classList.add('hov');return}
    if(c){lab.textContent=window.SidT?SidT(c.getAttribute('data-cursor')):c.getAttribute('data-cursor');ring.classList.add('lab');ring.classList.remove('hov');return}
    ring.classList.remove('lab','hov');
  });
  document.addEventListener('mouseleave',function(){mx=my=-100});
}

/* ---- magnetic ---- */
if(fine&&!reduce){
  [].forEach.call(document.querySelectorAll('.btn,nav a.cta,.mag-me'),function(el){
    el.classList.add('mag');
    el.addEventListener('mousemove',function(e){var r=el.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;el.classList.add('mag-on');el.style.transform='translate('+x*.28+'px,'+y*.38+'px)'});
    el.addEventListener('mouseleave',function(){el.classList.remove('mag-on');el.style.transform=''});
  });
}

/* ---- heading reveal ---- */
if(!reduce&&'IntersectionObserver' in window){
  var hs=[].slice.call(document.querySelectorAll('main h2:not(.ranges h2)'));
  hs.forEach(function(h){h.classList.add('hrv')});
  var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.2});
  hs.forEach(function(h){io.observe(h)});
  setTimeout(function(){hs.forEach(function(h){h.classList.add('in')})},4000);
}

/* ---- footer wordmark ---- */
var ft=document.querySelector('footer .wrap');
if(ft){
  var bm=document.createElement('div');bm.className='bigmark';bm.setAttribute('aria-hidden','true');bm.setAttribute('translate','no');
  bm.innerHTML='SIDDHANT'.split('').map(function(c){return '<span>'+c+'</span>'}).join('');
  ft.appendChild(bm);
  if(fine&&!reduce){var ls=[].slice.call(bm.children);
    bm.parentNode.addEventListener('mousemove',function(e){ls.forEach(function(l){var r=l.getBoundingClientRect(),d=Math.abs(e.clientX-(r.left+r.width/2)),k=Math.max(0,1-d/260);l.style.transform='translateY('+(-k*18)+'%)';l.style.color=k>.55?'var(--fx-lime)':''})});
    bm.parentNode.addEventListener('mouseleave',function(){ls.forEach(function(l){l.style.transform='';l.style.color=''})});}
}

/* ---- loader (homepage, once per visit) ---- */
if(!reduce&&document.getElementById('lhero')&&!SS.get('sid-loaded')&&!pt.classList.contains('leave')){
  SS.set('sid-loaded','1');
  var ld=document.createElement('div');ld.className='loader';ld.setAttribute('aria-hidden','true');
  ld.innerHTML='<div class="ld-word">Siddhant</div><div class="ld-num"><b>0</b>%</div><div class="ld-bar"><i></i></div>';
  document.body.appendChild(ld);
  var nb=ld.querySelector('b'),bi=ld.querySelector('.ld-bar i'),st=performance.now();
  (function cnt(t){var p=Math.min(1,(t-st)/1300),e=1-Math.pow(1-p,3);nb.textContent=Math.round(e*100);bi.style.width=(e*100)+'%';
    if(p<1)requestAnimationFrame(cnt);else{ld.classList.add('done');setTimeout(function(){ld.remove()},900)}})(st);
}

/* ---- nav text roll ---- */
[].forEach.call(document.querySelectorAll('nav a:not(.cta), .util .right a, footer ul a'),function(a){
  if(a.querySelector('.roll'))return;var t=a.innerHTML;
  a.innerHTML='<span class="roll"><span>'+t+'</span><span aria-hidden="true">'+t+'</span></span>';
});

/* ---- velocity marquee engine (any .vmq) ---- */
function vmqMake(){
  var w=document.createElement('div');w.className='vmq';w.setAttribute('aria-hidden','true');
  w.innerHTML='<div class="vmq-row" data-dir="-1"><div class="vmq-in"><span>Power of growth</span><i>&#10045;</i><span>Power of growth</span><i>&#10045;</i><span>Power of growth</span><i>&#10045;</i></div></div><div class="vmq-row vmq-o" data-dir="1"><div class="vmq-in"><span>Seed</span><i>&#183;</i><span>Soil</span><i>&#183;</i><span>Success</span><i>&#183;</i><span>Seed</span><i>&#183;</i><span>Soil</span><i>&#183;</i><span>Success</span><i>&#183;</i></div></div>';
  return w;
}
var mainEl=document.querySelector('main');
if(mainEl&&!document.querySelector('.vmq'))mainEl.appendChild(vmqMake());
var rows=[].slice.call(document.querySelectorAll('.vmq-row'));
if(rows.length){
  rows.forEach(function(r){var i=r.querySelector('.vmq-in');i.innerHTML+=i.innerHTML;r._x=0;r._i=i});
  var lastY=scrollY,vel=0;
  (function loop(){
    var y=scrollY,d=y-lastY;lastY=y;vel+=(d-vel)*.1;
    rows.forEach(function(r){
      var w=r._i.scrollWidth/2||1,dir=+r.getAttribute('data-dir');
      r._x+=dir*(1.1+Math.abs(vel)*.6)*(vel<0?-1:1);
      if(r._x<=-w)r._x+=w;if(r._x>0)r._x-=w;
      r._i.style.transform='translate3d('+r._x+'px,0,0) skewX('+Math.max(-12,Math.min(12,-vel*.4))+'deg)';
    });
    if(!reduce)requestAnimationFrame(loop);
  })();
}

/* ---- image trail engine (any [data-trail]) ---- */
var BIO=['images/bio/aarambh.png','images/bio/gloster-gr.png','images/bio/rootwell-gr.png','images/bio/max-o-potash.png','images/bio/unnati-calmag.png','images/bio/energy.png','images/bio/unnati-zinbor.png','images/bio/unnati-silicon-star.png','images/bio/ph-balancer.png','images/bio/s-ortho-plus.png'];
var SEEDS=['images/products/pink-star.png','images/products/onion-vardhan.png','images/products/silage-master-6065.png','images/products/ahilya-7575.png'];
var bh=document.querySelector('.biohero');
if(bh&&!bh.hasAttribute('data-trail')){bh.setAttribute('data-trail','bio');bh.setAttribute('data-cursor','Scatter');
  var hint=document.createElement('span');hint.className='trail-hint';hint.textContent='Move across the hero to scatter our packs';
  var hp=bh.querySelector('.bhrow p');if(hp)hp.parentNode.insertBefore(hint,hp.nextSibling);}
if(!reduce)[].forEach.call(document.querySelectorAll('[data-trail]'),function(B){
  var IM=B.getAttribute('data-trail')==='bio'?BIO:SEEDS.concat(BIO.slice(0,6)),k=0,lx=-999,ly=-999;
  var layer=B.querySelector('.trail-layer');if(!layer){layer=document.createElement('div');layer.className='trail-layer';layer.setAttribute('aria-hidden','true');B.insertBefore(layer,B.firstChild)}
  IM.forEach(function(s){var i=new Image();i.src=s});
  function drop(cx,cy,gap){
    var b=B.getBoundingClientRect(),px=cx-b.left,py=cy-b.top;
    if(Math.hypot(px-lx,py-ly)<gap)return;lx=px;ly=py;
    var im=document.createElement('img');im.src=IM[k++%IM.length];im.alt='';
    im.style.transform='translate('+px+'px,'+py+'px) rotate('+((Math.random()-.5)*24)+'deg)';
    layer.appendChild(im);im.addEventListener('animationend',function(){im.remove()});
    if(layer.children.length>14)layer.firstChild.remove();
  }
  B.addEventListener('mousemove',function(e){drop(e.clientX,e.clientY,90)});
  B.addEventListener('touchstart',function(e){var t=e.touches[0];lx=ly=-999;drop(t.clientX,t.clientY,0)},{passive:true});
  B.addEventListener('touchmove',function(e){var t=e.touches[0];drop(t.clientX,t.clientY,70)},{passive:true});
});

/* ---- inner-page lens hero ---- */
var ph=document.querySelector('.pagehead');
if(ph){
  ph.classList.add('ph-night');ph.setAttribute('data-cursor','Look');
  var lensL=document.createElement('div');lensL.className='ph-lens';lensL.setAttribute('aria-hidden','true');
  var cl=ph.querySelector('.wrap').cloneNode(true);
  var h1c=cl.querySelector('h1');if(h1c){var d=document.createElement('div');d.className='ph-h1';d.innerHTML=h1c.innerHTML;h1c.parentNode.replaceChild(d,h1c)}
  [].forEach.call(cl.querySelectorAll('a'),function(a){a.setAttribute('tabindex','-1')});
  lensL.appendChild(cl);ph.appendChild(lensL);
  var ptx=.75,pty=.5,pxx=.75,pyy=.5,pr=0,lastM=0,t1=performance.now();
  ph.addEventListener('mousemove',function(e){var b=ph.getBoundingClientRect();ptx=(e.clientX-b.left)/b.width;pty=(e.clientY-b.top)/b.height;lastM=performance.now()});
  function phT(e){var t=e.touches[0],b=ph.getBoundingClientRect();ptx=(t.clientX-b.left)/b.width;pty=(t.clientY-b.top)/b.height;lastM=performance.now()}
  ph.addEventListener('touchstart',phT,{passive:true});ph.addEventListener('touchmove',phT,{passive:true});
  (function lt(now){
    if(now-lastM>2400){var q=(now-t1)/1000;ptx=.6+.28*Math.sin(q*.5);pty=.55+.25*Math.sin(q*.8)}
    pxx+=(ptx-pxx)*.12;pyy+=(pty-pyy)*.12;pr+=((ph.clientHeight*.42)-pr)*.06;
    lensL.style.clipPath='circle('+pr+'px at '+(pxx*100)+'% '+(pyy*100)+'%)';
    if(!reduce)requestAnimationFrame(lt);
  })(t1);
}

/* ---- card tilt + spotlight ---- */
if(fine&&!reduce)[].forEach.call(document.querySelectorAll('.card,.tile,.whygrid>div,.vmc,.str .s,.flow .st,.state,.group .g,.vcard'),function(c){
  c.classList.add('tilt');var g=document.createElement('span');g.className='spot';g.setAttribute('aria-hidden','true');c.appendChild(g);
  c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
    c.style.setProperty('--mx',(x*100)+'%');c.style.setProperty('--my',(y*100)+'%');c.style.setProperty('--ry',((x-.5)*8)+'deg');c.style.setProperty('--rx',((.5-y)*8)+'deg')});
  c.addEventListener('mouseleave',function(){c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg')});
});

/* ---- drag rails for card grids ---- */
[].forEach.call(document.querySelectorAll('main .grid'),function(g){
  if(g.children.length<3)return;
  g.classList.add('rail');g.setAttribute('data-cursor','Drag');g.setAttribute('data-lenis-prevent','');
  var bar=document.createElement('div');bar.className='rail-bar';bar.innerHTML='<span>'+(fine?'Drag sideways to see more':'Swipe sideways to see more')+'</span><i><b></b></i>';
  g.parentNode.insertBefore(bar,g.nextSibling);var fill=bar.querySelector('b');
  function upd(){var m=g.scrollWidth-g.clientWidth;fill.style.width=(m>0?(g.clientWidth/g.scrollWidth*100+(100-g.clientWidth/g.scrollWidth*100)*g.scrollLeft/m):100)+'%';bar.style.display=m>4?'':'none'}
  g.addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);addEventListener('load',upd);upd();
  var down=false,sx=0,sl=0,moved=0,vx=0,lastX=0;
  g.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=0;sx=lastX=e.clientX;sl=g.scrollLeft;g.classList.add('dragging')});
  addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;moved=Math.max(moved,Math.abs(dx));vx=e.clientX-lastX;lastX=e.clientX;g.scrollLeft=sl-dx});
  addEventListener('pointerup',function(){if(!down)return;down=false;g.classList.remove('dragging');
    (function glide(){if(Math.abs(vx)<.5||reduce)return;g.scrollLeft-=vx;vx*=.92;requestAnimationFrame(glide)})();});
  g.addEventListener('click',function(e){if(moved>6){e.preventDefault();e.stopPropagation()}},true);
  g.addEventListener('dragstart',function(e){e.preventDefault()});
});

/* ---- full-screen mobile menu ---- */
var burger=document.getElementById('burger'),navEl=document.getElementById('nav');
if(burger&&navEl){
  function T(x){return window.SidT?SidT(x):x}
  function sync(){var o=navEl.classList.contains('open');document.documentElement.classList.toggle('menu-open',o);
    burger.textContent=T(o?'Close':'Menu');burger.setAttribute('aria-expanded',o);
    if(lenis){o?lenis.stop():lenis.start()}}
  new MutationObserver(sync).observe(navEl,{attributes:true,attributeFilter:['class']});
  addEventListener('keydown',function(e){if(e.key==='Escape'&&navEl.classList.contains('open'))navEl.classList.remove('open')});
  addEventListener('resize',function(){if(innerWidth>900&&navEl.classList.contains('open'))navEl.classList.remove('open')});
  document.addEventListener('sidlang',sync);
}

/* ---- phone action bar ---- */
(function(){
  var bar=document.createElement('div');bar.className='mbar';bar.setAttribute('role','navigation');bar.setAttribute('aria-label','Quick actions');
  var ph='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>';
  var sd='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 21V10"/><path d="M12 14c-4 0-6-3-6-6 4 0 6 2 6 6zM12 11c4 0 6-2.5 6-5.5-4 0-6 2-6 5.5z"/></svg>';
  var dl='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10l2-5h14l2 5M4 10v10h16V10M9 20v-5h6v5"/></svg>';
  bar.innerHTML='<a href="tel:+917796177709">'+ph+'<span>Call</span></a><a href="products.html">'+sd+'<span>Products</span></a><a class="pri" href="contact.html#dealer">'+dl+'<span>Become a dealer</span></a>';
  document.body.appendChild(bar);
  var ly=scrollY;
  addEventListener('scroll',function(){var y=scrollY;if(Math.abs(y-ly)<8)return;bar.classList.toggle('hide',y>ly&&y>200);ly=y},{passive:true});
})();

/* ---- light haptics on Android ---- */
window.SidBuzz=function(ms){try{if(navigator.vibrate&&!reduce)navigator.vibrate(ms||12)}catch(e){}};
document.addEventListener('click',function(e){if(e.target.closest('.chip,.jstep,.mbar a,.burger'))SidBuzz(10)});
})();
