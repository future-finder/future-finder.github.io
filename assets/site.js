(() => {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') root.dataset.theme = 'dark';

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('open', open);
  });

  document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
    const dark = root.dataset.theme !== 'dark';
    root.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  });

  const progress = document.querySelector('.reading-progress');
  const article = document.querySelector('.article');
  if (progress && article) {
    const update = () => {
      const start = article.offsetTop;
      const distance = Math.max(1, article.offsetHeight - innerHeight);
      const value = Math.min(1, Math.max(0, (scrollY - start) / distance));
      progress.style.transform = `scaleX(${value})`;
    };
    addEventListener('scroll', update, { passive: true });
    update();
  }

  document.querySelectorAll('.prose pre').forEach((block) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-code';
    button.textContent = '复制';
    button.addEventListener('click', async () => {
      await navigator.clipboard.writeText(block.querySelector('code')?.textContent ?? '');
      button.textContent = '已复制';
      setTimeout(() => (button.textContent = '复制'), 1200);
    });
    block.append(button);
  });
})();
