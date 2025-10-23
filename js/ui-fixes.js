(function(){
  function ensureBtnMarkup(btn){
    if (!btn) return;
    if (!btn.querySelector('.btn-label')) {
      var label = btn.textContent.trim();
      btn.innerHTML = '<span class="btn-label">'+label+'</span><span class="btn-error">Заполните обязательные поля</span>';
    }
    btn.classList.add('btn-feedback');
    if (!btn.id) btn.id = 'feedback-submit';
  }

  function nearestForm(el){
    while (el) {
      if (el.tagName && el.tagName.toLowerCase() === 'form') return el;
      el = el.parentElement;
    }
    return null;
  }

  function hasMissingRequired(scope){
    var root = scope || document;
    var required = root.querySelectorAll('[required]');
    for (var i=0;i<required.length;i++){
      var el = required[i];
      var val = (el.type === 'checkbox' || el.type === 'radio') ? el.checked : String(el.value || '').trim();
      if(!val) return true;
    }
    return false;
  }

  function attachFeedbackBehavior(btn){
    var form = nearestForm(btn);
    function fireError(){
      btn.classList.remove('is-pressed','is-open');
      btn.classList.add('error');
      btn.disabled = true;
      setTimeout(function(){
        btn.classList.remove('error');
        btn.disabled = false;
      }, 2000);
    }

    btn.addEventListener('click', function(e){
      var scope = form || document;
      if (hasMissingRequired(scope)){
        e.preventDefault();
        e.stopPropagation();
        fireError();
      } else {
        btn.classList.add('is-pressed');
        setTimeout(function(){ btn.classList.remove('is-pressed'); }, 150);
      }
    });
  }

  var feedbackBtn = null;
  feedbackBtn = document.querySelector('.btn-feedback, #feedback-submit');
  if (!feedbackBtn) {
    var candidates = Array.prototype.slice.call(document.querySelectorAll('button, a[role="button"], input[type="submit"]'));
    candidates.forEach(function(el){
      var text = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (!feedbackBtn && /Обратная\s+связь/i.test(text)) feedbackBtn = el;
    });
  }
  if (feedbackBtn){
    ensureBtnMarkup(feedbackBtn);
    attachFeedbackBehavior(feedbackBtn);
  }

  var fixedBtn = document.querySelector('.fixed-chat-btn');
  if (!fixedBtn) {
    var btns = Array.prototype.slice.call(document.querySelectorAll('button, a'));
    btns.forEach(function(b){
      var st = window.getComputedStyle(b);
      if(!fixedBtn && st.position === 'fixed') fixedBtn = b;
    });
  }
  if (fixedBtn){
    fixedBtn.classList.add('fixed-chat-btn');
    if (!fixedBtn.querySelector('svg')){
      fixedBtn.insertAdjacentHTML('afterbegin','<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-6.5l-3.7 3.3a1 1 0 0 1-1.7-.74V17H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"></path></svg>');
    }
  }
})();