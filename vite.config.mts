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
        rollupOptions: {
            input: {
                'service-worker': 'src/service-worker/main.ts',
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
    test: {
        include: ['**/*.test.?(c|m)[jt]s?(x)'],
        mockReset: true,
    },
});
