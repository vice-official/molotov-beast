const body = document.body;
const cards = document.querySelectorAll(".pricing-card");

cards.forEach((card) => {
  const btn = card.querySelector(".btn-more");
  if (!btn) return;

  card.addEventListener("mouseenter", () => card.classList.add("is-hovered"));
  card.addEventListener("mouseleave", () => setTimeout(() => card.classList.remove("is-hovered"), 250));

  btn.addEventListener("click", () => {
    const modalId = card.dataset.modal;
    const modal = document.getElementById(`modal-${modalId}`);
    if (!modal) return;

    const title = card.querySelector("h3").textContent.trim();
    const modalBody = modal.querySelector(".modal-body");

    // фон модалки
    const modalImage = modal.querySelector(".modal-image");
    if (modalImage) {
      const imgSrc = card.querySelector(".card-img")?.getAttribute("src");
      if (imgSrc) modalImage.style.backgroundImage = `url('${imgSrc}')`;
    }

    const btnHTML = `
      <a class="btn-buy"
         href="https://t.me/M0L0T0W"
         target="_blank"
         rel="noopener noreferrer">
         Связаться
      </a>`;

    let content = "";

    if (modalId === "start") {
      content = `
        <h3>${title}</h3>
        <p class="modal-description">
          Идеальный выбор, если ты хочешь начать путь к результату с персонально подобранной схемы.
        </p>
        <div class="modal-price">₽7 500 / мес</div>
        <small style="opacity:.7;font-size:.85rem;display:block;margin-bottom:1rem;">
          Полное ведение (≈ 4 мес) — ₽30 000
        </small>
        ${btnHTML}
      `;
    } else if (modalId === "breakthrough") {
      content = `
        <h3>${title}</h3>
        <p class="modal-description">
          Для тех, кто готов идти до конца. Тариф включает полное ведение и индивидуальные корректировки.
        </p>
        <div class="modal-price">₽20 000 / мес</div>
        <small style="opacity:.7;font-size:.85rem;display:block;margin-bottom:1rem;">
          Полное ведение (≈ 4 мес) — ₽80 000
        </small>
        ${btnHTML}
      `;
    } else if (modalId === "premium") {
      content = `
        <h3>${title}</h3>
        <p class="modal-description">
          Максимальный уровень сопровождения и вовлечённости, постоянная обратная связь 24/7.
        </p>
        <div class="modal-price">₽40 000 / мес</div>
        <small style="opacity:.7;font-size:.85rem;display:block;margin-bottom:1rem;">
          Полное ведение (≈ 4 мес) — ₽160 000
        </small>
        ${btnHTML}
      `;
    }

    modalBody.innerHTML = content;
    modal.classList.add("active");
    body.classList.add("modal-open");

    const buyLink = modalBody.querySelector(".btn-buy[href]");
    if (buyLink) {
      buyLink.addEventListener("click", (e) => {
        e.stopPropagation();
        const url = buyLink.getAttribute("href");
        window.open(url, "_blank", "noopener,noreferrer");
        modal.classList.remove("active");
        body.classList.remove("modal-open");
        setTimeout(() => window.scrollTo(0, savedY), 60);
      });
    }
  });
});

document.querySelectorAll(".btn-close").forEach((btn) => {
  btn.addEventListener("click", () => {
    const modal = btn.closest(".modal");
    modal.classList.remove("active");
    body.classList.remove("modal-open");
  });
});

window.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    e.target.classList.remove("active");
    body.classList.remove("modal-open");
  }
});

// ===== Scroll lock =====
(function(){
  let savedY = 0;
  const html = document.documentElement;
  const body = document.body;

  function lockScroll(){
    savedY = window.scrollY || document.documentElement.scrollTop || 0;
    body.style.position = 'fixed';
    body.style.top = `-${savedY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflowY = 'scroll';
    body.style.overflowX = 'hidden';
    html.style.overflowX = 'hidden';
    html.classList.add('modal-open');
    body.classList.add('modal-open');
  }

  function unlockScroll(){
    const y = savedY;
    body.style.position = '';
    body.style.top = '';
    body.style.left = '';
    body.style.right = '';
    body.style.width = '';
    body.style.overflow = '';
    html.style.overflowX = '';
    html.classList.remove('modal-open');
    body.classList.remove('modal-open');
    requestAnimationFrame(() => window.scrollTo(0, y));
  }

  function syncLockState(){
    const isActive = !!document.querySelector('.modal.active');
    isActive ? lockScroll() : unlockScroll();
  }

  document.querySelectorAll('.modal').forEach(m => {
    new MutationObserver(syncLockState).observe(m, { attributes: true, attributeFilter: ['class'] });
  });

  window.addEventListener('orientationchange', syncLockState);
  window.addEventListener('resize', syncLockState);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setTimeout(syncLockState, 0); });
})();
