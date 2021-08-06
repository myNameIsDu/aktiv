module.exports = {
    testMatch: ['<rootDir>/__tests__/**/*.test.{ts,tsx}'],
    displayName: 'launcher',
    preset: 'ts-jest',
    collectCoverage: false,
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['./src/**/*.{tsx,ts}'],
    moduleNameMapper: {
        '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
    },
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./jest.setup.ts'],
};
