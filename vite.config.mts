import react from '@vitejs/plugin-react';
import copy from 'rollup-plugin-copy';
import zipPack from 'vite-plugin-zip-pack';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    base: './',
    resolve: {
        alias: {
            stream: 'stream-browserify',
        },
    },
    plugins: [
        react(),
        copy({
            flatten: false,
            targets: [{ src: 'manifest.json', dest: 'dist/build/' }],
        }),
        tsconfigPaths(),
        zipPack({
            inDir: 'dist/build',
            outDir: 'dist',
            outFileName: 'build-reactor.zip',
        }),
    ],
    build: {
        assetsInlineLimit: 0,
        emptyOutDir: false,
        sourcemap: true,
        minify: true,
        rollupOptions: {
            input: {
                'service-worker': 'src/service-worker/main.ts',
                popup: 'src/dashboard/popup.html',
                dashboard: 'src/dashboard/dashboard.html',
                options: 'src/options/options.html',
            },
            output: {
                dir: 'dist/build',
                format: 'es',
                entryFileNames: '[name].js',
                chunkFileNames: '[name]-chunk.js',
                assetFileNames: 'assets/[name].[ext]',
            },
        },
    },
    test: {
        include: ['**/*.test.?(c|m)[jt]s?(x)'],
        mockReset: true,
    },
});
