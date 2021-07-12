const path = require('path');
const output = require('./output');
const cssLoaderCommon = require('./css-common-loader');
const babelLoaderOption = require('./babel-loader-options');
const NODE_ENV = process.env.NODE_ENV;
const plugins = require('./plugins');
const devServerConfig = require('./dev-server');


const isDevelopment = NODE_ENV === 'development';

module.exports = {
    devtool: isDevelopment ? 'eval-source-map' : 'none',
    mode: NODE_ENV,
    entry: path.resolve(__dirname, '../src/index.jsx'),
    output,
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /\.less$/,
                        use: [
                            ...cssLoaderCommon(),
                            'less-loader'
                        ]
                    },
                    {
                        test: /\.css$/,
                        use: [
                            ...cssLoaderCommon(),
                        ]
                    },
                    {
                        test: /\.html$/,
                        loader: 'html-loader',
                    },
                    {
                        test: /\.png|jpe?g|gif/,
                        use: [
                            {
                                loader: 'url-loader',
                                options: {
                                    limit: 8 * 1024,
                                    name: '[hash:10].[ext]',
                                    outputPath: 'image',
                                }
                            }
                        ]
                    },
                    {
                        test: /\.js|jsx/,
                        exclude: /node_module/,
                        loader: 'babel-loader',
                        options: {
                            ...babelLoaderOption()
                        }
                    },
                    {
                        exclude: /\.(css|less|html|png|jpe?g|gif|js|jsx)$/,
                        loader: 'file-loader',
                        options: {
                            outputPath: 'static',
                        },
                    },
                ]
            }
        ]
    },
    plugins: [
        ...plugins()
    ],
    resolve: {
        // 配置省略文件名的后缀，默认 js  json
        extensions: ['.js', '.json', '.jsx'],
        alias: {
            Api: path.resolve(__dirname, '../src/config/api/index.js'),
            Hooks: path.resolve(__dirname, '../src/hooks'),
            Common: path.resolve(__dirname, '../src/common')
        }
    },
    devServer: {
        ...devServerConfig
    },
};