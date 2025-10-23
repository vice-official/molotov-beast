document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('.transformations-section');
  const grid = document.querySelector('.transformations-container');
  if (!section || !grid) return;

  const isMobile = () => matchMedia('(max-width: 768px)').matches;
  let track, cards, idx = 0;

  function mount() {
    if (!isMobile()) { unmount(); return; }
    if (section.querySelector('.t-c-prev')) return; // уже инициализировано

    // оборачиваем карточки в трек
    track = document.createElement('div');
    track.className = 't-track';
    while (grid.firstChild) track.appendChild(grid.firstChild);
    grid.appendChild(track);

    // базовая вёрстка трека
    grid.style.overflow = 'hidden';
    track.style.display = 'flex';
    track.style.willChange = 'transform';
    track.style.transition = 'transform .3s ease';

    cards = Array.from(track.children);

    // кнопки
    const prev = document.createElement('button');
    prev.className = 't-c-prev'; prev.setAttribute('aria-label','Предыдущая'); prev.textContent = '‹';
    const next = document.createElement('button');
    next.className = 't-c-next'; next.setAttribute('aria-label','Следующая'); next.textContent = '›';
    section.appendChild(prev); section.appendChild(next);

    const update = () => {
      const w = grid.clientWidth;
      cards.forEach(c => c.style.minWidth = w + 'px');
      track.style.transform = `translateX(${-idx * w}px)`;
    };

    prev.onclick = () => { idx = (idx - 1 + cards.length) % cards.length; update(); };
    next.onclick = () => { idx = (idx + 1) % cards.length; update(); };
    window.addEventListener('resize', update);

    update();
  }

  function unmount() {
    // убрать кнопки
    section.querySelectorAll('.t-c-prev, .t-c-next').forEach(b => b.remove());
    // распаковать трек
    const t = grid.querySelector('.t-track');
    if (t) { while (t.firstChild) grid.appendChild(t.firstChild); t.remove(); }
    grid.style.overflow = '';
  }

  mount();
  window.addEventListener('resize', mount);
});
