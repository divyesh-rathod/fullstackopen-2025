// eslint.config.cjs (CommonJS)
const js = require("@eslint/js");
const globals = require("globals");
const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({ baseDirectory: __dirname });

module.exports = [
  // Load Airbnb Base (legacy) + Prettier compatibility
  ...compat.extends('airbnb-base', 'prettier'),

  // ESLint recommended rules
  js.configs.recommended,

  // Default project rules (Node backend)
  {
    files: ['**/*.{js,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: { ...globals.node },
    },
    settings: {
      'import/resolver': {
        node: { extensions: ['.js', '.cjs', '.json'] },
      },
    },
    rules: {
      'no-console': 'off',
      'arrow-body-style': 'off',
      'consistent-return': 'off',
      'linebreak-style': 'off',
      'import/extensions': ['error', 'ignorePackages', { js: 'never', cjs: 'never' }],
      'no-restricted-syntax': 'off',
      'no-plusplus': 'off',
    },
  },

  // Override JUST for the config file so devDeps are allowed and no false positives
  {
    files: ['eslint.config.cjs'],
    rules: {
      // Config files are allowed to import devDependencies (@eslint/js, globals, etc.)
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      'no-underscore-dangle': ['error', { allow: ['_id', '__v'] }],
      // (Not needed anymore since we removed it, but good to have if you add helpers)
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['index.js', 'routes/**/*.js'],
    rules: { 'consistent-return': 'off' },
  },
  {
    files: ['models/**/*.js'],
    rules: {
      'no-underscore-dangle': ['error', { allow: ['_id', '__v'] }],
      // If you like to mutate "ret" inside transform:
      'no-param-reassign': ['error', { props: false }],
    },
  },
];
