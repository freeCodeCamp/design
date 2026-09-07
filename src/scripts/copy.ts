export function wireCopy(root: Document): void {
  root.addEventListener('click', async event => {
    const button = (event.target as Element).closest<HTMLButtonElement>(
      'button[data-copy-url], button[data-copy-target]'
    );
    if (!button || button.disabled) return;
    const status = button
      .closest('[data-copy-group]')
      ?.querySelector<HTMLElement>('[data-copy-status]');
    button.disabled = true;
    if (status) status.textContent = 'Copying…';
    try {
      let text: string;
      if (button.dataset.copyUrl) {
        const response = await fetch(button.dataset.copyUrl);
        if (!response.ok) throw new Error('Source unavailable');
        text = await response.text();
      } else {
        const target = root.getElementById(button.dataset.copyTarget ?? '');
        text = (target?.querySelector('pre') ?? target)?.textContent ?? '';
      }
      if (!text.trim()) throw new Error('Source is empty');
      await navigator.clipboard.writeText(text);
      if (status) status.textContent = 'Copied.';
    } catch {
      if (status)
        status.textContent =
          'Could not copy. Open the source link to copy it manually.';
    } finally {
      button.disabled = false;
    }
  });
}
