import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CaptchaModule } from './captcha/captcha.module';
import { RedisConfigModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import captchaConfig from './config/captcha.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [captchaConfig],
    }),
    RedisConfigModule,
    CaptchaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
