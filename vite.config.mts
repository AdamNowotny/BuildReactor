import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        include: ['**/*.test.?(c|m)[jt]s?(x)'],
        mockReset: true,
        setupFiles: ['test/setup.ts']
    },
});
