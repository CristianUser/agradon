module.exports = {
  extends: ['airbnb-typescript/base', 'prettier', 'plugin:prettier/recommended'],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.eslint.json'],
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  rules: {
    'import/no-unresolved': 0
  }
};
