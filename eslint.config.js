module.exports = {
  ...require('@antfu/eslint-config').default(),
  rules: {
    ...require('@antfu/eslint-config').default().rules,
    'no-console': 'off',
  },
};