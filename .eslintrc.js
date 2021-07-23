module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        jest: true,
    },
    extends: [
        'plugin:react/recommended',
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
            experimentalObjectRestSpread: true,
        },
    },
    plugins: ['prettier', '@typescript-eslint', 'react-hooks', 'import', 'react'],
    settings: {
        react: {
            version: 'detect',
        },
        'import/ignore': ['react', 'react-dom'],
        'import/resolver': {
            node: {
                extensions: ['.js', 'jsx', '.ts', '.tsx'],
            },
        },
    },
    rules: {
        'accessor-pairs': 'error',
        'array-bracket-spacing': 'error',
        'array-callback-return': 'error',
        'arrow-spacing': 'error',
        'block-scoped-var': 'error',
        'block-spacing': 'error',
        'brace-style': 'error',
        'callback-return': 'error',
        camelcase: 'error',
        'class-methods-use-this': 'error',
        'comma-spacing': 'error',
        'comma-style': 'error',
        complexity: 'error',
        'computed-property-spacing': 'error',
        'consistent-this': 'error',
        curly: 'error',
        'default-case': 'error',
        'default-case-last': 'error',
        'default-param-last': 'error',
        'dot-notation': 'error',
        'eol-last': 'error',
        eqeqeq: 'error',
        'func-call-spacing': 'error',
        'func-name-matching': 'error',
        'func-names': 'error',
        'generator-star-spacing': 'error',
        'global-require': 'error',
        'grouped-accessor-pairs': 'error',
        'handle-callback-err': 'error',
        'id-blacklist': 'error',
        'id-denylist': 'error',
        'id-match': 'error',
        'init-declarations': 'error',
        'jsx-quotes': 'error',
        'keyword-spacing': 'error',
        'linebreak-style': 'error',
        'lines-around-directive': 'error',
        'lines-between-class-members': 'error',
        'max-classes-per-file': 'error',
        'max-depth': 'error',
        'max-len': [
            'error',
            {
                code: 120,
                ignorePattern: 'true',
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreRegExpLiterals: true,
            },
        ],
        'max-lines': 'error',
        'max-nested-callbacks': 'error',
        'max-statements-per-line': 'error',
        'new-cap': 'error',
        'new-parens': 'error',
        'newline-after-var': 'error',
        'newline-before-return': 'error',
        'newline-per-chained-call': 'error',
        'no-array-constructor': 'error',
        'no-await-in-loop': 'error',
        'no-bitwise': 'error',
        'no-buffer-constructor': 'error',
        'no-caller': 'error',
        'no-catch-shadow': 'error',
        'no-confusing-arrow': 'error',
        'no-console': 'error',
        'no-constructor-return': 'error',
        'no-continue': 'error',
        'no-div-regex': 'error',
        'no-else-return': 'error',
        'no-empty-function': 'error',
        'no-eq-null': 'error',
        'no-eval': 'error',
        'no-extend-native': 'error',
        'no-extra-bind': 'error',
        'no-extra-label': 'error',
        'no-floating-decimal': 'error',
        'no-implicit-coercion': 'error',
        'no-implicit-globals': 'error',
        'no-implied-eval': 'error',
        'no-invalid-this': 'error',
        'no-iterator': 'error',
        'no-label-var': 'error',
        'no-labels': 'error',
        'no-lone-blocks': 'error',
        'no-lonely-if': 'error',
        'no-loop-func': 'error',
        'no-loss-of-precision': 'error',
        'no-multi-assign': 'error',
        'no-multi-spaces': 'error',
        'no-multi-str': 'error',
        'no-multiple-empty-lines': 'error',
        'no-native-reassign': 'error',
        'no-negated-condition': 'error',
        'no-negated-in-lhs': 'error',
        'no-nested-ternary': 'error',
        'no-new': 'error',
        'no-new-func': 'error',
        'no-new-object': 'error',
        'no-new-require': 'error',
        'no-new-wrappers': 'error',
        'no-nonoctal-decimal-escape': 'error',
        'no-octal-escape': 'error',
        'no-path-concat': 'error',
        'no-plusplus': 'error',
        'no-process-exit': 'error',
        'no-promise-executor-return': 'error',
        'no-proto': 'error',
        'no-restricted-exports': 'error',
        'no-restricted-globals': 'error',
        'no-restricted-imports': 'error',
        'no-restricted-modules': 'error',
        'no-restricted-properties': 'error',
        'no-restricted-syntax': 'error',
        'no-return-assign': 'error',
        'no-return-await': 'error',
        'no-script-url': 'error',
        'no-self-compare': 'error',
        'no-sequences': 'error',
        'no-shadow': 'error',
        'no-spaced-func': 'error',
        'no-sync': 'error',
        'no-tabs': 'error',
        'no-template-curly-in-string': 'error',
        'no-trailing-spaces': 'error',
        'no-undef-init': 'error',
        'no-underscore-dangle': 'error',
        'no-unmodified-loop-condition': 'error',
        'no-unneeded-ternary': 'error',
        'no-unreachable-loop': 'error',
        'no-useless-backreference': 'error',
        'no-useless-call': 'error',
        'no-useless-computed-key': 'error',
        'no-useless-concat': 'error',
        'no-useless-constructor': 'error',
        'no-useless-rename': 'error',
        'no-useless-return': 'error',
        'no-var': 'error',
        'no-void': 'error',
        'no-warning-comments': 'error',
        'nonblock-statement-body-position': 'error',
        'object-curly-newline': 'error',
        'object-curly-spacing': ['error', 'always'],
        'object-shorthand': 'error',
        'one-var-declaration-per-line': 'error',
        'operator-assignment': 'error',
        'operator-linebreak': 'error',
        'padding-line-between-statements': 'error',
        'prefer-arrow-callback': 'error',
        'prefer-const': 'error',
        'prefer-destructuring': 'error',
        'prefer-exponentiation-operator': 'error',
        'prefer-numeric-literals': 'error',
        'prefer-object-spread': 'error',
        'prefer-promise-reject-errors': 'error',
        'prefer-regex-literals': 'error',
        'prefer-rest-params': 'error',
        'prefer-spread': 'error',
        'prefer-template': 'error',
        radix: 'error',
        'require-atomic-updates': 'error',
        'require-await': 'error',
        'rest-spread-spacing': 'error',
        semi: 'error',
        'semi-spacing': 'error',
        'semi-style': 'error',
        'space-before-blocks': 'error',
        'space-in-parens': 'error',
        'space-infix-ops': 'error',
        'space-unary-ops': 'error',
        'spaced-comment': 'error',
        strict: 'error',
        'switch-colon-spacing': 'error',
        'symbol-description': 'error',
        'template-curly-spacing': 'error',
        'template-tag-spacing': 'error',
        'unicode-bom': 'error',
        'valid-jsdoc': 'error',
        'vars-on-top': 'error',
        'wrap-iife': 'error',
        'wrap-regex': 'error',
        'yield-star-spacing': 'error',
        yoda: 'error',
        'key-spacing': [
            'error',
            {
                afterColon: true,
                beforeColon: false,
            },
        ],
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'no-use-before-define': 'off',
        'react/display-name': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'prettier/prettier': 'error',
        'no-inline-comments': 'off',
        'react/jsx-no-undef': 2,
        'react/jsx-wrap-multilines': 2,
        'react/no-string-refs': 0,
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
        'no-redeclare': 'off',
        '@typescript-eslint/no-redeclare': ['error'],
        '@typescript-eslint/no-use-before-define': ['error'],
        '@typescript-eslint/type-annotation-spacing': 'error',
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/no-non-null-assertion': 0,
        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error',
        // 忽略react react-dom 因为这里是peer依赖
        'import/no-unresolved': [2, { ignore: ['react', 'react-dom'] }],
    },
};
