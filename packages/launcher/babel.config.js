module.exports = {
    presets: [
        ['@babel/preset-env', { loose: true, modules: false }],
        [
            '@babel/preset-react',
            {
                runtime: 'automatic',
            },
        ],
    ],
    plugins: ['@babel/plugin-transform-runtime'],
};
