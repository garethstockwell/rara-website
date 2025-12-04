// eslint-disable-next-line no-undef
module.exports = {
  extends: ['plugin:prettier/recommended'],
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 'latest', // enables ES2023 features
    sourceType: 'module', // allows import/export
  },
};
