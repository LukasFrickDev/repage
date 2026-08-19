(() => {
  if (window.repageDeleteSelectedActionsInitialized) return;
  window.repageDeleteSelectedActionsInitialized = true;

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-delete-selected]');
    if (!button) return;

    const form = button.form;
    const action = form?.querySelector('select[name="action"]');
    if (action) action.value = 'delete_selected';
  });
})();
