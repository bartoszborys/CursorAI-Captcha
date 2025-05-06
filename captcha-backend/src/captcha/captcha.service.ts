import { Injectable, BadRequestException } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';
import { RedisService } from './../redis/redis.service';
import { v4 as uuidv4 } from 'uuid';

interface CaptchaData {
  text: string;
  expiresAt: number;
}

@Injectable()
export class CaptchaService {
  constructor(private readonly redisService: RedisService) {}

  async generateCaptcha() {
    const captcha = svgCaptcha.create({
      size: 6,
      noise: 2,
      color: true,
      background: '#f0f0f0',
    });

    const captchaId = uuidv4();
    const expirationTime = 300; // 5 minutes in seconds
    const expiresAt = Date.now() + expirationTime * 1000;

    const captchaData: CaptchaData = {
      text: captcha.text.toLowerCase(),
      expiresAt,
    };

    await this.redisService.set(
      `captcha:${captchaId}`,
      JSON.stringify(captchaData),
      expirationTime,
    );

    return {
      id: captchaId,
      image: captcha.data,
      expiresAt,
    };
  }

  async verifyCaptcha(captchaId: string, userInput: string): Promise<boolean> {
    const storedCaptcha = await this.redisService.get(`captcha:${captchaId}`);

    if (!storedCaptcha) {
      throw new BadRequestException('Invalid CAPTCHA ID');
    }

    const captchaData: CaptchaData = JSON.parse(storedCaptcha);

    if (Date.now() > captchaData.expiresAt) {
      await this.redisService.del(`captcha:${captchaId}`);
      throw new BadRequestException('CAPTCHA has expired');
    }

    // Delete the CAPTCHA after verification
    await this.redisService.del(`captcha:${captchaId}`);

    return captchaData.text === userInput.toLowerCase();
  }
}
