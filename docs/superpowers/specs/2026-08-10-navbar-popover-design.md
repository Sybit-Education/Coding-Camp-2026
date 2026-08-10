# NavigationBar Popover Polish Design

## Ziel

Das aufklappende Menü der unteren Navigation soll als kompakter Popover hochwertiger, ruhiger und besser lesbar wirken, ohne das bestehende Navigationskonzept zu ändern.

## Gewählter Ansatz

Wir behalten den Hamburger-Trigger rechts in der Bottom Navigation bei. Beim Öffnen erscheint darüber ein kleiner, viewport-sicherer Popover im Card-Stil. Die Menüeinträge werden optisch leiser als die primären Navigationsbuttons gestaltet, damit das Menü nicht wie eine gestapelte Button-Leiste wirkt.

## Scope

- Änderungen primär in `src/components/Navbar.vue`.
- Hauptnavigation bleibt unten fixiert.
- Popover bleibt kompakt und rechts am Hamburger ausgerichtet.
- Menü schließt beim Klick außerhalb und beim Auswählen eines Menüeintrags.
- Externe Links behalten `target="_blank"` und `rel="noopener noreferrer"`.
- Keine Routenänderungen, keine neue State-Management-Abhängigkeit.

## UX-Details

- Popover: dezente helle Oberfläche, Border, stärkerer Schatten, abgerundete Ecken und klare Innenabstände.
- Menüeinträge: volle Breite, einfache Textzeilen mit Hover/Focus-Zustand statt primärer grüner Buttons.
- Lange deutsche Labels bleiben mehrzeilig lesbar.
- Maximalhöhe und Breite bleiben an den Viewport gebunden.
- Fokus-Styling nutzt die vorhandenen globalen Focus-Regeln.

## Validierung

- Baseline ist sauber mit `npm run type-check` und `npm run lint`.
- Nach Umsetzung mindestens erneut `npm run type-check`, `npm run lint` und ein Produktionsbuild (`npm run build`).

## Branch/PR

Die Umsetzung erfolgt isoliert im Branch `fix/navbar-popover-polish` in einem Worktree, damit bestehende uncommitted Änderungen im Hauptcheckout nicht in den PR geraten.
