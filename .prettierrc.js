'use strict';

module.exports = {
  plugins: ['prettier-plugin-ember-template-tag'],
  overrides: [
    {
      files: '*.{js,ts,gjs,gts}',
      options: {
        singleQuote: true,
        trailingComma: 'none',
        printWidth: 120,
        semi: true,
        bracketSpacing: true,
        endOfLine: 'lf',
        tabWidth: 2,
        useTabs: false,
        arrowParens: 'avoid'
      }
    }
  ]
};
