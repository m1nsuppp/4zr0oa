import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export const baseConfig = defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',
      reporter: [
        [
          'json',
          {
            file: `../coverage.json`,
          },
        ],
      ],
      enabled: true,
    },
  },
  plugins: [tsconfigPaths()],
});
