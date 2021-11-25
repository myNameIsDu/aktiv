const path = require('path');

/** @typedef {import('webpack').RuleSetRule} RuleSetRule*/

/**
 * @param {RegExp} test test
 * @param {string[]} include include
 * @param {Record<string,unknown>} options options
 * @return {RuleSetRule} generateBabelConfig
 */
const generateBabelConfig = (test, include, options) => {
    return {
        test,
        include,
        use: [
            {
                loader: 'babel-loader',
                options: {
                    cwd: path.resolve(__dirname, '../../../'),
                    cacheDirectory: true,
                    cacheCompression: false,
                    ...options,
                },
            },
        ],
    };
};

module.exports = function babelLoader(
    {
        babelInclude: configBabelInclude = [],
        antdModuleLazyOff = false,
        liveReload = false,
        workDir,
    },
    presets,
) {
    const { isLocal = false } = presets;
    /** @type {any[]} */
    const babelPreset = [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs: {
                    version: 3.18,
                    proposals: true,
                },
                // 补全浏览器bug
                bugfixes: true,
            },
        ],
        [
            '@babel/preset-react',
            {
                runtime: 'automatic',
            },
        ],
    ];

    const babelTsPreset = [...babelPreset, '@babel/preset-typescript'];
    const babelInclude = [
        path.resolve(workDir, './src'),
        ...configBabelInclude.map(v => path.resolve(workDir, v)),
    ];

    /** @type {any[]} */
    const babelPlugins = [
        '@babel/plugin-transform-runtime',
        [
            '@babel/plugin-proposal-decorators',
            {
                legacy: true,
            },
        ],
    ];

    if (isLocal && liveReload) {
        babelPlugins.push('react-refresh/babel');
    }

    if (antdModuleLazyOff) {
        babelPlugins.push([
            'import',
            {
                libraryName: 'antd',
                libraryDirectory: 'es',
                style: true,
            },
        ]);
    }

    return [
        generateBabelConfig(/\.(js|jsx)$/, babelInclude, {
            presets: babelPreset,
            plugins: babelPlugins,
        }),
        generateBabelConfig(/\.(ts|tsx)$/, babelInclude, {
            presets: babelTsPreset,
            plugins: babelPlugins,
        }),
    ];
};
