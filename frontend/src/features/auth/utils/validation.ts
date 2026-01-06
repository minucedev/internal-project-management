import { z } from 'zod';
import { usernameSchema, emailSchema, passwordSchema } from '@/shared/utils/validation';

export const loginSchema = z.object({
  username: usernameSchema,
  password: z.string().min(1, { message: 'Password is required' }),
});

export const registerSchema = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
