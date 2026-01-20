import { z } from 'zod';
import { VALIDATION_MESSAGES, VALIDATION_RULES } from '../../constants/validation.constants';

export const emailSchema = z
  .string()
  .min(1, { message: VALIDATION_MESSAGES.REQUIRED })
  .email({ message: VALIDATION_MESSAGES.EMAIL_INVALID });

export const passwordSchema = z
  .string()
  .min(1, { message: VALIDATION_MESSAGES.REQUIRED })
  .min(VALIDATION_RULES.PASSWORD_MIN_LENGTH, { message: VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH });

export const usernameSchema = z
  .string()
  .min(1, { message: VALIDATION_MESSAGES.REQUIRED })
  .min(VALIDATION_RULES.USERNAME_MIN_LENGTH, { message: VALIDATION_MESSAGES.USERNAME_MIN_LENGTH })
  .regex(/^[a-zA-Z0-9_]+$/, { message: VALIDATION_MESSAGES.USERNAME_PATTERN });
