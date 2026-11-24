/* Homepage: crop marquee, seed journey, variety finder */
(function(){
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var ICON={
  onion:'<svg viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="32" cy="38" rx="20" ry="18" fill="#c9487f"/><ellipse cx="32" cy="38" rx="11" ry="18" fill="#e58db3" opacity=".75"/><path d="M32 20c-1-8 2-13 6-16" stroke="#3f8a2f" stroke-width="3" stroke-linecap="round" fill="none"/></svg>',
  wheat:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 60V14" stroke="#9a6b12" stroke-width="3" stroke-linecap="round"/><g fill="#d79b1c"><ellipse cx="25" cy="22" rx="5" ry="9" transform="rotate(-25 25 22)"/><ellipse cx="39" cy="22" rx="5" ry="9" transform="rotate(25 39 22)"/><ellipse cx="25" cy="36" rx="5" ry="9" transform="rotate(-25 25 36)"/><ellipse cx="39" cy="36" rx="5" ry="9" transform="rotate(25 39 36)"/><ellipse cx="32" cy="12" rx="4" ry="8"/></g></svg>',
  maize:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M20 58c2-14 6-22 12-26M44 58c-2-14-6-22-12-26" stroke="#4f9a3a" stroke-width="4" stroke-linecap="round" fill="none"/><ellipse cx="32" cy="28" rx="11" ry="21" fill="#f2b705"/><g fill="#d89a00"><circle cx="28" cy="18" r="2"/><circle cx="36" cy="18" r="2"/><circle cx="28" cy="28" r="2"/><circle cx="36" cy="28" r="2"/><circle cx="28" cy="38" r="2"/><circle cx="36" cy="38" r="2"/></g></svg>',
  pulses:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M12 46C8 28 24 12 46 14c4 18-10 36-34 32z" fill="#6aae3a"/><g fill="#d9f2b8"><circle cx="24" cy="36" r="4"/><circle cx="32" cy="29" r="4"/><circle cx="40" cy="22" r="4"/></g></svg>',
  bajra:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 60V30" stroke="#7a5a2a" stroke-width="3" stroke-linecap="round"/><ellipse cx="32" cy="20" rx="8" ry="18" fill="#a9803f"/><g fill="#c9a460"><circle cx="29" cy="10" r="2"/><circle cx="35" cy="14" r="2"/><circle cx="29" cy="20" r="2"/><circle cx="35" cy="24" r="2"/><circle cx="29" cy="30" r="2"/></g></svg>',
  nutri:'<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="20" y="16" width="24" height="42" rx="6" fill="#3b9a68"/><rect x="25" y="8" width="14" height="10" rx="3" fill="#e2a925"/><path d="M32 48V34" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M32 40c-6 0-8-4-8-8 5 0 8 3 8 8zM32 37c5 0 8-3 8-7-5 0-8 2-8 7z" fill="#ffd98f"/></svg>'
};
function T(x){return window.SidT?SidT(x):x}
var NAME={onion:'Onion',wheat:'Wheat',maize:'Maize',pulses:'Pulses',bajra:'Bajra'};
var PAGE={onion:'onion.html',wheat:'wheat.html',maize:'maize.html',pulses:'pulses.html',bajra:'bajra.html'};

/* ---- marquee ---- */
var tk=document.querySelector('.ticker');
if(tk){
  var list=[['onion','Onion','onion.html'],['wheat','Wheat','wheat.html'],['maize','Maize','maize.html'],['pulses','Pulses','pulses.html'],['bajra','Bajra','bajra.html'],['nutri','Fertilisers and micronutrients','biotech.html']];
  function set(hidden){return '<div class="marq-set"'+(hidden?' aria-hidden="true"':'')+'>'+list.map(function(c){return '<a href="'+c[2]+'"'+(hidden?' tabindex="-1"':'')+'>'+ICON[c[0]]+c[1]+'</a><i class="dot"></i>'}).join('')+'</div>'}
  tk.classList.add('marq');
  tk.querySelector('.wrap').innerHTML='<div class="marq-track">'+set(false)+set(true)+set(true)+set(true)+'</div>';
}

/* ---- seed journey ---- */
var J=document.getElementById('journey');
if(J){
  var steps=[].slice.call(J.querySelectorAll('.jstep')),stage=J.querySelector('.jstage'),
      cap=J.querySelector('.jcap span'),bar=[].slice.call(J.querySelectorAll('.jbar i')),
      stem=J.querySelector('.jstem'),seed=J.querySelector('.jseed'),sun=J.querySelector('.jsun'),
      parts=[].slice.call(J.querySelectorAll('[data-at]')),cur=-1;
  var STEM=[100,100,70,42,16,0];
  function show(n){
    if(n===cur)return;cur=n;
    steps.forEach(function(s,i){s.classList.toggle('on',i===n);s.setAttribute('aria-current',i===n?'step':'false')});
    bar.forEach(function(b,i){b.classList.toggle('on',i<=n)});
    cap.textContent=T(steps[n].getAttribute('data-cap'));
    stem.style.strokeDashoffset=STEM[n];
    seed.style.transform=n>=1?'translateY(4px) scale(.9)':'none';
    sun.style.opacity=n>=5?1:0;sun.style.transform=n>=5?'scale(1)':'scale(.6)';
    parts.forEach(function(p){p.classList.toggle('off',n<+p.getAttribute('data-at'))});
  }
  steps.forEach(function(s,i){
    s.tabIndex=0;
    s.addEventListener('click',function(){show(i)});
    s.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();show(i)}});
  });
  show(0);
  document.addEventListener('sidlang',function(){if(cur>-1)cap.textContent=T(steps[cur].getAttribute('data-cap'))});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(x){if(x.isIntersecting)show(steps.indexOf(x.target))});
    },{rootMargin:'-45% 0px -45% 0px'});
    steps.forEach(function(s){io.observe(s)});
  }
}

/* ---- variety finder ---- */
var V=[
  {c:'onion',n:'Superstar',t:'Red onion',d:'Our flagship red onion variety, processed straight after harvest.',f:1},
  {c:'onion',n:'Export Star',t:'Red onion',d:'Red onion variety developed for quality bulbs and strong market demand.',s:'Red season'},
  {c:'onion',n:'Megastar',t:'Red and Gawran onion',d:'Grown as a red onion in Karnataka and as a Gawran onion in Maharashtra.',s:'Region dependent'},
  {c:'onion',n:'Vardhan',t:'Gawran onion',d:'Storage-type onion for the rabi season, stored at our plant and packed and sold from mid-August.',s:'Rabi',img:'images/products/onion-vardhan.png'},
  {c:'onion',n:'Pinkstar',t:'Gawran onion',d:'Gawran onion with pink bulbs, stored at our plant and processed after red onion.',s:'Rabi',img:'images/products/pink-star.png'},
  {c:'wheat',n:'Pruthvi 234',t:'Wheat, company flagship',d:'Our most popular researched wheat variety. Short duration and high yielding, with a long spike, good grain size and attractive grain colour.',s:'Rabi',p:'20 kg, 40 kg',f:1},
  {c:'wheat',n:'Purna 1544 Sharbati',t:'Sharbati wheat',d:'Sharbati-type wheat for the rabi season.',s:'Rabi',p:'20 kg, 40 kg'},
  {c:'wheat',n:'HD-2189',t:'Wheat',d:'Short duration, high yielding variety with good grain size. Popular in Maharashtra.',s:'Rabi',p:'20 kg, 40 kg'},
  {c:'wheat',n:'Lok 1',t:'Wheat',d:'Short duration variety, commonly used for eating purposes.',s:'Rabi',p:'20 kg, 40 kg'},
  {c:'wheat',n:'GW 496',t:'Wheat',d:'Wheat variety offered in 20 kg and 40 kg bags.',s:'Rabi',p:'20 kg, 40 kg'},
  {c:'maize',n:'Hy Maize 1777',t:'Single-cross hybrid',d:'Single-cross maize hybrid for grain production.'},
  {c:'maize',n:'Hy Maize 110',t:'Double-cross hybrid',d:'Double-cross maize hybrid for grain production.'},
  {c:'maize',n:'Hy Maize 6065',t:'Double-cross hybrid',d:'Double-cross maize hybrid with a dependable yield record.'},
  {c:'maize',n:'Silage Master 6065',t:'Fodder and silage',d:'Maize hybrid grown for green fodder and silage.',img:'images/products/silage-master-6065.png'},
  {c:'maize',n:'Super African Tall',t:'Fodder maize',d:'Tall maize variety listed with our other field-crop seed.'},
  {c:'pulses',n:'Digvijay',t:'Gram (chickpea)',d:'Released by MPKV Rahuri. Semi-erect, early maturing, pink flowers, yellowish-brown seed.',s:'Rabi',p:'Duration 105 to 110 days',f:1},
  {c:'pulses',n:'Udid Vithal',t:'Black gram (urad)',d:'Black gram variety for pulse growers.'},
  {c:'pulses',n:'Sakshi Tur',t:'Pigeon pea (tur)',d:'Pigeon pea variety for pulse growers.'},
  {c:'bajra',n:'Ahilya-7575',t:'Pearl millet hybrid',d:'Bajra hybrid for dryland farmers.',f:1,img:'images/products/ahilya-7575.png'}
];
var BLURB={
  onion:'Red onions for the market and Gawran onions for storage, all from our own breeding.',
  wheat:'Led by Pruthvi 234, our most popular researched wheat. Every variety comes in 20 kg and 40 kg bags.',
  maize:'Hybrids for grain, and dedicated varieties for green fodder and silage.',
  pulses:'Gram, black gram and pigeon pea for rotation and dryland fields.',
  bajra:'A pearl millet hybrid bred for dryland farmers.'
};
var F=document.getElementById('finder');
if(F){
  var chips=F.querySelector('.fchips'),out=F.querySelector('.vlist'),intro=F.querySelector('.fintro');
  chips.innerHTML=Object.keys(NAME).map(function(k){return '<button type="button" class="chip" data-c="'+k+'" aria-pressed="false">'+ICON[k]+NAME[k]+'</button>'}).join('');
  function pick(c){
    [].forEach.call(chips.children,function(b){b.setAttribute('aria-pressed',b.dataset.c===c)});
    var v=V.filter(function(x){return x.c===c});
    intro.innerHTML='<div class="big">'+v.length+'</div><h3>'+NAME[c]+(v.length===1?' variety':' varieties')+'</h3><p>'+BLURB[c]+'</p><a href="'+PAGE[c]+'">Full '+NAME[c].toLowerCase()+' details &rarr;</a><svg class="ghost" viewBox="0 0 64 64" aria-hidden="true">'+ICON[c].replace(/^<svg[^>]*>|<\/svg>$/g,'')+'</svg>';
    out.innerHTML=v.map(function(x,i){
      var meta=[];if(x.f)meta.push('Flagship');if(x.s)meta.push(x.s);if(x.p)meta.push(x.p);
      return '<article class="vcard'+(x.f?' flag':'')+'" style="animation-delay:'+(reduce?0:i*70)+'ms">'+
        (x.img?'<img src="'+x.img+'" alt="'+x.n+' seed packet" loading="lazy" style="height:110px;width:auto;object-fit:contain;align-self:flex-start;margin-bottom:6px">':'')+
        '<span class="vt">'+x.t+'</span><h4>'+x.n+'</h4><p>'+x.d+'</p>'+
        (meta.length?'<div class="vmeta">'+meta.map(function(m){return '<span>'+m+'</span>'}).join('')+'</div>':'')+'</article>';
    }).join('');
  }
  chips.addEventListener('click',function(e){var b=e.target.closest('.chip');if(b){pick(b.dataset.c);if(window.SidReapply)SidReapply()}});
  pick('onion');
}
})();

/* ================= Lando-inspired interactions ================= */
(function(){
var FX=window.SidFX||{},reduce=FX.reduce,fine=FX.fine;
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}

/* ---- lens hero + seed sowing ---- */
var H=document.getElementById('lhero');
if(H){
  var lens=H.querySelector('.lh-lens'),tx=.7,ty=.45,x=.7,y=.45,r=0,tr=170,last=0,idle=true,t0=performance.now();
  function setR(){tr=Math.max(120,Math.min(230,H.clientWidth*.15))}
  setR();addEventListener('resize',setR);
  H.addEventListener('mousemove',function(e){var b=H.getBoundingClientRect();tx=(e.clientX-b.left)/b.width;ty=(e.clientY-b.top)/b.height;last=performance.now();idle=false});
  H.addEventListener('mouseleave',function(){idle=true});
  function tick(now){
    if(idle||now-last>2600){var k=(now-t0)/1000;tx=.62+.22*Math.sin(k*.45);ty=.5+.2*Math.sin(k*.7)}
    var e=reduce?1:.12;x+=(tx-x)*e;y+=(ty-y)*e;r+=(tr-r)*.08;
    lens.style.setProperty('--x',(x*100)+'%');lens.style.setProperty('--y',(y*100)+'%');lens.style.setProperty('--r',r+'px');
    if(!reduce)requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  var cv=H.querySelector('.lh-seeds'),ctx=cv.getContext('2d'),W=0,Hh=0,dpr=Math.min(2,window.devicePixelRatio||1),seeds=[],running=false;
  function size(){W=H.clientWidth;Hh=H.clientHeight;cv.width=W*dpr;cv.height=Hh*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
  size();addEventListener('resize',size);
  var COL=['#ffd54a','#e2a925','#c8ee6a','#f3e3b0'];
  function sow(px,py){
    for(var i=0;i<22;i++){var a=Math.random()*Math.PI*2,v=3+Math.random()*7;
      seeds.push({x:px,y:py,vx:Math.cos(a)*v,vy:Math.sin(a)*v-5,rot:Math.random()*6,vr:(Math.random()-.5)*.3,s:3+Math.random()*4,c:COL[i%4],life:0,b:0});}
    if(!running){running=true;requestAnimationFrame(step)}
  }
  function step(){
    ctx.clearRect(0,0,W,Hh);
    seeds=seeds.filter(function(p){return p.life<260});
    seeds.forEach(function(p){
      p.vy+=.35;p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;p.vx*=.99;p.life++;
      if(p.y>Hh-10&&p.vy>0){p.y=Hh-10;p.vy*=-.45;p.vx*=.7;p.b++;p.vr*=.6}
      ctx.save();ctx.globalAlpha=Math.max(0,1-p.life/260);ctx.translate(p.x,p.y);ctx.rotate(p.rot);
      ctx.fillStyle=p.c;ctx.beginPath();ctx.ellipse(0,0,p.s*1.6,p.s,0,0,Math.PI*2);ctx.fill();ctx.restore();
    });
    if(seeds.length)requestAnimationFrame(step);else{running=false;ctx.clearRect(0,0,W,Hh)}
  }
  H.addEventListener('click',function(e){if(e.target.closest('a,button'))return;var b=H.getBoundingClientRect();
    if(!reduce)sow(e.clientX-b.left,e.clientY-b.top);
    tx=(e.clientX-b.left)/b.width;ty=(e.clientY-b.top)/b.height;last=performance.now();idle=false;});
}

/* ---- pinned horizontal range ---- */
var R=document.getElementById('ranges'),track=document.getElementById('rgTrack'),bar=document.getElementById('rgBar'),now=document.getElementById('rgNow');
var desk=window.matchMedia('(min-width: 901px)');
function rgLayout(){
  if(!R)return;
  if(desk.matches&&!reduce){var dist=Math.max(0,track.scrollWidth-innerWidth);R.style.height=(innerHeight+dist)+'px';R._dist=dist}
  else{R.style.height='';R._dist=0;track.style.transform=''}
}
function rgScroll(){
  if(!R)return;var b=R.getBoundingClientRect(),span=R.offsetHeight-innerHeight;
  var p=span>0?clamp(-b.top/span,0,1):0;
  if(R._dist){track.style.transform='translate3d('+(-p*R._dist)+'px,0,0)'}
  else{var max=track.scrollWidth-track.clientWidth;p=max>0?track.scrollLeft/max:0}
  bar.style.width=(p*100)+'%';
  var n=Math.min(6,Math.floor(p*5.999)+1);now.textContent=(n<10?'0':'')+n;
}
if(R){
  rgLayout();addEventListener('resize',function(){rgLayout();rgScroll()});
  if(desk.addEventListener)desk.addEventListener('change',rgLayout);
  addEventListener('scroll',rgScroll,{passive:true});track.addEventListener('scroll',rgScroll,{passive:true});
  addEventListener('load',function(){rgLayout();rgScroll()});rgScroll();
  /* 3D tilt */
  if(fine&&!reduce)[].forEach.call(track.querySelectorAll('.rg-card'),function(c){
    c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;
      c.style.transition='transform .1s linear';c.style.transform='perspective(900px) rotateY('+(px*10)+'deg) rotateX('+(-py*10)+'deg)'});
    c.addEventListener('mouseleave',function(){c.style.transition='';c.style.transform=''});
  });
}
})();
