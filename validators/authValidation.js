const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be 6+ characters'),
  role: z.enum(['admin', 'user']).optional()
});

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password required')
});

module.exports = { registerSchema, loginSchema };
