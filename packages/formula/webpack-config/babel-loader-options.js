const NODE_ENV = process.env.NODE_ENV;
const isDevelopment = NODE_ENV === 'development';
const isProduction = NODE_ENV === 'production';

module.exports = () => {
    const config = {
        presets: [
            isProduction && [
                '@babel/preset-env',
                {
                    useBuiltIns: 'usage',
                    corejs: {
                        version: 3
                    },
                    // 指定兼容到哪个版本
                    targets: {
                        chrome: '60',
                        firefox: '60',
                        ie: '10',
                        safari: '10',
                        edge: '10',
                    },
                },
            ],
            '@babel/preset-react'
        ].filter(Boolean),
        plugins: [
            [
                'import',
                {
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: 'css'
                },
            ],
            /*
                使用 @babel/plugin-transform-runtime 插件，所有帮助程序都将引用模块 @babel/runtime
                @babel/plugin-transform-runtime 只是抽离公共编译文件，所以只需要安装在开发环境
                但是最终运行的代码需要配合@babel/runtime所以需要在生产环境安装
            */
            '@babel/plugin-transform-runtime',
            '@babel/plugin-proposal-optional-chaining', // 可选连
            isDevelopment && 'react-hot-loader/babel' // 热更新
        ].filter(Boolean),
        // 超过行数压缩  babel的配置
        compact: isProduction
    };
    if (isDevelopment) {
        // 开启编译缓存
        config.cacheDirectory = true;
        /*
            不启用cache gzip压缩 因为babel 的cache是放在node_modules/.cache/babel-loader中的即磁盘中
            所以缓存大小并不影响什么 但是开启gzip压缩则会占用内存资源
        */
        config.cacheCompression = false;
    }
    return config;
};