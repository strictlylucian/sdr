---
name: SDR civic documentation
version: alpha
colors:
  institutional: '#002b7f'
  action: '#002b7f'
  text: '#182439'
  supporting: '#49566b'
  canvas: '#f7f8fa'
  surface: '#ffffff'
  alternate: '#edf0f5'
  divider: '#d7dce5'
  control-border: '#6b778b'
  error: '#ca3535'
  cultural-accent: '#ce1126'
  flag-yellow: '#fcd116'
typography:
  family: Inter
  body: 1.1875rem
  page-heading: 2rem / 3rem
  section-heading: 1.6875rem / 2.25rem
geometry:
  radius: 0.125rem
  elevated-radius: 0.25rem
---

# SDR design direction

## Shared appearance

The canonical palettes live in packages/core/src/tokens.ts. The docs theme is generated from those tokens by tooling/build/docs-theme.mjs; do not introduce a separate documentation palette. Masthead colours, borders and keyboard focus have explicit semantic roles.

Dark appearance uses a near-black navy canvas (#080c12), a dark content surface (#0e141e) and restrained raised surfaces (#192332). The masthead retains flag blue (#002b7f) and one inner red rule (#ce1126) in every library theme and both docs appearances. Header keyboard focus uses flag yellow (#fcd116). The values derive from the RGB specification in the annex to [Law 176/2023](https://legislatie.just.ro/public/DetaliiDocument/271454). Semantic interaction and status colours remain theme-specific for contrast. Separators structure the page without bright outlines around every region.

Interactive docs previews follow documentation appearance by default. A person can explicitly select any library theme; that choice remains until they choose Match documentation again. Theme and density controls must remain independent.

Reference: [IBM DESIGN.md from VoltAgent's collection](https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/ibm/DESIGN.md), reviewed 2026-10-25. This independent analysis informs the flat geometry and restrained hierarchy; IBM identity, fonts and marketing layouts are not copied.

## Purpose and atmosphere

SDR is documentation and working examples for a Romanian public-service design system. It should feel reliable, practical and carefully maintained. People should immediately understand where they are, which page to read and how to use a component.

The project remains an independent proposal. The homepage carries the proposal badge; one plain notice beneath each documentation title describes the alpha status. Do not suggest institutional approval. Product pages describe SDR on its own terms rather than comparing it with foreign systems.

## Colour and surfaces

White is the main reading surface. Pale neutral grey separates navigation and example toolbars. Deep navy identifies the site header. Blue identifies links and the primary action. Red is a small cultural accent, separate from error semantics.

Avoid atmospheric gradients, oversized decorative illustrations, glass effects and shadows on ordinary page content. Use a one-pixel divider or whitespace for separation. Keep shadows for floating interactive layers.

## Typography

Use Inter 4.1 as the shared sans serif family across library and docs. Embed its optimized Latin/Latin Extended variable regular and italic WOFF2 faces in CSS, retaining all UI weights (400–750), optical sizing, Romanian diacritics and combining marks; preserve the OFL license and the two-file portable contract. Code retains its monospace stack. Body text stays comfortably readable, with a 1.6 line height. Responsive typography is part of the foundation, shared by the library and docs. At 40rem, page headings change from 32px to 48px, section headings from 27px to 36px, and subsection headings and lead text from 21px to 24px (at a 16px root). Body text remains 19px and supporting text 16px on both sides of the breakpoint. Heading size classes, fieldset legends and numbered text utilities resolve through the same rem tokens; line heights scale with text size. Density never reduces reading text. Heading rhythm also responds at 40rem: xl uses 32/48px after, lg 24/32px, md and sm 16/24px; contextual space before is larger than after. First headings have no extra top margin. Stack accounts for its existing gap, explicit gap overrides remain explicit, and compact components own their internal spacing. Page headings use normal tracking and bold weight. Avoid enormous slogans, tight negative tracking, decorative uppercase eyebrows and multiple competing title scales.

Use literal headings: Componente, Tipografie, Spațiere, Instalare. Copy should explain what a person can do. Avoid promotional claims, abstract principles as feature cards, numbered decorative blocks and invented slogans.

Romanian technical copy uses familiar borrowed terms: link, chip, badge, tooltip, toast, skeleton, header, footer, switch, stack, taburi and override-uri. Explain their purpose in Romanian. Keep public-service labels and natural Romanian terms in Romanian. Hyperlinks are linkuri, with forms linkul and linkurile; avoid literal translations in this context.

## Layout

Use the SDR spacing tokens for every authored margin, padding and gap. Align titles, introduction, section links and examples to the same leading edge. Use one spacing owner per relationship. A 24px group step, 32px gutter and 48px section step establish the rhythm at the standard root size.

The homepage is a directory: title, short purpose, clear installation action, documentation sections and project status. Desktop navigation is compact. At narrow widths and increased text sizes, native search/menu controls keep destinations reachable; full navigation appears only when the header has room.

## Components

Buttons and fields have nearly square corners. Prose links stay underlined. Documentation destinations are heading-and-description groups with thin rules, not raised marketing cards. Example toolbars use quiet labels and native selectors.

## Romanian identity

Use Romanian first, with a complete equivalent English edition. Preserve diacritics and local service conventions. The embroidery band reconstructs the supplied reference geometry with stepped rosettes, checked centres, corner hooks, diamonds and offset checked borders. Two SVG path masks are embedded in CSS and painted by the dedicated motif-primary, motif-secondary and motif-ground theme roles. Light, Heritage and Contrast use flag red/blue on white. Dark uses the same flag red (#ce1126) and off-white (#edf1f7) on near-black (#080c12), following the surrounding theme without colour filters. Motif colours can be adjusted independently of masthead and status roles. The 194 × 225-unit repeat retains reference pixel coordinates, wrapping the full diamond tip across the seam. The library ships no reference photograph, bitmap or separate motif asset. Documentation chrome currently uses no motif in the header, hero or footer; component and foundation examples document its available uses. Decoration stays separate from text and functional controls, remains hidden from assistive technology and disappears in forced colours. The implementation makes no claim of regional provenance, symbolic meaning or exclusivity over traditional ornament; catalog/motif-provenance.json records its construction.

## Accessibility and verification

Keep the 44–48px standalone control baseline, visible focus and documented contrast requirements. Retain language switching, search, forced colours, reduced motion and responsive reflow. Validate desktop and mobile screenshots. Automated evidence does not replace assistive-technology research.

Primary buttons and the docs start action share the masthead flag blue (#002b7f) with white text in every theme. Button-specific roles keep dark links and other interactive text legible; dark buttons have a contrasting boundary. Hover darkens the same blue, while keyboard focus and pressed states retain flag yellow.

Motif height defaults to3rem (48px), with sm/24px, md/48px, lg/64px and xl/96px variants shared by React and CSS classes. Scale the full repeat proportionally; preserve the wrapped diamond stitch and both borders.

Layout containers own the gaps between their direct children. A Divider inside Stack has no additional margins; Card footers use the card gap once. Search and password actions align with their input controls. Summary-list rows share column tracks so optional actions cannot shift the value column. Disclosure content follows the title edge, while the accordion toolbar follows the component edge. Timeline and menu gutters use logical directions. Close actions share a baseline with their headings or messages and retain trailing alignment when wrapped.

Pattern compositions keep primary actions at their natural width, use the date-field layout for payment expiry, and share leading edges across page chrome. Step descriptions use the small internal spacing token. Summary/task rows inside a Stack start at the parent gap; result messages group their copy and links explicitly. Wrapped result cards fill their grid row so footer links align. Hidden cookie acknowledgements and empty result grids leave no layout item behind.

## Form states and study material

Native disabled/readOnly attributes retain browser and form-data semantics. Controls without native readonly support use documented fixed-value SummaryList examples. Error rails begin at the first text row and end at the final control or compound-group boundary. A stable wrapper around fieldsets keeps native legend geometry separate from the rail and preserves entered values during error changes.

The error/destructive palette uses #CA3535, #D76868 in Dark and #982828 in Contrast. Decorative flag colours keep their separate role. Original institutional identity boards belong to the experimental studies section of the docs; they do not supply a default library emblem.

Choice controls use a dedicated line height and a first-line control slot. Hints occupy a separate grid row. Choice labels have no block padding; spacing belongs between choice containers, and the error rail ends at the final rendered control or hint. An invisible label hit area retains the control-height token without adding painted space. Native radio error rings are drawn by the control wrapper to preserve circular geometry across browser engines. Horizontal radio groups have no enclosing frame.
