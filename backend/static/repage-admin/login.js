(() => {
  const form = document.querySelector('#login-form');
  const password = document.querySelector('#id_password');
  const passwordToggle = document.querySelector('[data-password-toggle]');
  const submit = document.querySelector('[data-login-submit]');

  if (!(form instanceof HTMLFormElement)
    || !(password instanceof HTMLInputElement)
    || !(passwordToggle instanceof HTMLButtonElement)
    || !(submit instanceof HTMLInputElement)) return;

  passwordToggle.addEventListener('click', () => {
    const isVisible = password.type === 'text';
    password.type = isVisible ? 'password' : 'text';
    const label = isVisible ? 'Mostrar senha' : 'Ocultar senha';
    passwordToggle.setAttribute('aria-label', label);
    passwordToggle.setAttribute('title', label);
    passwordToggle.dataset.visible = String(!isVisible);
    password.focus();
  });

  form.addEventListener('submit', (event) => {
    if (form.dataset.submitting === 'true') {
      event.preventDefault();
      return;
    }
    if (!form.checkValidity()) return;
    form.dataset.submitting = 'true';
    submit.disabled = true;
    submit.value = 'Carregando…';
  });
})();
