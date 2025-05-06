import { Test, TestingModule } from '@nestjs/testing';
import { CaptchaService } from './captcha.service';
import { RedisService } from '../redis/redis.service';
import { BadRequestException } from '@nestjs/common';

describe('CaptchaService', () => {
  let service: CaptchaService;
  let redisService: RedisService;

  const mockRedisService = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaptchaService,
        {
          provide: RedisService,
          useValue: mockRedisService,
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
      expect(mockRedisService.set).toHaveBeenCalled();
    });
  });

  describe('verifyCaptcha', () => {
    it('should verify correct solution', async () => {
      const captchaId = 'test-id';
      const userInput = 'test-input';
      const storedCaptcha = 'test-input';

      mockRedisService.get.mockResolvedValue(storedCaptcha);

      const result = await service.verifyCaptcha(captchaId, userInput);

      expect(result).toBe(true);
      expect(mockRedisService.del).toHaveBeenCalledWith(`captcha:${captchaId}`);
    });

    it('should reject incorrect solution', async () => {
      const captchaId = 'test-id';
      const userInput = 'wrong-input';
      const storedCaptcha = 'test-input';

      mockRedisService.get.mockResolvedValue(storedCaptcha);

      const result = await service.verifyCaptcha(captchaId, userInput);

      expect(result).toBe(false);
      expect(mockRedisService.del).toHaveBeenCalledWith(`captcha:${captchaId}`);
    });

    it('should throw error for invalid captcha id', async () => {
      const captchaId = 'non-existent-id';
      const userInput = 'test-input';

      mockRedisService.get.mockResolvedValue(null);

      await expect(service.verifyCaptcha(captchaId, userInput)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockRedisService.del).not.toHaveBeenCalled();
    });

    it('should throw error for expired captcha', async () => {
      const captchaId = 'expired-id';
      const userInput = 'test-input';
      const storedCaptcha = {
        text: 'test-input',
        expiresAt: Date.now() - 1000, // expired 1 second ago
      };

      mockRedisService.get.mockResolvedValue(JSON.stringify(storedCaptcha));

      await expect(service.verifyCaptcha(captchaId, userInput)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockRedisService.del).toHaveBeenCalledWith(`captcha:${captchaId}`);
    });
  });
});
