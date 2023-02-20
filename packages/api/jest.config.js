module.exports = {
  bail: true,
  clearMocks: true,
  testEnvironment: 'node',
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
  setupFiles: ['./src/tests/env.ts'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  collectCoverageFrom: ['src/**'],
  coverageDirectory: '<rootDir>/coverage',
  coveragePathIgnorePatterns: [
    'src/migrations/',
    'src/tests/',
    'src/@types/',
    'server.ts',
  ],
}
