/** Prefix authored Markdown destinations, leaving displayed code untouched. */
export default function docsBaseLinks({ base }) {
  return tree => {
    function visit(node) {
      if ((node.type === 'link' || node.type === 'image' || node.type === 'definition') && node.url?.startsWith('/') && !node.url.startsWith('//')) {
        if (base !== '/' && !node.url.startsWith(base)) node.url = base.slice(0, -1) + node.url;
      }
      for (const child of node.children ?? []) visit(child);
    }
    visit(tree);
  };
}
