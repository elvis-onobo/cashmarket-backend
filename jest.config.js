/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: './src/test/setup/setup.ts',
  globalTeardown: './src/test/setup/teardown.ts'
};