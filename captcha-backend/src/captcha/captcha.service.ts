import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as svgCaptcha from 'svg-captcha';

interface CaptchaData {
  solution: string;
  expiresAt: number;
}

@Injectable()
export class CaptchaService {
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async generateCaptcha() {
    const captcha = svgCaptcha.create({
      size: 6,
      noise: 2,
      color: true,
    });

    const id = uuidv4();
    const expiresAt = Date.now() + this.configService.get('CAPTCHA_EXPIRATION') * 1000;

    const captchaData: CaptchaData = {
      solution: captcha.text,
      expiresAt,
    };

    await this.redisService.set(
      `captcha:${id}`,
      JSON.stringify(captchaData),
      this.configService.get('CAPTCHA_EXPIRATION'),
    );

    return {
      id,
      image: captcha.data,
      expiresAt,
    };
  }

  async verifyCaptcha(captchaId: string, userInput: string) {
    const storedCaptcha = await this.redisService.get(`captcha:${captchaId}`);

    if (!storedCaptcha) {
      return { success: false };
    }

    const captchaData: CaptchaData = JSON.parse(storedCaptcha);

    if (Date.now() > captchaData.expiresAt) {
      await this.redisService.del(`captcha:${captchaId}`);
      return { success: false };
    }

    const isValid = captchaData.solution.toLowerCase() === userInput.toLowerCase();

    if (isValid) {
      await this.redisService.del(`captcha:${captchaId}`);
    }

    return { success: isValid };
  }
}
