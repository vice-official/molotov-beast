(() => {
  const html = document.documentElement;
  const body = document.body;
  const cards = document.querySelectorAll(".pricing-card");
  const modals = document.querySelectorAll(".modal");

  // ------------------------------------------------------------------
  // Scroll lock: без скачков вверх-вниз, с временным снятием #pricing
  // ------------------------------------------------------------------
  const ScrollLocker = (() => {
    let savedY = 0;
    let prevHtmlScrollBehavior = "";
    let prevScrollRestoration = "";
    let strippedHash = null; // если уберём #pricing, сюда запишем, чтобы вернуть потом

    function stripHashIfPricing() {
      if (location.hash === "#pricing") {
        strippedHash = "#pricing";
        // Убираем хеш БЕЗ прокрутки и без hashchange
        history.replaceState(null, "", location.pathname + location.search);
      }
    }

    function restoreHashIfNeeded() {
      if (!strippedHash) return;
      const url = location.pathname + location.search + strippedHash;
      // Возвращаем хеш БЕЗ прокрутки (через replaceState)
      history.replaceState(null, "", url);
      strippedHash = null;
    }

    function lock() {
      // Сохраняем позицию и убираем плавность, чтобы исключить "дотягивание"
      savedY = window.scrollY || html.scrollTop || 0;

      prevHtmlScrollBehavior = html.style.scrollBehavior || "";
      html.style.scrollBehavior = "auto";

      if ("scrollRestoration" in history) {
        prevScrollRestoration = history.scrollRestoration;
        history.scrollRestoration = "manual";
      }

      stripHashIfPricing();

      // Фиксируем body (класс modal-open можно оставить для твоих стилей)
      body.classList.add("modal-open");
      body.style.position = "fixed";
      body.style.top = `-${savedY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflow = "hidden"; // на мобилках надёжнее, чем overflowY
      html.style.overflowX = "hidden";
    }

    function unlock() {
      const y = savedY;

      // Снимаем фиксацию
      body.classList.remove("modal-open");
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
      html.style.overflowX = "";

      // Даём браузеру "отлипнуть" от fixed, затем мгновенно возвращаем позицию
      // и уже после этого восстанавливаем smooth-scroll и hash
      requestAnimationFrame(() => {
        window.scrollTo(0, y);

        // Восстановим поведение скролла
        if (prevHtmlScrollBehavior) {
          html.style.scrollBehavior = prevHtmlScrollBehavior;
        } else {
          html.style.scrollBehavior = "";
        }

        if ("scrollRestoration" in history) {
          history.scrollRestoration = prevScrollRestoration || "auto";
        }

        // Вернуть хеш без прокрутки
        restoreHashIfNeeded();
      });
    }

    return { lock, unlock };
  })();

  // ------------------------------------------------------------------
  // Инициализация карточек и модалок
  // ------------------------------------------------------------------
  cards.forEach((card) => {
    const btn = card.querySelector(".btn-more");
    if (!btn) return;

    // Ховер-анимация карточки
    card.addEventListener("mouseenter", () => card.classList.add("is-hovered"));
    card.addEventListener("mouseleave", () =>
      setTimeout(() => card.classList.remove("is-hovered"), 250)
    );

    // Открытие соответствующей модалки
    btn.addEventListener("click", () => {
      const modalId = card.dataset.modal;
      const modal = document.getElementById(`modal-${modalId}`);
      if (!modal) return;

      const title = card.querySelector("h3")?.textContent.trim() || "";
      const modalBody = modal.querySelector(".modal-body");

      // Фон модалки (если предусмотрен)
      const modalImage = modal.querySelector(".modal-image");
      if (modalImage) {
        const imgSrc = card.querySelector(".card-img")?.getAttribute("src");
        if (imgSrc) modalImage.style.backgroundImage = `url('${imgSrc}')`;
      }

      // Кнопка "Связаться"
      const btnHTML = `
        <a class="btn-buy"
           href="https://t.me/M0L0T0W"
           target="_blank"
           rel="noopener noreferrer">
           Связаться
        </a>`;

      // Контент по тарифам
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
      } else {
        // fallback — вдруг появится новый тариф
        content = `
          <h3>${title}</h3>
          ${btnHTML}
        `;
      }

      // Заполняем тело модалки и показываем
      if (modalBody) modalBody.innerHTML = content;
      modal.classList.add("active");
      ScrollLocker.lock();

      // Обработчик кнопки связи (закрыть модалку, не трогать скролл)
      const buyLink = modalBody?.querySelector(".btn-buy[href]");
      if (buyLink) {
        buyLink.addEventListener(
          "click",
          (e) => {
            e.stopPropagation();
            // просто открываем ссылку — скролл вернёт unlock на закрытии
            // окно/вкладка откроется в target="_blank"
            // модалку закроем, чтобы фон не оставался зафиксированным
            modal.classList.remove("active");
            ScrollLocker.unlock();
          },
          { once: true }
        );
      }
    });
  });

  // ------------------------------------------------------------------
  // Унифицированное закрытие модалок
  // ------------------------------------------------------------------

  // Крестики
  document.querySelectorAll(".btn-close").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal");
      if (!modal) return;
      modal.classList.remove("active");
      ScrollLocker.unlock();
    });
  });

  // Клик по фону модалки
  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
        ScrollLocker.unlock();
      }
    });
  });

  // Закрытие по Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const active = document.querySelector(".modal.active");
      if (!active) return;
      active.classList.remove("active");
      ScrollLocker.unlock();
    }
  });

  // Подстраховка от горизонтального скролла-артефакта на iOS
  window.addEventListener("scroll", () => {
    if (window.scrollX !== 0) window.scrollTo(0, window.scrollY);
  }, { passive: true });
})();