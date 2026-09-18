import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  waitlistSignupSchema,
  type WaitlistSignup,
  type WaitlistSignupResponse,
} from '@safeexit/api-contracts';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';
import { WaitlistService } from './waitlist.service.js';

@Controller('v1/waitlist')
export class WaitlistController {
  constructor(private readonly waitlist: WaitlistService) {}

  @Post()
  @HttpCode(201)
  async signUp(
    @Body(new ZodValidationPipe(waitlistSignupSchema)) signup: WaitlistSignup,
  ): Promise<WaitlistSignupResponse> {
    return this.waitlist.signUp(signup);
  }
}
