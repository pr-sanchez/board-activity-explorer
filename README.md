# Board Activity Explorer

A frontend application for exploring activity on a collaborative board. Built with Next.js, TypeScript, and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js >= 20
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

```bash
# Unit & integration tests
npm test

# Unit tests in watch mode
npm run test:watch

# E2E tests (requires dev server or will start one automatically)
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui
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
├── app/                    # Next.js App Router (pages, layout)
├── components/ui/          # Reusable UI primitives
├── features/board/         # Board feature module
│   ├── __tests__/          # Unit tests for context & hooks
│   ├── components/         # Board-specific components
│   ├── hooks/              # Custom hooks (filtering, etc.)
│   ├── context.tsx         # State management (React Context + useReducer)
│   └── index.ts            # Public API
├── data/                   # Mock JSON data (100 sticky notes)
├── lib/                    # Shared utilities
└── types/                  # TypeScript type definitions
```

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** for styling
- **React Context + useReducer** for state management
- **Vitest + React Testing Library** for unit/integration tests
- **Playwright** for E2E tests
