import babel from '@rollup/plugin-babel';
import tsc from '@rollup/plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
const extensions = ['js', 'jsx', 'ts', 'tsx'];

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
            file: './es/index.js',
            sourcemap: true,
            format: 'esm',
        },
    ],
    external: ['react', 'react-dom'],
    plugins: [
        // 帮助 rollup 查找 node_modules 里的三方模块
        resolve({ extensions }),
        // 帮助 rollup 查找 commonjs 规范的模块, 常配合 rollup-plugin-node-resolve 一起使用
        commonjs(),
        tsc({
            tsconfig: './tsconfig.json',
        }),
        babel({
            extensions,
            babelHelpers: 'runtime',
            exclude: /node_modules/,
        }),
        terser(),
    ],
};
