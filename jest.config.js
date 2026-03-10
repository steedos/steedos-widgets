module.exports = {
  transform: {
    '\\.js$': ['babel-jest', { presets: ['@babel/preset-env'] }]
  },
  testMatch: ['**/__tests__/**/*.test.js']
};
