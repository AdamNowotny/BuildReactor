import zipPack from 'vite-plugin-zip-pack';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    base: './',
    plugins: [
        tsconfigPaths(),
        zipPack({
            inDir: 'dist/build',
            outDir: 'dist',
            outFileName: 'build-reactor.zip',
        }),
    ],
    build: {
        emptyOutDir: false,
        sourcemap: true,
        minify: true,
        rollupOptions: {
            input: {
                'service-worker': 'src/service-worker/main.ts',
                popup: 'src/themes/popup.html',
                dashboard: 'src/themes/dashboard.html',
            },
            output: {
                dir: 'dist/build',
                format: 'es',
                entryFileNames: '[name].js',
                chunkFileNames: '[name]-chunk.js',
                assetFileNames: '[name].[ext]',
            },
        },
    },
    resolve: {
        alias: {
            stream: 'stream-browserify',
        },
    },
    test: {
        include: ['**/*.test.?(c|m)[jt]s?(x)'],
        mockReset: true,
    },
});
