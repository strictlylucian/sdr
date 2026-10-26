# Inter 4.1 — optimized embedded fonts

The original, unmodified upstream WOFF2 fonts remain at the top of this directory:

- https://raw.githubusercontent.com/rsms/inter/v4.1/docs/font-files/InterVariable.woff2
- https://raw.githubusercontent.com/rsms/inter/v4.1/docs/font-files/InterVariable-Italic.woff2
- https://raw.githubusercontent.com/rsms/inter/v4.1/LICENSE.txt

The `latin/` files are generated subsets used by the library and docs. They preserve 1,085 mapped characters in each face: Latin/Latin Extended, Romanian comma-below and cedilla characters, combining accents, punctuation, currencies and common symbols. Greek, Cyrillic and other characters outside the subset use the existing system font stack; input text remains Unicode.

All weights used by SDR (400–750), true italics, optical sizing (14–32), tabular/proportional numerals, ligatures, kerning, mark positioning, disambiguation and hinting remain. Unused thin/heavy weights, decorative alternates and non-Unicode platform name records are omitted. `subset-config.json` specifies the exact ranges and retained OpenType features.

`manifest.json` pins upstream and generated SHA-256 hashes. `subset-report.json` records coverage, axes, metrics and 660 outline comparisons per face at five weights and three optical sizes. Partial variable instancing may round outline deltas by up to two units in a 2048-unit em (0.0625 CSS pixels at 64px); the measured maximum is recorded. Default advances and line metrics are unchanged.

## Reproduce

```sh
python -m pip install -r tooling/fonts/font-requirements.txt
npm run fonts:subset
npm run build:library
```

The generator requires exact pinned fontTools/Brotli versions and validates both source hashes. Normal builds need only Node: they embed the checked-in subsets, verify their hashes/report, and make no downloads. Keep the config, generator, manifest, report and binaries together when updating the font.

Both faces are embedded in `fonts.generated.css`/`sdr.css` as data URLs. The complete OFL 1.1 notice remains in CSS, and the core package includes `dist/INTER-LICENSE.txt`. Portable runtime output remains exactly `sdr.css` and `sdr.js`.
