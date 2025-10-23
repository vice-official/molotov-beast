(function(){
  function ensureOverlay(){
    var el=document.getElementById('cs-overlay');
    if(el) return el;
    el=document.createElement('div');
    el.className='cs-overlay';
    el.id='cs-overlay';
    el.setAttribute('aria-hidden','true');
    document.body.appendChild(el);
    return el;
  }
  function makeBtn(path, cls, onClick){
    var b=document.createElement('button');
    b.className=cls;
    b.innerHTML='<svg viewBox="0 0 24 24"><path d="'+path+'"/></svg>';
    b.addEventListener('click', onClick);
    return b;
  }
  var state=null;
  function openZoom(preview){
    if(!preview) return;
    var overlay=ensureOverlay();
    var full=preview.getAttribute('data-full')||preview.currentSrc||preview.src;
    var r=preview.getBoundingClientRect();
    var start={l:r.left,t:r.top,w:r.width,h:r.height};
    var card=preview.closest('.cs-card');
    if(card) card.classList.add('cs-origin-hollow');
    overlay.innerHTML='';
    overlay.setAttribute('data-open','true');
    overlay.setAttribute('data-stage','');
    overlay.setAttribute('aria-hidden','false');
    document.body.classList.add('no-scroll');var closeBtn=makeBtn('M6 6l12 12M18 6L6 18','cs-close',closeZoom);
    overlay.appendChild(closeBtn);
    var float=document.createElement('img');
    float.className='cs-float-img';
    float.src=full;
    float.alt='';
    float.style.left=start.l+'px';
    float.style.top=start.t+'px';
    float.style.width=start.w+'px';
    float.style.height=start.h+'px';
    overlay.appendChild(float);
    overlay.getBoundingClientRect();
    requestAnimationFrame(function(){ overlay.setAttribute('data-stage','fade'); });
    var vw=window.innerWidth,vh=window.innerHeight,img=new Image();
    img.onload=function(){
      var iw=img.naturalWidth||vw,ih=img.naturalHeight||vh;
      var s=Math.min(vw*0.96/iw,vh*0.92/ih);
      var tw=Math.max(100,Math.round(iw*s));
      var th=Math.max(100,Math.round(ih*s));
      var tl=Math.round((vw-tw)/2);
      var tt=Math.round((vh-th)/2);
      var kf=[{left:start.l+'px',top:start.t+'px',width:start.w+'px',height:start.h+'px'},{left:tl+'px',top:tt+'px',width:tw+'px',height:th+'px'}];
      var opt={duration:280,easing:'cubic-bezier(.25,.8,.25,1)',fill:'forwards'};
      if(float.animate){ float.animate(kf,opt).onfinish=function(){ overlay.setAttribute('data-stage','show'); }; } else { overlay.setAttribute('data-stage','show'); }
      state={overlay:overlay,floatEl:float,previewEl:preview,card:card,tw:tw,th:th,tl:tl,tt:tt};
    };
    img.src=full;
    function onEsc(e){ if(e.key==='Escape') closeZoom(); }
    function onBg(e){ if(e.target===overlay) closeZoom(); }
    document.addEventListener('keydown',onEsc,{once:true});
    overlay.addEventListener('click',onBg);
  }
  function closeZoom(){
    if(!state||!state.overlay||!state.floatEl){ reset(); return; }
    var overlay=state.overlay, float=state.floatEl, preview=state.previewEl, card=state.card;
    var r=preview.getBoundingClientRect();
    var vw=window.innerWidth,vh=window.innerHeight;
    var iw=float.naturalWidth||vw,ih=float.naturalHeight||vh;
    var s=Math.min(vw*0.96/iw,vh*0.92/ih);
    var tw=Math.max(100,Math.round(iw*s));
    var th=Math.max(100,Math.round(ih*s));
    var tl=Math.round((vw-tw)/2);
    var tt=Math.round((vh-th)/2);
    var kf=[{left:tl+'px',top:tt+'px',width:tw+'px',height:th+'px'},{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'}];
    var opt={duration:260,easing:'cubic-bezier(.25,.8,.25,1)',fill:'forwards'};
    if(float.animate){ float.animate(kf,opt).onfinish=reset; } else { reset(); }
    function reset(){
      overlay.removeAttribute('data-open');
      overlay.removeAttribute('data-stage');
      overlay.setAttribute('aria-hidden','true');
      overlay.innerHTML='';
      if(card) card.classList.remove('cs-origin-hollow');
      state=null;document.body.classList.remove('no-scroll');
    }
  }
  document.querySelectorAll('.cs-card .cs-zoom').forEach(function(b){
    b.addEventListener('click',function(e){
      var card=e.currentTarget.closest('.cs-card');
      var img=card&&card.querySelector('.cs-media img');
      if(img) openZoom(img);
    });
  });
})();

