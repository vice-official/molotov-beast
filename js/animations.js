const sections = document.querySelectorAll('.fade-in-section');
const fadeIns = document.querySelectorAll('.fade-in-left, .fade-in-right');
const pricingCards = document.querySelectorAll('.pricing-card');
const observerOptions = {
  root: null,
  threshold: 0.1,
  rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

sections.forEach(section => {
  observer.observe(section);
});

fadeIns.forEach(el => {
  observer.observe(el);
});

const pricingObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      pricingObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.2,
  rootMargin: '0px 0px -100px 0px'
});

pricingCards.forEach(card => {
  pricingObserver.observe(card);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

