import { Module } from '@nestjs/common';
import { CaptchaController } from './captcha.controller';
import { CaptchaService } from './captcha.service';
import { RedisService } from '../redis/redis.service';

@Module({
  controllers: [CaptchaController],
  providers: [CaptchaService, RedisService],
})
export class CaptchaModule {}
