import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
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
    ThrottlerModule.forRoot([{
      ttl: 30000,
      limit: 20,
      ignoreUserAgents: [],
      skipIf: () => false,
    }]),
    RedisConfigModule,
    CaptchaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
