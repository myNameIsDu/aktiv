module.exports = {
    testMatch: ['<rootDir>/__tests__/*.test.{ts,tsx}'],
    displayName: 'launcher',
    preset: 'ts-jest',
    collectCoverage: false,
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['./index.tsx', './router/**/*.{ts,tsx}'],
    moduleNameMapper: {
        '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
    },
    testEnvironment: 'jsdom',
};
