import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class VerifyCaptchaDto {
  @ApiProperty({
    description: 'ID CAPTCHA do weryfikacji',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  captchaId: string;

  @ApiProperty({
    description: 'Wprowadzone przez użytkownika rozwiązanie CAPTCHA',
    example: 'abc123',
  })
  @IsString()
  @IsNotEmpty()
  userInput: string;
} 