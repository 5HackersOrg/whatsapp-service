import { vi } from 'vitest';

// Mock the token service BEFORE anything else imports it
vi.mock('../repository/users/auth/AuthDb.js', () => {
  return {
    UsersAuthDb: vi.fn(function () {
      return {
        login: vi.fn(),
        verifyOtp: vi.fn(),
      };
    }),
  };
});

vi.mock('../repository/users/user/UserDb.js', () => {
  return {
    UserDb: vi.fn(function () {
      return {
        getUserByEmail: vi.fn(),
      };
    }),
  };
});

vi.mock('../services/token/tokenService.js', () => ({
  verifyAccessTokenOnboard: vi.fn(),
  generateTokens: vi.fn(),
}));

vi.mock('../middleware/fingerprint/fingerprint.js', () => ({
  extractFingerprint: vi.fn(),
}));

vi.mock('../services/user/auth/refreshTokenService.js', () => ({
  setRefreshToken: vi.fn(),
}));

// ✅ IMPORTANT: All mocks must be at the VERY TOP
import { beforeEach, describe, expect, it } from 'vitest';
import { UserDb } from '../repository/users/user/UserDb.js';
import { UsersAuthDb } from '../repository/users/auth/AuthDb.js';
import { onBoardPassService, userLogin, verifyOtp } from '../services/user/auth/loginService.js';
import { verifyAccessTokenOnboard } from '../services/token/tokenService.js';
import { setRefreshToken } from '../services/user/auth/refreshTokenService.js';
import { extractFingerprint } from '../middleware/fingerprint/fingerprint.js';


describe('Authentication Service', () => {
  let mockAuthDb: any;
  let mockUserDb: any;

  const MockedUsersAuthDb = vi.mocked(UsersAuthDb);
  const MockedUserDb = vi.mocked(UserDb);

  beforeEach(() => {
    vi.clearAllMocks();

    mockAuthDb = {
      login: vi.fn(),
      verifyOtp: vi.fn(),
    };
    mockUserDb = {
      getUserByEmail: vi.fn(),
    };

    MockedUsersAuthDb.mockImplementation(function () {
      return mockAuthDb;
    });

    MockedUserDb.mockImplementation(function () {
      return mockUserDb;
    });
  });

  describe('userLogin', () => {
    it('should return login result when credentials are valid', async () => {
      const expectedResult = { success: true, token: 'fake-token' };
      mockAuthDb.login.mockResolvedValue(expectedResult);

      const result = await userLogin('test@example.com', 'password123');

      expect(mockAuthDb.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(result).toEqual(expectedResult);
    });

    it('should return failure when credentials are invalid', async () => {
      const expectedResult = { success: false, message: 'Invalid credentials' };
      mockAuthDb.login.mockResolvedValue(expectedResult);

      const result = await userLogin('test@example.com', 'wrong-password');

      expect(result).toEqual(expectedResult);
    });
  });

  describe('verifyOtp', () => {
    it('should verify OTP successfully', async () => {
      const expectedResult = { success: true };
      mockAuthDb.verifyOtp.mockResolvedValue(expectedResult);

      const result = await verifyOtp('test@example.com', '123456');

      expect(mockAuthDb.verifyOtp).toHaveBeenCalledWith('test@example.com', '123456');
      expect(result).toEqual(expectedResult);
    });

    it('should return failure for invalid OTP', async () => {
      const expectedResult = { success: false, message: 'Invalid OTP' };
      mockAuthDb.verifyOtp.mockResolvedValue(expectedResult);

      const result = await verifyOtp('test@example.com', '000000');

      expect(result).toEqual(expectedResult);
    });
  });

  describe('onBoardPassService', () => {
    const mockRequest = {
      headers: {},
      ip: '127.0.0.1',
    } as any;

    it('should return 403 when access token is invalid', async () => {
      (verifyAccessTokenOnboard as any).mockResolvedValue(null);

      const result = await onBoardPassService('invalid-token', mockRequest);

      expect(result).toEqual({
        reason: 'invalid token ',
        status: 403,
        success: false,
      });
    });

    it('should return 404 when user is not found', async () => {
      (verifyAccessTokenOnboard as any).mockResolvedValue({ email: 'notfound@example.com' });
      mockUserDb.getUserByEmail.mockResolvedValue(null);

      const result = await onBoardPassService('valid-token', mockRequest);

      expect(result).toEqual({
        reason: 'account not found',
        status: 404,
        success: false,
      });
    });

    it('should return 200 with tokens on successful onboarding', async () => {
      const mockUser = {
        dataValues: { id: 1 },
        getRoles: () => [{ dataValues: { name: 'user' } }],
      };
      const mockTokens = { accessToken: 'access-token', refreshToken: 'refresh-token' };

      (verifyAccessTokenOnboard as any).mockResolvedValue({ email: 'test@example.com' });
      mockUserDb.getUserByEmail.mockResolvedValue(mockUser);
      (extractFingerprint as any).mockReturnValue('test-fingerprint');
      (setRefreshToken as any).mockResolvedValue(mockTokens);

      const result = await onBoardPassService('valid-token', mockRequest);

      expect(result).toEqual({
        reason: 'sucessfull request',
        status: 200,
        success: true,
        data: {
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
          role: 'user',
        },
      });

      expect(extractFingerprint).toHaveBeenCalledWith(mockRequest);
      expect(setRefreshToken).toHaveBeenCalledWith(1, 'test-fingerprint', 'user');
    });

    it('should return 500 when setRefreshToken fails', async () => {
      (verifyAccessTokenOnboard as any).mockResolvedValue({ email: 'test@example.com' });
      mockUserDb.getUserByEmail.mockResolvedValue({
        dataValues: { id: 1 },
        getRoles: () => [{ dataValues: { name: 'user' } }],
      });
      (extractFingerprint as any).mockReturnValue('test-fingerprint');
      (setRefreshToken as any).mockResolvedValue(null);

      const result = await onBoardPassService('valid-token', mockRequest);

      expect(result).toEqual({
        reason: 'internal server error',
        status: 500,
        success: false,
      });
    });

    it('should return 403 when an exception is thrown', async () => {
      (verifyAccessTokenOnboard as any).mockImplementation(() => {
        throw new Error('Database error');
      });

      const result = await onBoardPassService('valid-token', mockRequest);

      expect(result).toEqual({
        reason: 'invalid token ',
        status: 403,
        success: false,
      });
    });
  });
});