module.exports = {
    testMatch: ['<rootDir>/__tests__/**/*.test.js'],
    displayName: 'ak-cli',
    preset: 'ts-jest',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['./utils/**', './ak-webpack-config/**'],
    // setupFilesAfterEnv: ['./__tests__/jest.setup.ts'],
};
