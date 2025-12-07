import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    typecheck: {
      tsconfig: './tsconfig.vitest.json',
    },
    reporters: [
      'default',
      ['json', { outputFile: resolve(__dirname, 'test-results.json') }],
    ],
    outputFile: {
      json: resolve(__dirname, 'test-results.json'),
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        '**/*.config.*',
        '**/build.js',
      ],
    },
  },
});

