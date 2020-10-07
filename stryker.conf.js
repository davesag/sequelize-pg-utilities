module.exports = {
  // concurrency: 2,
  mutate: ['src/**/*.js', '!src/env.js', '!src/configure.js'],
  packageManager: 'npm',
  reporters: ['clear-text'],
  testRunner: 'mocha',
  mochaOptions: {
    spec: ['./test/unit/**/*.test.js'],
    require: ['./test/testHelper.js']
  },
  coverageAnalysis: 'perTest',
  thresholds: { high: 80, low: 70, break: null }
}
