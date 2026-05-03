import { defineConfig } from 'vitest/config';
import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
    setupFiles: ['./vitest.setup.ts'],
    env: {
      ACCESS_SECRET: process.env.ACCESS_SECRET || 'test-access-secret-key-that-is-long-enough',
      REFRESH_SECRET: process.env.REFRESH_SECRET || 'test-refresh-secret-key-that-is-long-enough',
      BREVO_API_KEY: process.env.BREVO_API_KEY || 'test-brevo-key',
      BREVO_USER_NAME: process.env.BREVO_USER_NAME || 'test-user',
      ACESS_TOKEN: process.env.ACESS_TOKEN || 'test-token',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});