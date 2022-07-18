module.exports = {
  env: {
    // 適用する環境
    es6: true,
    node: true,
    browser: true,
    commonjs: true,
  },
  // パーサー
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    // import 文でモジュールを使用します
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    // 'import',
    'react-hooks',
    '@typescript-eslint',
    'prettier',
    // 'unused-imports',
  ],
  // 基本的にルールは recommended に従う
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/no-unescaped-entities': 0,
    'react/prop-types': 0,
    'react/jsx-curly-brace-presence': [1, 'never'],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/no-unused-vars': [1, { argsIgnorePattern: '^_' }],
    // note you must disable the base rule as it can report incorrect errors
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    // '@typescript-eslint/no-unused-vars': [0, { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-empty-interface': [
      0,
      {
        allowSingleExtends: false,
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    quotes: ['error', 'single'],
    'space-before-blocks': 'error',
    'no-console': 'warn',
    'object-curly-spacing': ['error', 'always'],
    'arrow-spacing': 'error',
    'no-useless-return': 'error',
    'array-callback-return': 'error',
    'accessor-pairs': [
      'error',
      { getWithoutSet: true, enforceForClassMembers: true },
    ],
    'block-scoped-var': 'error',
    'class-methods-use-this': 'error',
    'arrow-parens': ['error', 'always'],
    'prettier/prettier': 'error',
    indent: 0,
  },
};
