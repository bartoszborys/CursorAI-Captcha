import { ApiProperty } from '@nestjs/swagger';

export class CreateCaptchaDto {
  @ApiProperty({
    description: 'Typ CAPTCHA (matematyczna, logiczna, itp.)',
    example: 'mathematical',
    required: false,
    default: 'mathematical'
  })
  type?: string;
} 