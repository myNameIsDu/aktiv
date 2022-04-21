module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'scope-enum': [2, 'always', ['cli', 'launcher', 'root', 'release']],
        'scope-empty': [2, 'never'],
    },
};
