import { config as m1nsupppConfig } from '@m1nsuppp/eslint-config';
import turboPlugin from 'eslint-plugin-turbo';

/** @type {import("eslint").Linter.Config[]} */
export const config = [
  ...m1nsupppConfig,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },
];
