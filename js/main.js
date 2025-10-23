document.getElementById('year').textContent = new Date().getFullYear();

function submitLead(e){
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());

  const btn = document.getElementById('submit-button');
  const oldHTML = btn.innerHTML;

  btn.classList.add('btn-sent');
  btn.innerHTML = 'Отправлено ✓';

  setTimeout(()=>{
    btn.classList.remove('btn-sent');
    btn.innerHTML = oldHTML;
    btn.style.backgroundColor = 'var(--brand-600)';
  }, 900);

  form.reset();
  return false;
}
window.submitLead = submitLead;

function toggleFloatMenu() {
  const menu = document.getElementById('floatMenu');
  menu.classList.toggle('show');
}

document.addEventListener("DOMContentLoaded", () => {
  const faqQuestions = document.querySelectorAll('.faq-question');
  let currentlyOpen = null;
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const targetId = question.getAttribute('data-target');
      const content = document.getElementById(targetId);
      const card = question.closest('.faq-card');
      
      if (currentlyOpen && currentlyOpen !== card) {
        const currentlyOpenContent = currentlyOpen.querySelector('.faq-content');
        currentlyOpen.classList.remove('open');
        currentlyOpenContent.style.maxHeight = '0';
        currentlyOpenContent.style.opacity = '0';
        currentlyOpenContent.style.paddingTop = '0';
        currentlyOpen = null;
      }
      
      if (card.classList.contains('open')) {
        card.classList.remove('open');
        content.style.maxHeight = '0';
        content.style.opacity = '0';
        content.style.paddingTop = '0';
        currentlyOpen = null;
      } else {
        card.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
        content.style.paddingTop = '1rem';
        currentlyOpen = card;
      }
    });
  });
});

document.querySelectorAll(".compare-card").forEach(card => {
  const slider = card.querySelector(".slider");
  const afterWrapper = card.querySelector(".after-wrapper");

  slider.addEventListener("input", e => {
    afterWrapper.style.width = `${e.target.value}%`;
  });
});

document.querySelectorAll(".compare-card").forEach(card => {
  const beforeWrapper = card.querySelector(".before-wrapper");
  const afterWrapper = card.querySelector(".after-wrapper");
  const sliderLine = card.querySelector(".slider-line");
  const sliderHandle = card.querySelector(".slider-handle");

  const updateSlider = (x) => {
    const rect = card.getBoundingClientRect();
    let offset = x - rect.left;
    if (offset < 0) offset = 0;
    if (offset > rect.width) offset = rect.width;

    const percent = (offset / rect.width) * 100;

    beforeWrapper.style.width = `${percent}%`;
    afterWrapper.style.width = `${100 - percent}%`;
    sliderLine.style.left = `${percent}%`;
    sliderHandle.style.left = `${percent}%`;
  };

  let isDragging = false;

  card.addEventListener("mouseenter", () => {
    card.classList.add("hover");
  });
  
  card.addEventListener("mouseleave", () => {
    card.classList.remove("hover");
    card.classList.remove("dragging");
  });

  card.addEventListener("mousedown", e => { 
    isDragging = true; 
    card.classList.add("dragging");
    updateSlider(e.clientX); 
  });
  
  window.addEventListener("mouseup", () => { 
    isDragging = false; 
    card.classList.remove("dragging");
  });
  
  window.addEventListener("mousemove", e => { 
    if (isDragging) updateSlider(e.clientX); 
  });

  card.addEventListener("touchstart", e => { 
    isDragging = true; 
    card.classList.add("dragging");
    updateSlider(e.touches[0].clientX); 
  });
  
  window.addEventListener("touchend", () => { 
    isDragging = false; 
    card.classList.remove("dragging");
  });
  
  window.addEventListener("touchmove", e => { 
    if (isDragging) updateSlider(e.touches[0].clientX); 
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      const faqCard = this.closest('.faq-card');
      
      document.querySelectorAll('.faq-card.open').forEach(openCard => {
        if (openCard !== faqCard) {
          openCard.classList.remove('open');
        }
      });
      
      faqCard.classList.toggle('open');
    });
  });
  
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.faq-card')) {
      document.querySelectorAll('.faq-card.open').forEach(card => {
        card.classList.remove('open');
      });
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      const faqCard = this.closest('.faq-card');
      
      document.querySelectorAll('.faq-card.open').forEach(openCard => {
        if (openCard !== faqCard) {
          openCard.classList.remove('open');
          const openContent = openCard.querySelector('.faq-content');
          openContent.style.maxHeight = '0';
          openContent.style.opacity = '0';
          openContent.style.paddingTop = '0';
        }
      });
      
      if (faqCard.classList.contains('open')) {
        faqCard.classList.remove('open');
        targetContent.style.maxHeight = '0';
        targetContent.style.opacity = '0';
        targetContent.style.paddingTop = '0';
      } else {
        faqCard.classList.add('open');
        targetContent.style.maxHeight = targetContent.scrollHeight + 'px';
        targetContent.style.opacity = '1';
        targetContent.style.paddingTop = '1rem';
      }
    });
  });
  
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.faq-card')) {
      document.querySelectorAll('.faq-card.open').forEach(card => {
        card.classList.remove('open');
        const content = card.querySelector('.faq-content');
        content.style.maxHeight = '0';
        content.style.opacity = '0';
        content.style.paddingTop = '0';
      });
    }
  });
  

  window.addEventListener('resize', function() {
    document.querySelectorAll('.faq-card.open .faq-content').forEach(content => {
      content.style.maxHeight = content.scrollHeight + 'px';
    });
  });
});

