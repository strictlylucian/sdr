import { motifGrid, motifDimensions } from './motif-grid.mjs';

/** Merge equal scanlines into vector rectangles, without resampling any stitch. */
export function motifPath(thread) {
  const rows = motifGrid(), rectangles = [];
  for (let y = 0; y < rows.length;) {
    let bottom = y + 1;
    while (bottom < rows.length && rows[bottom] === rows[y]) bottom++;
    for (let x = 0; x < rows[y].length;) {
      if (rows[y][x] !== thread) { x++; continue; }
      let right = x + 1;
      while (rows[y][right] === thread) right++;
      rectangles.push(`M${x} ${y}h${right - x}v${bottom - y}H${x}z`);
      x = right;
    }
    y = bottom;
  }
  return rectangles.join('');
}

export function motifMask(thread) {
  const { width, height } = motifDimensions;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><path fill="black" d="${motifPath(thread)}"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export function motifStyles() {
  const { width, height } = motifDimensions;
  return `/* Reference-matched SVG geometry embedded in CSS; no raster or external assets. */
.sdr-motif { --sdr-motif-size:var(--sdr-space-7); position:relative; inline-size:100%; block-size:var(--sdr-motif-size); flex:none; background-color:var(--sdr-motif-ground); }
.sdr-motif::before,.sdr-motif::after { content:""; position:absolute; inset:0; pointer-events:none; mask-size:calc(var(--sdr-motif-size)*${width}/${height}) 100%; mask-position:0 0; mask-repeat:repeat-x; }
.sdr-motif::before { background-color:var(--sdr-motif-primary); mask-image:${motifMask('R')}; }
.sdr-motif::after { background-color:var(--sdr-motif-secondary); mask-image:${motifMask('B')}; }
.sdr-motif--sm { --sdr-motif-size:var(--sdr-space-5); }
.sdr-motif--md { --sdr-motif-size:var(--sdr-space-7); }
.sdr-motif--lg { --sdr-motif-size:var(--sdr-space-8); }
.sdr-motif--xl { --sdr-motif-size:var(--sdr-space-9); }
`;
}
