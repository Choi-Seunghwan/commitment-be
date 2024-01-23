import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserInfo } from 'src/user/user';
import { AuthUser } from 'src/security/auth-user.decorator';
import { User } from 'src/user/user.entity';
import { JwtAuthGuard } from 'src/security/jwt-auth.guard';

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
  @UseGuards(JwtAuthGuard)
  async validToken(@AuthUser() user: User) {
    return user || false;
  }
}
