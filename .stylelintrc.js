module.exports = {
  extends: ['stylelint-prettier/recommended', 'stylelint-config-recess-order'],
  plugins: ['stylelint-scss', 'stylelint-prettier', 'stylelint-color-format'],
  customSyntax: "postcss-scss",
  rules: {
    'order/properties-alphabetical-order': null,
    'prettier/prettier': true,
    'block-no-empty': null,
    'no-descending-specificity': null,
    'selector-no-qualifying-type': null,
    'no-empty-source': null,
    'selector-class-pattern': [
      /*
      [stage]-[block]_[element]-[modifier]
        [stage] should be one of a, m, o, t, p, u
        [block], [element], [modifier] should be lowercase
        [block] should not start with a number
        [element] should have 0 - 2 occurences
        [modifier] should have 0 - 1 occurences
      */
      // '',
      '^([amotpu]-([a-z][a-zA-Z0-9]+)(_([a-z][a-zA-Z0-9]+)){0,2})|^(is-([a-z][a-zA-Z0-9]+))|^-([a-z][a-zA-Z0-9]+)$',
      {
        resolveNestedSelectors: true,
      },
    ],
  },
  ignoreFiles: [
    '**/node_modules/**',
    './dist/**',
  ],
};
