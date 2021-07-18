import { babel } from '@rollup/plugin-babel';
import tsc from '@rollup/plugin-typescript';

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
        tsc(),
        babel({
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
        }),
    ],
};
