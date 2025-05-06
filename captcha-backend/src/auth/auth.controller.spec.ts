import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should return success when registration is successful', async () => {
      const registerDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        captchaId: 'captcha123',
        userInput: 'ABC123',
      };

      const expectedResponse = {
        success: true,
        message: 'User registered successfully',
      };

      mockAuthService.register.mockResolvedValue(expectedResponse);

      const result = await controller.register(registerDto);

      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should handle registration failure', async () => {
      const registerDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        captchaId: 'captcha123',
        userInput: 'ABC123',
      };

      const errorResponse = {
        success: false,
        message: 'Registration failed',
      };

      mockAuthService.register.mockResolvedValue(errorResponse);

      const result = await controller.register(registerDto);

      expect(result).toEqual(errorResponse);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });
  });
}); 