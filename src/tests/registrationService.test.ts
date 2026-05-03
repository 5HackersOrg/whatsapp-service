import { beforeEach, describe, expect, test, vi } from 'vitest';

/**
 * ─────────────────────────────────────────────
 * HOISTED MOCKS (SAFE ZONE)
 * ─────────────────────────────────────────────
 */

// use vi.hoisted to avoid TDZ issues
const mocks = vi.hoisted(() => {
  return {
    sendWhatsAppMessage: vi.fn(),
    generateOtp: vi.fn(),
    isValidEmail: vi.fn(),
    generateCustomerWindowTimeout: vi.fn(),
    updateUserWhatsappState: vi.fn(),
    sendEmail: vi.fn(),
  };
});

/**
 * ─────────────────────────────────────────────
 * MODULE MOCKS
 * ─────────────────────────────────────────────
 */

vi.mock('../services/twillio/whatsappMessages/sendWhatsappMessage.js', () => ({
  sendWhatsAppMessage: mocks.sendWhatsAppMessage,
}));

vi.mock('../utils/types/generations/otpGenerator.js', () => ({
  generateOtp: mocks.generateOtp,
}));

vi.mock('../utils/whatsapp/isValidCustomerWindow.js', () => ({
  generateCustomerWindowTimeout: mocks.generateCustomerWindowTimeout,
}));

vi.mock('../utils/validators/validators.js', () => ({
  validators: {
    isValidEmail: mocks.isValidEmail,
  },
}));

vi.mock('../repository/users/jobSeekers/JobSeekersDb.js', () => {
  return {
    JobSeekerDb: class {
      updateUserWhatsappState = mocks.updateUserWhatsappState;
    },
  };
});

vi.mock('../services/email/emailService.js', () => {
  return {
    EmailService: class {
      sendEmail = mocks.sendEmail;
    },
  };
});

/**
 * ─────────────────────────────────────────────
 * IMPORTS (AFTER MOCKS)
 * ─────────────────────────────────────────────
 */

import { createAccount } from '../services/twillio/whatsappStatesFunctions/user/createAccount.js';
import { MESSAGES } from '../utils/enums/whatsapp/uiTextMessages.js';
import { UserSessionState } from '../utils/enums/whatsapp/sessionState.js';

/**
 * ─────────────────────────────────────────────
 * TEST DATA
 * ─────────────────────────────────────────────
 */

const BASE_PARAMS = {
  redeemded: false,
  ref_code: 'REF123',
  password: 'hashedPassword',
  userId: 'user-001',
  user_email: '',
  user_otp: '',
  customerWindowTimeout: '',
};

const makeBody = (type: string, text?: string) => ({
  userPhoneNumber: '+27820000000',
  type,
  info: { body: text ?? '' },
});

/**
 * ─────────────────────────────────────────────
 * SETUP
 * ─────────────────────────────────────────────
 */

beforeEach(() => {
  vi.clearAllMocks();

  mocks.generateOtp.mockResolvedValue({
    otp: '123456',
    hashedOtp: 'hashed-123456',
  });

  mocks.generateCustomerWindowTimeout.mockReturnValue(
    new Date('2025-01-01T00:30:00Z').toISOString()
  );

  mocks.isValidEmail.mockReturnValue(false);
});

/**
 * ─────────────────────────────────────────────
 * TESTS
 * ─────────────────────────────────────────────
 */

describe('createAccount — validation flow', () => {
  test('invalid email blocks OTP generation', async () => {
    await createAccount({
      ...BASE_PARAMS,
      body: makeBody('text', 'bad') as any,
    });

    expect(mocks.generateOtp).not.toHaveBeenCalled();
  });
});