# SDR React — Sistem de Design Românesc

[Română](./README.ro.md)

Independent Romanian design-system proposal. Experimental alpha; no government affiliation or certified accessibility claim.

Typed React components for public-service interfaces. Styles are supplied by the companion core package. All labels and dynamic messages are application-owned; SDR has no i18n engine or dictionaries and accepts content in any language. SdrProvider forwards native lang without selecting translations. CharacterCount requires a formatCount callback.

## Installation

```sh
npm install @strictlylucian/sdr-core@alpha @strictlylucian/sdr-react@alpha
```

```tsx
import '@strictlylucian/sdr-core/styles.css';
import { SdrProvider, TextInput, Button } from '@strictlylucian/sdr-react';

export function Example() {
  return (
    <SdrProvider lang="ro" theme="light" density="comfortable">
      <form className="sdr-stack" onSubmit={event => event.preventDefault()}>
        <TextInput id="full-name" name="full-name" label="Nume complet" autoComplete="name" required />
        <div><Button type="submit">Continuă</Button></div>
      </form>
    </SdrProvider>
  );
}
```

Install the core and React packages together at matching versions. React and React DOM are peer dependencies. Import the stylesheet once in the host application's global entry point.

Components support controlled native input values, refs, labels, hints and error associations. A form builder owns its schema, validation rules, routing and persistence; SDR provides the rendering and component interactions. Stable field IDs help preserve label/error relationships and focus when forms change dynamically.

The shared behaviour controllers mount and clean up through React effects. There is no separate portable-script initialisation step for React-owned components.

The package supports server rendering; interactive components also need a client-rendered or hydrated React tree. Public alpha APIs can change, so pin exact versions when integrating the form builder.

Code is MIT licensed. Embedded font notices are distributed with `@strictlylucian/sdr-core`.
