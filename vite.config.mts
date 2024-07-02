import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['**/*.test.?(c|m)[jt]s?(x)'],
        mockReset: true,
    },
});
