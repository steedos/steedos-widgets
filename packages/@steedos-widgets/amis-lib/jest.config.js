module.exports = {
  testMatch: ['**/src/**/__tests__/**/*.test.js'],
  transform: {
    '^.+\\.js$': ['babel-jest', {
      presets: [['@babel/preset-env', { targets: { node: 'current' } }]]
    }]
  },
  transformIgnorePatterns: [
    '/node_modules/'
  ]
};
