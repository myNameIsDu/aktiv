module.exports = {
    testMatch: ['<rootDir>/__tests__/**/*.test.js'],
    displayName: 'ak-cli',
    preset: 'ts-jest',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['<rootDir>/utils/**.{js,jsx}', '<rootDir>/ak-webpack-config/.{js,jsx}'],
    // setupFilesAfterEnv: ['./__tests__/jest.setup.ts'],
    transform: {
        '^.+\\.(t|j)sx?$': ['@swc/jest'],
    },
};
