const body = document.body;
const cards = document.querySelectorAll(".pricing-card");

cards.forEach((card) => {
  const btn = card.querySelector(".btn-more");
  if (!btn) return;

  card.addEventListener("mouseenter", () => {
    card.classList.add("is-hovered");
  });
  card.addEventListener("mouseleave", () => {
    setTimeout(() => card.classList.remove("is-hovered"), 250);
  });

  btn.addEventListener("click", () => {
    const modalId = card.dataset.modal;
    const modal = document.getElementById(`modal-${modalId}`);
    if (!modal) return;

    const title = card.querySelector("h3").textContent.trim();
    const imgSrc = card.querySelector(".card-img").getAttribute("src");
    const modalBody = modal.querySelector(".modal-body");
    const modalImage = modal.querySelector(".modal-image");

    modalImage.style.backgroundImage = `url('${imgSrc}')`;

    let content = "";

    if (modalId === "start") {
      content = `
        <h3>${title}</h3>
        <div class="modal-price">₽7 500 / мес</div>
        <small style="opacity:.7;font-size:.85rem;display:block;margin-bottom:1rem;">Полное ведение (≈ 4 мес) — ₽30 000</small>
        <button class="btn-buy">Купить</button>
        <p class="modal-description">
          Идеальный выбор, если ты хочешь начать путь к результату с персонально подобранной схемы.
          Тариф включает индивидуальный подбор препаратов на основе анализов и текущего состояния здоровья.
          Ты получаешь точную схему приёма и дозировки под твои цели.
          Отлично подходит для тех, кто точно знает чего хочет.
        </p>
      `;
    } else if (modalId === "breakthrough") {
      content = `
        <h3>${title}</h3>
        <div class="modal-price">₽20 000 / мес</div>
        <button class="btn-buy">Купить</button>
        <p class="modal-description">
          Для тех, кто готов идти до конца.
          Тариф включает полное ведение с персональным питанием, тренировками и отчётами каждую неделю,
          а также всё то, что входит в тариф «Старт»: индивидуальный подбор препаратов и корректировки по анализам.
          Ты получаешь системный подход к тренировкам и питанию, где все работает на твой прогресс.
        </p>
      `;
    } else if (modalId === "premium") {
      content = `
        <h3>${title}</h3>
        <div class="modal-price">₽40 000 / мес</div>
        <button class="btn-buy">Купить</button>
        <p class="modal-description">
          Максимальный уровень сопровождения и вовлечённости.
          Включает в себя все преимущества тарифа «Прорыв», а также <strong>постоянную обратную связь 24/7</strong> —
          ответы на любые вопросы «что, почему и как», детальный разбор анализов, объяснение принципов тренировок, индивидуальные корректировки по ходу работы.
          Иногда в рамках тарифа проводятся <strong>очные тренировки</strong>.
          Этот формат ведения подойдет тем, кто хочет добиться максимального результата и выложиться на все 200%. 
        </p>
      `;
    }

    modalBody.innerHTML = content;
    modal.classList.add("active");
    body.classList.add("modal-open");
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
