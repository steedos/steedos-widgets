/**
 * Prettier configuration for steedos-widgets
 * Ensures consistent code formatting across the entire project
 */
module.exports = {
  // Line length
  printWidth: 100,
  
  // Indentation
  tabWidth: 2,
  useTabs: false,
  
  // Semicolons
  semi: true,
  
  // Quotes
  singleQuote: true,
  quoteProps: 'as-needed',
  
  // JSX
  jsxSingleQuote: false,
  jsxBracketSameLine: false,
  
  // Trailing commas
  trailingComma: 'es5',
  
  // Spacing
  bracketSpacing: true,
  arrowParens: 'always',
  
  // Line endings
  endOfLine: 'lf',
  
  // File-specific overrides
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 80,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
  ],
};
