import { registerAs } from '@nestjs/config';

export default registerAs('captcha', () => ({
  expiration: process.env.CAPTCHA_EXPIRATION || 300, // 5 minutes in seconds
})); 