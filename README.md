# gqlforge

A TypeScript library built with esbuild and tested with Vitest.

## Development

### Prerequisites

- Node.js >= 20.0.0
- npm

### Installation

```bash
npm install
```

### Available Scripts

- `npm run build` - Build the library for production
- `npm run dev` - Build the library in watch mode
- `npm test` - Run tests in watch mode
- `npm run test:ui` - Run tests with Vitest UI
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:run` - Run tests once (CI mode)
- `npm run typecheck` - Type check without emitting files
- `npm run clean` - Remove build artifacts

## Project Structure

```
.
├── src/           # Source files
├── dist/          # Build output (generated)
├── build.js       # esbuild configuration
├── vitest.config.ts
└── tsconfig.json

```

## License

MIT

