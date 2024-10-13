module.exports = {
  // ... (keep your existing configuration)
  overrides: [
    {
      files: ['next.config.js'],
      env: {
        node: true,
      },
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2021,
      },
    },
  ],
};

module.exports = {
  // ... (keep your existing configuration)
  overrides: [
    {
      files: ['next.config.js'],
      extends: ['./next.config.eslintrc.js'],
    },
  ],
};
