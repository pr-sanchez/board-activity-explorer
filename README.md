# Board Activity Explorer

A frontend application for exploring activity on a collaborative board. Built with Next.js, TypeScript, and Tailwind CSS.

## Setup

Requires Node.js >= 20.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Testing

```bash
# Install Playwright browsers (first time only)
npx playwright install chromium

npm test              # Unit tests
npm run test:watch    # Unit tests (watch mode)
npm run test:e2e      # E2E tests (starts dev server automatically)
npm run test:e2e:ui   # E2E tests with Playwright UI
```

### Other Scripts

```bash
npm run lint       # ESLint
npm run format     # Prettier
npm run build      # Production build
```

## Project Structure

```
src/
├── app/                        # Next.js App Router, pages, API routes
├── components/ui/              # Shared generic UI primitives
├── features/board/             # Board feature (components, hooks, state, tests)
├── data/                       # Sticky notes JSON and persisted votes
├── hooks/                      # App-wide hooks
├── lib/                        # Utilities (color map, date formatting)
└── types/                      # TypeScript definitions
```

## Write-up

### Approach

I started with the data layer before touching any UI. The reducer, actions, and filtering hook came first since everything else depends on them. Once those had tests and worked, I built the components on top.

I scoped the work around what the requirements asked for: load notes, let users explore them, provide test coverage, and show a scalable structure. The voting system and auto-grouping came as natural extensions of "accessible ways to explore the notes."

### Assumptions

- 100 notes is small enough for client-side filtering without virtualization.
- One vote per note per browser is reasonable for a collaborative board. Voters are tracked server-side by a UUID generated per browser.
- The voting session is shared: when someone starts it, everyone sees it. This mirrors how facilitated workshops actually work.
- "Board activity over time" is covered by sorting notes by creation date.

### Architecture

**Component structure:** Feature-based. All board code lives in `features/board/` with colocated components, hooks, reducer, and tests. `components/ui/` is reserved for shared primitives. If the product grew with more features, each one stays self-contained.

**State management:** React Context + useReducer, with split contexts for state and dispatch. Components that only dispatch (like filter buttons) don't re-render on state changes. For this scale, this is the right tool. I'd move to Zustand or Redux if the state got significantly more complex.

**Data flow:** Unidirectional. JSON loads into the reducer, filters dispatch actions, `useFilteredNotes` derives visible notes via `useMemo`, components render. Votes go through Next.js API routes backed by a JSON file. Simple, but it demonstrates the full client-server pattern.

### Performance and Accessibility

Implemented: `useMemo` on all derived data, split contexts to minimize re-renders, semantic HTML (`<article>`, `<fieldset>`, `<time>`, `<button>`), `aria-label`/`aria-selected`/`aria-pressed` attributes, keyboard navigation on notes (Enter/Space).

Next steps would be: virtualizing the list for larger datasets, running a proper WCAG contrast audit on note colors, adding `aria-live` regions for filter count announcements, and skip-to-content navigation.

### UX Decisions

Voting is behind a "Start voting session" button to keep the default view clean. Clicking the thumbs up again withdraws your vote since a permanent choice felt frustrating. "Highlight top 5 voted" dims the rest to 35% opacity with a gold badge on winners, giving a clear visual hierarchy without hiding anything.

Auto-grouping uses keyword matching instead of an LLM. It's free, instant, and works well for the structured vocabulary in this dataset. In a real product, this is where you'd plug in an AI service.

I used CSS Modules over inline Tailwind because the class strings were getting hard to read. Modules give scoped styles without a growing global stylesheet.

### AI Usage

I used Claude Code as a pair programming tool. I made the architecture decisions (feature folders, Context over Redux, API routes for persistence, keyword grouping over LLM calls) and Claude helped with implementation speed: scaffolding, CSS conversions, test generation, and catching issues like the hydration mismatch with localStorage in SSR.

### Tradeoffs and Next Steps

- JSON file storage for votes works for demo but has no concurrency handling. A real app needs a database.
- Polling every 3s for vote sync is simple but wasteful. WebSockets or SSE would be better.
- Keyword-based grouping is fast but brittle with freeform text. Embeddings or an LLM would handle that better.
- No optimistic UI on votes. Adding it with rollback would make interactions feel snappier.
- No dark mode. The CSS variables are set up for it but the toggle wasn't in scope.
- Real user session instead setting a random user ID

### Time Spent

Around 3-4 hours.
