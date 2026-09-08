export function wirePlayground(root: Document): void {
  const input = root.querySelector<HTMLInputElement>('[data-component-filter]');
  if (!input) return;
  const entries = [...root.querySelectorAll<HTMLElement>('[data-component]')];
  const status = root.querySelector<HTMLElement>('[data-filter-status]');
  const filter = () => {
    const query = input.value.trim().toLocaleLowerCase();
    let matches = 0;
    for (const entry of entries) {
      entry.hidden = !(entry.dataset.search ?? '')
        .toLocaleLowerCase()
        .includes(query);
      if (!entry.hidden) matches++;
      const link = root.querySelector<HTMLElement>(
        `[data-component-link="${entry.dataset.component}"]`
      );
      if (link) link.hidden = entry.hidden;
    }
    root
      .querySelectorAll<HTMLElement>('[data-component-group]')
      .forEach(group => {
        group.hidden = !group.querySelector('[data-component]:not([hidden])');
      });
    root.querySelectorAll<HTMLElement>('[data-nav-group]').forEach(group => {
      group.hidden = !group.querySelector(
        '[data-component-link]:not([hidden])'
      );
    });
    if (status)
      status.textContent = !query
        ? ''
        : matches
          ? `${matches} matching component${matches === 1 ? '' : 's'}.`
          : 'No components found. Try another name or clear the search.';
  };
  input.addEventListener('input', filter);
  const revealHash = () => {
    const id = root.defaultView?.location.hash.slice(1);
    const target = entries.find(entry => entry.dataset.component === id);
    if (!target) return;
    input.value = '';
    filter();
    root.getElementById(id!)?.scrollIntoView?.({ block: 'start' });
  };
  root.defaultView?.addEventListener('hashchange', revealHash);
  filter();
  revealHash();
}
