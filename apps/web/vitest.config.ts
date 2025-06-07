import { defineConfig, mergeConfig } from 'vitest/config';
import { uiConfig } from '@repo/vitest-config/ui';
import reactPlugin from '@vitejs/plugin-react';

export default mergeConfig(
  uiConfig,
  defineConfig({
    plugins: [reactPlugin()],
    test: {
      setupFiles: ['vitest.setup.ts'],
    },
  }),
);
