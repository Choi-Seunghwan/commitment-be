import { Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserInfo } from 'src/user/user';
import { AuthUser } from 'src/security/auth-user.decorator';
import { User } from 'src/user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sigh-up-guest')
  @HttpCode(201)
  async sighUpGuest(): Promise<{ user: UserInfo; token: string }> {
    const { userInfo, token } = await this.authService.signUpGuest();
    return { user: userInfo, token };
  }

  @Post('/token')
  async validToken(@AuthUser() user: User) {
    return user || false;
  }
}
