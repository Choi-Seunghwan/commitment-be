import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserMyInfo } from 'src/user/user.type';
import { AuthUser } from 'src/security/auth-user.decorator';
import { User } from 'src/user/user.entity';
import { JwtAuthGuard } from 'src/security/jwt-auth.guard';
import { userMyInfoMapper } from 'src/user/user.mapper';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up-guest')
  @HttpCode(201)
  async sighUpGuest(): Promise<{ user: UserMyInfo; token: string }> {
    const { userMyInfo, token } = await this.authService.signUpGuest();

    return { user: userMyInfo, token };
  }

  @Post('/token')
  @UseGuards(JwtAuthGuard)
  async validToken(@AuthUser() user: User) {
    const userMyInfo: UserMyInfo = userMyInfoMapper(user);

    return { user: userMyInfo };
  }
}
