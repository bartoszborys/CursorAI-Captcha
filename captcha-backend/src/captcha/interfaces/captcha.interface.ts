export interface CaptchaResponse {
  captchaId: string;
  image: string;
  expiresAt: number;
}

export interface CaptchaVerificationResponse {
  success: boolean;
  message?: string;
}

export interface CaptchaData {
  id: string;
  solution: string;
  expiresAt: number;
  attempts: number;
} 