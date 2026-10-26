export function updateSidebarSelection() {
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-sdr-parent],[data-sdr-variant],[data-sdr-state]')];
  const local = links.filter(link => new URL(link.href).pathname === location.pathname);
  if (!local.length) return;
  const target = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
  const section = target?.closest<HTMLElement>('.sdr-component-state,.sdr-component-variant');
  const hash = section ? '#' + section.id : location.hash;
  const active = local.find(link => (link.hasAttribute('data-sdr-state') || link.hasAttribute('data-sdr-variant')) && new URL(link.href).hash === hash)
    ?? local.find(link => link.hasAttribute('data-sdr-parent'));
  if (!active) throw new Error('Documentation sidebar is missing its overview link.');
  for (const link of local) link.removeAttribute('aria-current');
  active.setAttribute('aria-current', active.hasAttribute('data-sdr-parent') ? 'page' : 'location');
  for (let group = active.closest('details'); group; group = group.parentElement?.closest('details') ?? null) group.open = true;
}
