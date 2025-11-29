import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/tests/query.test.js',  // Pure JS test file (run separately with node)
        ],
    },
});
