// jest.config.ts
/**@type {import ('ts-jest/dist/types').InitialOptionsTsJest}*/
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  verbose: true,
  forceExit: true,  
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  setupFiles: ['<rootDir>/src/tests/setup.ts'],
};

export default config;