module.exports = {
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  semi: false,
  requirePragma: false,
  proseWrap: 'preserve',
  arrowParens: 'avoid',
  phpVersion: '7.4',
  trailingCommaPHP: true,
  braceStyle: 'psr-2',

  overrides: [
    {
      files: ['*.php'],
      options: {
        printWidth: 100,
        tabWidth: 4,
      },
    },
  ],
}
