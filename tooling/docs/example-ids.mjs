import { JSDOM } from 'jsdom';

/** Give standalone documentation markup readable IDs without changing React IDs. */
export function simplifyExampleIds(html, name, locale) {
  const fragment = JSDOM.fragment(html);
  const elements = [...fragment.querySelectorAll('*')];
  const prefix = `_${locale}-${name}-R_`;
  const generated = elements.filter(element => element.id.startsWith(prefix));
  const roots = new Set(generated.map(element => {
    const end = element.id.indexOf('_', prefix.length);
    if (end === -1) throw new Error(`Unrecognised example ID: ${element.id}`);
    return element.id.slice(0, end + 1);
  }));
  const taken = new Set(elements.filter(element => element.id && !element.id.startsWith(prefix)).map(element => element.id));
  const names = new Map();
  for (const root of roots) {
    const target = generated.find(element => element.id === root);
    const component = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    const base = (target?.getAttribute('name') ?? component).replace(/^invalid-/, '').replace(/[^a-zA-Z0-9-]/g, '-');
    const members = generated.filter(element => element.id === root || element.id.startsWith(`${root}-`));
    let candidate = base;
    let number = 2;
    while (members.some(element => taken.has(candidate + element.id.slice(root.length)))) candidate = `${base}-${number++}`;
    names.set(root, candidate);
    members.forEach(element => taken.add(candidate + element.id.slice(root.length)));
  }
  const replace = value => {
    for (const [root, readable] of names) value = value.replaceAll(root, readable);
    return value;
  };
  const references = new Set(['id', 'for', 'aria-labelledby', 'aria-describedby', 'aria-controls', 'aria-owns', 'aria-activedescendant', 'aria-details', 'aria-errormessage', 'headers', 'list', 'form', 'data-sdr-return-focus']);
  for (const element of elements) for (const attribute of [...element.attributes]) {
    if (references.has(attribute.name) || (attribute.name === 'href' && attribute.value.startsWith('#'))) element.setAttribute(attribute.name, replace(attribute.value));
  }
  const container = fragment.ownerDocument.createElement('div');
  container.append(fragment);
  return container.innerHTML;
}
