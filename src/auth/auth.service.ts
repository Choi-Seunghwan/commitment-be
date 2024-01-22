import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUpGuest() {
    const createdGuestUser = await this.usersService.createGuestUser();
    const userInfo = this.usersService.createUserInfo(createdGuestUser);

    const payload = {
      username: createdGuestUser.nickname,
      isGuest: true,
      sub: createdGuestUser.id,
    };

    const token = await this.jwtService.signAsync(payload);
    return { userInfo, token };
  }

  async validateUser(userId: string) {}
}
