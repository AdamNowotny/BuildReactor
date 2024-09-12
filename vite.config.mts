/* eslint-disable sort-keys */
import { crx, defineManifest, ManifestV3Export } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import zipPack from 'vite-plugin-zip-pack';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import packageJson from './package.json' assert { type: 'json' };
import Icons from 'unplugin-icons/vite';

const MANIFEST_TARGET = process.env.MANIFEST_TARGET ?? 'chrome';
const manifest = defineManifest({
    name: 'BuildReactor',
    version: packageJson.version,
    manifest_version: 3,
    description: packageJson.description,
    icons: {
        '16': 'img/icon-16.png',
        '48': 'img/icon-48.png',
        '128': 'img/icon-128.png',
    },
    action: {
        default_title: 'BuildReactor',
        default_icon: 'img/icon-19.png',
        default_popup: 'popup.html',
    },
    background:
        MANIFEST_TARGET === 'firefox'
            ? {
                  scripts: ['src/service-worker/main.ts'],
                  type: 'module',
              }
            : {
                  service_worker: 'src/service-worker/main.ts',
                  type: 'module',
              },
    homepage_url: packageJson.homepage,
    options_ui: {
        page: 'options.html',
        open_in_tab: true,
    },
    permissions: ['alarms', 'notifications', 'storage'],
    host_permissions: ['http://*/*', 'https://*/*'],
    browser_specific_settings:
        MANIFEST_TARGET === 'firefox'
            ? {
                  gecko: {
                      id: '{9ad89e27-158a-48db-b71e-c92069989ee6}',
                      strict_min_version: '109.0',
                  },
              }
            : undefined,
} as ManifestV3Export);

export default defineConfig({
    base: '/',
    resolve: {
        alias: {
            stream: 'stream-browserify',
        },
    },
    plugins: [
        tsconfigPaths(),
        react(),
        crx({ manifest }),
        Icons({
            autoInstall: true,
            compiler: 'jsx',
            jsx: 'react',
        }),
        zipPack({
            inDir: 'dist/build',
            outDir: 'dist',
            outFileName: 'build-reactor.zip',
            filter: (_fileName: string, filePath: string, _isDirectory: boolean) =>
                !filePath.startsWith('dist/build/.vite'),
        }),
    ],
    build: {
        assetsInlineLimit: 0,
        emptyOutDir: true,
        sourcemap: true,
        minify: true,
        rollupOptions: {
            input: {
                dashboard: 'dashboard.html',
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
    server: {
        strictPort: true,
        port: 5173,
        hmr: {
            clientPort: 5173,
        },
    },
    test: {
        include: ['**/*.test.?(c|m)[jt]s?(x)'],
        mockReset: true,
    },
});
