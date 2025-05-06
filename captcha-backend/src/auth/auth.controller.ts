import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

interface RegisterDto {
  username: string;
  email: string;
  password: string;
  captchaId: string;
  userInput: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
} 