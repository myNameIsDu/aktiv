const { NODE_ENV } = process.env;
const MintCssExtractWebpackPlugin = require('mini-css-extract-plugin');

const isDevelopment = NODE_ENV === 'development';
const isProduction = NODE_ENV === 'production';

module.exports = () => {
    return [
        isDevelopment && 'style-loader',
        isProduction && {
            loader: MintCssExtractWebpackPlugin.loader,
            options: {
                publicPath: '../',
            },
        },
        'css-loader',
        isProduction && {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: ['postcss-preset-env'],
                },
            },
        },
    ].filter(Boolean);
};
