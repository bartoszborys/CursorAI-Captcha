import { ApiProperty } from '@nestjs/swagger';

export class CaptchaResponseDto {
  @ApiProperty({
    description: 'Unikalny identyfikator CAPTCHA',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Obraz CAPTCHA w formacie SVG',
    example: '<svg>...</svg>',
  })
  image: string;

  @ApiProperty({
    description: 'Czas ważności CAPTCHA w UNIX TIMESTAMP',
    example: '1648656000000',
  })
  expiresAt: number;
} 