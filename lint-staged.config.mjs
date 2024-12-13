const staged = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
  '**/*.ts?(x)': () => 'pnpm type-check',
};

export default staged;
