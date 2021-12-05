const path = require('path');

/** @typedef {import('webpack').RuleSetRule} RuleSetRule*/

/**
 * @param {RegExp} test test
 * @param {string[]} include include
 * @param {string} workDir workDir
 * @param {Record<string,unknown>} options options
 * @return {RuleSetRule} generateBabelConfig
 */
const generateBabelConfig = (test, include, workDir, options) => {
    return {
        test,
        include,
        use: [
            {
                loader: require.resolve('babel-loader'),
                options: {
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
        hotReplace = false,
        workDir,
    },
    presets,
) {
    const { isLocal = false } = presets;
    /** @type {any[]} */
    const babelPreset = [
        [
            require.resolve('@babel/preset-env'),
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
            require.resolve('@babel/preset-react'),
            {
                runtime: 'automatic',
            },
        ],
    ];

    const babelTsPreset = [...babelPreset, require.resolve('@babel/preset-typescript')];
    const babelInclude = [
        path.resolve(workDir, './src'),
        ...configBabelInclude.map(v => path.resolve(workDir, v)),
    ];

    /** @type {any[]} */
    const babelPlugins = [
        require.resolve('@babel/plugin-transform-runtime'),
        [
            require.resolve('@babel/plugin-proposal-decorators'),
            {
                legacy: true,
            },
        ],
    ];

    if (isLocal && hotReplace) {
        babelPlugins.push(require.resolve('react-refresh/babel'));
    }

    if (antdModuleLazyOff) {
        babelPlugins.push([
            require.resolve('babel-plugin-import'),
            {
                libraryName: 'antd',
                libraryDirectory: 'es',
                style: true,
            },
        ]);
    }

    return [
        generateBabelConfig(/\.(js|jsx)$/, babelInclude, workDir, {
            presets: babelPreset,
            plugins: babelPlugins,
        }),
        generateBabelConfig(/\.(ts|tsx)$/, babelInclude, workDir, {
            presets: babelTsPreset,
            plugins: babelPlugins,
        }),
    ];
};
