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

    const payload = {
      username: createdGuestUser.nickname,
      sub: createdGuestUser.id,
    };

    const token = await this.jwtService.signAsync(payload);
    return { token };
  }
}
