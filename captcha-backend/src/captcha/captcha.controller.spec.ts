import { Test, TestingModule } from '@nestjs/testing';
import { CaptchaController } from './captcha.controller';
import { CaptchaService } from './captcha.service';

describe('CaptchaController', () => {
  let controller: CaptchaController;
  let service: CaptchaService;

  const mockCaptchaService = {
    generateCaptcha: jest.fn(),
    verifyCaptcha: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaptchaController],
      providers: [
        {
          provide: CaptchaService,
          useValue: mockCaptchaService,
        },
      ],
    }).compile();

    controller = module.get<CaptchaController>(CaptchaController);
    service = module.get<CaptchaService>(CaptchaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generateCaptcha', () => {
    it('should generate a new captcha', async () => {
      const expectedResponse = {
        id: 'test-id',
        image: 'test-image',
      };

      mockCaptchaService.generateCaptcha.mockResolvedValue(expectedResponse);

      const result = await controller.generateCaptcha();

      expect(result).toEqual(expectedResponse);
      expect(service.generateCaptcha).toHaveBeenCalled();
    });
  });

  describe('verifyCaptcha', () => {
    it('should verify captcha solution', async () => {
      const body = {
        captchaId: 'test-id',
        userInput: 'test-input',
      };
      const expectedResponse = {
        success: true,
        message: 'CAPTCHA verified successfully',
      };

      mockCaptchaService.verifyCaptcha.mockResolvedValue({success: true});

      const result = await controller.verifyCaptcha(body);

      expect(result).toEqual(expectedResponse);
      expect(service.verifyCaptcha).toHaveBeenCalledWith(
        body.captchaId,
        body.userInput,
      );
    });

    it('should return error message for invalid solution', async () => {
      const body = {
        captchaId: 'test-id',
        userInput: 'wrong-input',
      };
      const expectedResponse = {
        success: false,
        message: 'Invalid CAPTCHA solution',
      };

      mockCaptchaService.verifyCaptcha.mockResolvedValue({success: false});

      const result = await controller.verifyCaptcha(body);

      expect(result).toEqual(expectedResponse);
      expect(service.verifyCaptcha).toHaveBeenCalledWith(
        body.captchaId,
        body.userInput,
      );
    });
  });
});
