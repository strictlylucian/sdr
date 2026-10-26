import { expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import postcss from 'postcss';
import { motifDimensions, motifGrid } from '../../tooling/build/motif-grid.mjs';
import { motifPath, motifMask, motifStyles } from '../../tooling/build/motif.mjs';

it('retains the reference pixel geometry, checked centre and unequal stitch widths', () => {
  const rows = motifGrid();
  expect(motifDimensions).toEqual({ width: 194, height: 225 });
  expect(rows).toHaveLength(225);
  expect(rows.every(row => row.length === 194 && /^[.RB]+$/.test(row))).toBe(true);
  // Reviewed against the unwatermarked reference repeat, with its right diamond tip wrapped.
  expect(createHash('sha256').update(rows.join('\n')).digest('hex')).toBe('939a770a0d045d0a4be6f32c4667fc87c99b5ca09bbc27eeb4c2e4cb0f33af5b');
  expect([64, 73, 83].map(x => rows[104][x]).join('')).toBe('.R.');
  expect([64, 73, 83].map(x => rows[112][x]).join('')).toBe('R.R');
  expect(rows[50].slice(11, 20)).toBe('B'.repeat(9));
});

it('wraps all nine pixels of the diamond tip into the next repeat', () => {
  const rows = motifGrid();
  for (let y = 110; y < 119; y++) {
    expect(rows[y].slice(0, 9)).toBe('B'.repeat(9));
    expect(rows[y].slice(184)).toBe('B'.repeat(10));
  }
  expect(rows[109][0]).toBe('.');
  expect(rows[119][0]).toBe('.');
});

it('vectorises every reference pixel without overlaps, dropped stitches or added colours', () => {
  const rows = motifGrid();
  const actual = rows.map(row => Array(row.length).fill('.'));
  for (const thread of ['R', 'B']) {
    for (const match of motifPath(thread).matchAll(/M(\d+) (\d+)h(\d+)v(\d+)H(\d+)z/g)) {
      const [, left, top, width, height, close] = match.map(Number);
      expect(close).toBe(left);
      for (let y = top; y < top + height; y++) for (let x = left; x < left + width; x++) {
        expect(actual[y][x]).toBe('.');
        actual[y][x] = thread;
      }
    }
    const svg = decodeURIComponent(motifMask(thread).slice('url("data:image/svg+xml,'.length, -2));
    expect(svg).toContain('viewBox="0 0 194 225"');
    expect(svg).not.toMatch(/<image|<script|href=/);
  }
  expect(actual.map(row => row.join(''))).toEqual(rows);
});

it('generates tiled SVG masks with palette colours and the existing size API', () => {
  const css = motifStyles(), ast = postcss.parse(css);
  expect(css).not.toMatch(/base64|\.png|image-rendering/);
  for (const colour of ['blue', 'red']) expect(css).toContain(`var(--sdr-flag-${colour})`);
  const rule = ast.nodes.find(node => node.type === 'rule' && node.selector === '.sdr-motif::before,.sdr-motif::after');
  expect(rule?.type).toBe('rule');
  if (rule?.type !== 'rule') throw new Error('Missing motif mask CSS rule');
  expect(rule.nodes.find(node => node.type === 'decl' && node.prop === 'mask-repeat')).toMatchObject({ value: 'repeat-x' });
  for (const size of ['sm', 'md', 'lg', 'xl']) expect(css).toContain(`.sdr-motif--${size}`);
});
