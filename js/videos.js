/* Farmer testimonial videos from the Siddhant Seeds YouTube channel.
   Renders into any <section class="tvids" data-crop="all|onion|wheat|maize">. Videos load only when tapped. */
(function(){
var V=[
  {id:'Pr0IFWCxNKw',c:'onion',v:'Vardhan onion',n:'श्री. किशोर गव्हाणे',p:'सुलतानपूर, ता. नेवासा, जि. अहिल्यानगर'},
  {id:'p1bKAcZLnR4',c:'onion',v:'Vardhan onion',n:'श्री सोनवणे कांतीलाल',p:'दसाने, ता. सटाणा, जि. नाशिक'},
  {id:'hefR5ZSzBX0',c:'onion',v:'Vardhan onion',n:'दिनेश चौधरी',p:'इंदौर, मध्य प्रदेश'},
  {id:'Y_m9oEjF4Jc',c:'onion',v:'Vardhan onion',n:'कोलते साहेब',p:'श्रीरामपूर'},
  {id:'q0-OEhqyZNY',c:'onion',v:'Pinkstar onion',n:'रामेश्वर डांगी',p:'मध्य प्रदेश'},
  {id:'tZ10jLJo_80',c:'onion',v:'Vardhan onion',n:'श्री. मेघराज जाधव',p:'',s:1},
  {id:'1lEIkRtovMU',c:'wheat',v:'Pruthvi 234 wheat',n:'जीवन नागा',p:'जि. इंदौर, मध्य प्रदेश'},
  {id:'Jf0yUBLoXp4',c:'wheat',v:'Pruthvi 234 wheat',n:'श्री. आण्णासाहेब भाऊसाहेब मगर',p:'ता. संगमनेर, जि. अहिल्यानगर'},
  {id:'J6NpGnYIl00',c:'maize',v:'Hy Maize 110',n:'श्री अनिल मगर',p:'ता. संगमनेर, जि. अहिल्यानगर'}
];
var CROPS={onion:'Onion',wheat:'Wheat',maize:'Maize'};
function T(x){return window.SidT?SidT(x):x}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var play='<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="31" fill="currentColor"/><path d="M26 20l20 12-20 12z" fill="#0f2a1d"/></svg>';

function card(x){
  return '<button type="button" class="tv-card" data-id="'+x.id+'"'+(x.s?' data-short="1"':'')+' data-cursor="Play" aria-label="'+esc(T('Watch')+': '+x.n+' – '+T(x.v))+'">'+
    '<span class="tv-thumb"><img src="https://i.ytimg.com/vi/'+x.id+'/hqdefault.jpg" alt="" loading="lazy" width="480" height="360"><span class="tv-play">'+play+'</span>'+(x.s?'<span class="tv-short">Short</span>':'')+'</span>'+
    '<span class="tv-meta"><span class="tv-tag">'+esc(x.v)+'</span><span class="tv-name" lang="mr">'+esc(x.n)+'</span>'+(x.p?'<span class="tv-place" lang="mr">'+esc(x.p)+'</span>':'')+'</span></button>';
}

[].forEach.call(document.querySelectorAll('section.tvids'),function(sec){
  var crop=sec.getAttribute('data-crop')||'all',list=sec.querySelector('.tv-list'),chips=sec.querySelector('.tv-chips');
  function render(c){
    var items=V.filter(function(x){return c==='all'||x.c===c});
    list.innerHTML=items.map(card).join('');
    if(window.SidReapply)SidReapply();
  }
  if(chips){
    var keys=['all'].concat(Object.keys(CROPS));
    chips.innerHTML=keys.map(function(k){var n=k==='all'?V.length:V.filter(function(x){return x.c===k}).length;
      return '<button type="button" class="chip" data-c="'+k+'" aria-pressed="'+(k===crop)+'">'+(k==='all'?'All':CROPS[k])+' <b>'+n+'</b></button>'}).join('');
    chips.addEventListener('click',function(e){var b=e.target.closest('.chip');if(!b)return;
      [].forEach.call(chips.children,function(x){x.setAttribute('aria-pressed',x===b)});render(b.dataset.c)});
  }
  render(crop);
  var pv=sec.querySelector('.tv-prev'),nx=sec.querySelector('.tv-next');
  function step(d){var c=list.querySelector('.tv-card');var w=c?c.getBoundingClientRect().width+18:320;list.scrollBy({left:d*w*2,behavior:'smooth'})}
  if(pv)pv.addEventListener('click',function(){step(-1)});if(nx)nx.addEventListener('click',function(){step(1)});
  function upd(){if(!pv)return;var m=list.scrollWidth-list.clientWidth;pv.disabled=list.scrollLeft<4;nx.disabled=list.scrollLeft>m-4;sec.querySelector('.tv-nav').style.visibility=m>4?'':'hidden'}
  list.addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);setTimeout(upd,300);
  if(chips)chips.addEventListener('click',function(){list.scrollLeft=0;setTimeout(upd,50)});
  if(!V.some(function(x){return crop==='all'||x.c===crop}))sec.hidden=true;
});

/* ---- player ---- */
var dlg=null,lastFocus=null;
function open(id,isShort){
  lastFocus=document.activeElement;
  if(!dlg){
    dlg=document.createElement('div');dlg.className='tv-modal';dlg.setAttribute('role','dialog');dlg.setAttribute('aria-modal','true');dlg.setAttribute('aria-label','Farmer testimonial video');
    dlg.innerHTML='<div class="tv-box"><button type="button" class="tv-close" aria-label="Close video">&times;</button><div class="tv-frame"></div><a class="tv-yt" target="_blank" rel="noopener">Watch on YouTube &rarr;</a></div>';
    document.body.appendChild(dlg);
    dlg.addEventListener('click',function(e){if(e.target===dlg||e.target.closest('.tv-close'))close()});
    addEventListener('keydown',function(e){if(e.key==='Escape'&&dlg.classList.contains('on'))close()});
    if(window.SidReapply)SidReapply();
  }
  var fr=dlg.querySelector('.tv-frame');fr.classList.toggle('vert',!!isShort);
  fr.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0&playsinline=1&modestbranding=1" title="Farmer testimonial video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
  dlg.querySelector('.tv-yt').href='https://www.youtube.com/watch?v='+id;
  dlg.classList.add('on');document.documentElement.classList.add('tv-open');
  if(window.SidFX&&SidFX.lenis)SidFX.lenis.stop();
  dlg.querySelector('.tv-close').focus();
}
function close(){
  dlg.classList.remove('on');document.documentElement.classList.remove('tv-open');
  dlg.querySelector('.tv-frame').innerHTML='';
  if(window.SidFX&&SidFX.lenis)SidFX.lenis.start();
  if(lastFocus)lastFocus.focus();
}
document.addEventListener('click',function(e){var c=e.target.closest('.tv-card');if(c){e.preventDefault();open(c.dataset.id,c.dataset.short)}});
})();
