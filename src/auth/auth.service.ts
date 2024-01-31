import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserMyInfo } from 'src/user/user.type';
import { userMyInfoMapper } from 'src/user/user.mapper';

@Injectable()
export class AuthService {
  constructor(@Inject(forwardRef(() => UserService)) private userService: UserService, private jwtService: JwtService) {}

  async signUpGuest(): Promise<{ userMyInfo: UserMyInfo; token: string }> {
    const createdGuestUser = await this.userService.createGuestUser();
    const userMyInfo = userMyInfoMapper(createdGuestUser);

    const payload = {
      username: createdGuestUser.nickname,
      isGuest: true,
      sub: createdGuestUser.id,
    };

    const token = await this.jwtService.signAsync(payload);
    return { userMyInfo, token };
  }

  async validateUser(userId: string) {
    const user = await this.userService.getUser(userId);
    return user;
  }
}
