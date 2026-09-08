export function wireTheme(root: Document): void {
  root.querySelectorAll<HTMLElement>('[data-theme-options]').forEach(group => {
    const buttons = [
      ...group.querySelectorAll<HTMLButtonElement>('[data-theme]')
    ];
    const previewId = buttons[0]?.getAttribute('aria-controls');
    const target = previewId
      ? root.getElementById(previewId)
      : root.documentElement;
    if (!target) return;
    const sync = () => {
      const theme = target.classList.contains('light-palette')
        ? 'light'
        : 'dark';
      buttons.forEach(button =>
        button.setAttribute(
          'aria-pressed',
          String(button.dataset.theme === theme)
        )
      );
    };
    if (previewId) {
      target.classList.toggle(
        'light-palette',
        root.documentElement.classList.contains('light-palette')
      );
      target.classList.toggle(
        'dark-palette',
        !root.documentElement.classList.contains('light-palette')
      );
    }
    sync();
    buttons.forEach(button =>
      button.addEventListener('click', () => {
        const light = button.dataset.theme === 'light';
        target.classList.toggle('light-palette', light);
        target.classList.toggle('dark-palette', !light);
        if (!previewId) {
          try {
            root.defaultView?.localStorage.setItem(
              'fcc-palette',
              light ? 'light' : 'dark'
            );
          } catch {}
        }
        sync();
      })
    );
  });
}
