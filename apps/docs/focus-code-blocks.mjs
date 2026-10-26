/** Keep horizontally scrollable examples reachable by keyboard at narrow widths. */
export default function focusCodeBlocks() {
  const visit = node => {
    if (node.type === 'element' && node.tagName === 'pre') node.properties.tabIndex = 0;
    for (const child of node.children ?? []) visit(child);
  };
  return { name: 'sdr-keyboard-code', hooks: { postprocessRenderedBlock: ({ renderData }) => visit(renderData.blockAst) } };
}
