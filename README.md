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
├── features/board/             # Board feature (components, hooks, state, tests)
├── data/                       # Sticky notes JSON and persisted votes
├── hooks/                      # App-wide hooks
├── lib/                        # Utilities (color map, date formatting)
└── types/                      # TypeScript definitions
```
