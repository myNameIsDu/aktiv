const path = require('path');

module.exports = function babelLoader({ babelInclude: configBabelInclude = [], workDir }, presets) {
    const { isLocal = false } = presets;

    const babelInclude = [
        path.resolve(workDir, './src'),
        ...configBabelInclude.map(v => path.resolve(workDir, v)),
    ];

    return [
        {
            test: /\.(js|ts)x?$/,
            loader: require.resolve('swc-loader'),
            options: {
                env: {
                    coreJs: '3.26.1',
                    mode: 'usage',
                },
                jsc: {
                    externalHelpers: true,
                    parser: {
                        syntax: 'typescript',
                        tsx: true,
                    },
                    transform: {
                        react: {
                            runtime: 'automatic',
                            refresh: isLocal,
                        },
                    },
                },
            },
            include: babelInclude,
        },
    ];
};
