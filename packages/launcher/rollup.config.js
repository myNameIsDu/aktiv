import { babel } from '@rollup/plugin-babel';
import tsc from '@rollup/plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: './index.tsx',
    output: [
        {
            file: './lib/index.js',
            sourcemap: true,
            format: 'cjs',
            esModule: false,
        },
        {
            file: './lib/index.esm.js',
            sourcemap: true,
            format: 'esm',
        },
    ],
    external: ['react', 'react-dom'],
    plugins: [
        // 帮助 rollup 查找 node_modules 里的三方模块
        resolve(),
        // 帮助 rollup 查找 commonjs 规范的模块, 常配合 rollup-plugin-node-resolve 一起使用
        commonjs(),
        tsc(),
        babel({
            extensions: ['js', 'jsx', 'ts', 'tsx'],
            babelHelpers: 'runtime',
            exclude: /node_modules/,
            presets: [
                ['@babel/preset-env', { loose: true }],
                [
                    '@babel/preset-react',
                    {
                        runtime: 'automatic',
                    },
                ],
            ],
            plugins: ['@babel/plugin-transform-runtime'],
        }),
    ],
};
