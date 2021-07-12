const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const MintCssExtractWebpackPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV;

const isDevelopment = NODE_ENV === 'development';
const isProduction = NODE_ENV === 'production';

module.exports = () => {
    return [
        isProduction && new CleanWebpackPlugin(),
        new HtmlWebpackPlugin(
            Object.assign(
                {},
                {
                    inject: true,
                    template: path.resolve(__dirname, '../index.html'),
                    title: 'du-blogs',
                    favicon: path.resolve(__dirname, '../public/favicon.jpeg'),
                },
                isProduction
                    ? {
                        minify: {
                            removeComments: true,
                            collapseWhitespace: true,
                            removeRedundantAttributes: true,
                            useShortDoctype: true,
                            removeEmptyAttributes: true,
                            removeStyleLinkTypeAttributes: true,
                            keepClosingSlash: true,
                            minifyJS: true,
                            minifyCSS: true,
                            minifyURLs: true,
                        },
                    }
                    : undefined
            )),
        new webpack.DefinePlugin({
            // node中并没有环境变量   webpack会自动在前端设置node_env
            // 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.IS_LOCAL': isDevelopment
        }),
        isProduction && new MintCssExtractWebpackPlugin({
            filename: 'css/build.[contenthash:10].css',
        }),
        // 压缩css
        new OptimizeCssAssetsWebpackPlugin(),

        // //  告诉webpack那些文件不需要打包，同时引入的名字也会变调
        // new webpack.DllReferencePlugin({
        //     manifest: path.resolve(__dirname, '../dll/manifest.json')
        // }),
        // // 将之前打包好的dll文件引入进来
        // new AddAssetHtmlWebpackPlugin({
        //     filepath: path.resolve(__dirname, '../dll/vendor.js')
        // })
    ].filter(Boolean);
};