(() => {
  const storedTheme = window.localStorage.getItem('theme');
  const initialTheme = storedTheme === 'dark' ? 'dark' : 'light';

  const applyTheme = (theme) => {
    const selected = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = selected;
    window.localStorage.setItem('theme', selected);

    const toggle = document.querySelector('[data-theme-toggle]');
    if (!toggle) return;

    const nextTheme = selected === 'dark' ? 'light' : 'dark';
    const label = `Ativar tema ${nextTheme === 'dark' ? 'escuro' : 'claro'}`;
    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('title', label);
  };

  applyTheme(initialTheme);
  window.addEventListener('DOMContentLoaded', () => applyTheme(initialTheme));
  window.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('[data-theme-toggle]') : null;
    if (!target) return;
    applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });
})();
