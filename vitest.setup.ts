import { vi } from 'vitest';
import { config } from 'dotenv';

// Force load test environment variables
config({ path: '.env.test' });

// Ensure environment variables are set BEFORE any modules load
process.env.ACCESS_SECRET = process.env.ACCESS_SECRET || 'test-access-secret-key-that-is-long-enough';
process.env.REFRESH_SECRET = process.env.REFRESH_SECRET || 'test-refresh-secret-key-that-is-long-enough';
process.env.BREVO_API_KEY = process.env.BREVO_API_KEY || 'test-brevo-key';
process.env.BREVO_USER_NAME = process.env.BREVO_USER_NAME || 'test-user';
process.env.ACESS_TOKEN = process.env.ACESS_TOKEN || 'test-token';

// Mock the token service module globally
vi.mock('./src/services/token/tokenService.js', () => ({
  verifyAccessTokenOnboard: vi.fn(),
  generateTokens: vi.fn(),
}), { virtual: false });