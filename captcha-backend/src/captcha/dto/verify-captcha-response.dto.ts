import { ApiProperty } from '@nestjs/swagger';

export class VerifyCaptchaResponseDto {
  @ApiProperty({
    description: 'Czy weryfikacja się powiodła',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Komunikat o wyniku weryfikacji',
    example: 'CAPTCHA verified successfully',
    required: false,
  })
  message?: string;
} 