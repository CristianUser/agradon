'use strict';

module.exports = {
  testEnvironment: 'node',
  verbose: true,
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '!coverage/**',
    '!**/node_modules/**',
    '!*.config.js',
    '!index.js',
    '**/*.js'
  ],
  coverageDirectory: 'coverage'
};
