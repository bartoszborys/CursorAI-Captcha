import { Test, TestingModule } from '@nestjs/testing';
import { CaptchaService } from './captcha.service';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';

describe('CaptchaService', () => {
  let service: CaptchaService;
  let redisService: RedisService;

  const mockRedisService = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      switch (key) {
        case 'captcha.expiration':
          return 300;
        default:
          return null;
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaptchaService,
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<CaptchaService>(CaptchaService);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateCaptcha', () => {
    it('should generate a new captcha', async () => {
      const result = await service.generateCaptcha();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('image');
      expect(result).toHaveProperty('expiresAt');
      expect(mockRedisService.set).toHaveBeenCalled();
    });
  });

  describe('verifyCaptcha', () => {
    it('should verify correct solution', async () => {
      const captchaId = 'test-id';
      const userInput = 'test-input';
      const expiresAt = Date.now() + 300000; // 5 minutes from now

      const captchaData = {
        solution: userInput,
        expiresAt: expiresAt,
      };

      mockRedisService.get.mockResolvedValue(JSON.stringify(captchaData));

      const result = await service.verifyCaptcha(captchaId, userInput);
      expect(result).toEqual({ success: true });
      expect(mockRedisService.del).toHaveBeenCalledWith(`captcha:${captchaId}`);
    });

    it('should reject incorrect solution', async () => {
      const captchaId = 'test-id';
      const userInput = 'wrong-input';
      const expiresAt = Date.now() + 300000; // 5 minutes from now

      const captchaData = {
        solution: 'correct-input',
        expiresAt: expiresAt,
      };

      mockRedisService.get.mockResolvedValue(JSON.stringify(captchaData));

      const result = await service.verifyCaptcha(captchaId, userInput);
      expect(result).toEqual({ success: false });
    });

    it('should reject expired captcha', async () => {
      const captchaId = 'test-id';
      const userInput = 'test-input';
      const expiresAt = Date.now() - 1000; // expired 1 second ago

      const captchaData = {
        solution: userInput,
        expiresAt: expiresAt,
      };

      mockRedisService.get.mockResolvedValue(JSON.stringify(captchaData));

      const result = await service.verifyCaptcha(captchaId, userInput);
      expect(result).toEqual({ success: false });
      expect(mockRedisService.del).toHaveBeenCalledWith(`captcha:${captchaId}`);
    });

    it('should reject non-existent captcha', async () => {
      const captchaId = 'non-existent';
      const userInput = 'test-input';

      mockRedisService.get.mockResolvedValue(null);

      const result = await service.verifyCaptcha(captchaId, userInput);
      expect(result).toEqual({ success: false });
    });
  });
});
