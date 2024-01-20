import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserInfo } from 'os';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sigh-up-guest')
  @HttpCode(201)
  async sighUpGuest(@Body() body): Promise<{ user: UserInfo; token: string }> {
    const { userInfo, token } = await this.authService.signUpGuest();
  }
}
