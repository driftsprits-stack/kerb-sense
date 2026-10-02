import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/**/*.ts'],
      exclude: ['src/lib/**/*.test.ts'],
      reporter: ['text', 'lcov'],
      thresholds: { lines: 80, functions: 80, branches: 70, statements: 80 },
    },
  },
});
