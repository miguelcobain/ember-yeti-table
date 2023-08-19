'use strict';

module.exports = {
  overrides: [
    {
      files: '*.{js,ts}',
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
