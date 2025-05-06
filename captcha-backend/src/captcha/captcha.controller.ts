import { Controller, Post, Body, Get, HttpCode, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CaptchaService } from './captcha.service';
import { CaptchaResponseDto } from './dto/captcha-response.dto';
import { VerifyCaptchaResponseDto } from './dto/verify-captcha-response.dto';

@ApiTags('captcha')
@Controller('captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}

  @Get('generate')
  @ApiOperation({ summary: 'Generuj nową CAPTCHA' })
  @ApiResponse({
    status: 200,
    description: 'CAPTCHA została wygenerowana',
    type: CaptchaResponseDto,
  })
  async generateCaptcha(): Promise<CaptchaResponseDto> {
    return this.captchaService.generateCaptcha();
  }

  @Post('verify')
  @HttpCode(200)
  @ApiOperation({ summary: 'Weryfikuj CAPTCHA' })
  @ApiResponse({
    status: 200,
    description: 'Wynik weryfikacji CAPTCHA',
    type: VerifyCaptchaResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Nieprawidłowe dane wejściowe lub wygasła CAPTCHA',
  })
  async verifyCaptcha(
    @Body('captchaId') captchaId: string,
    @Body('userInput') userInput: string,
  ): Promise<VerifyCaptchaResponseDto> {
    const {success} = await this.captchaService.verifyCaptcha(
      captchaId,
      userInput,
    );

    return {
      success,
      message: success
        ? 'CAPTCHA verified successfully'
        : 'Invalid CAPTCHA solution',
    };
  }
}
