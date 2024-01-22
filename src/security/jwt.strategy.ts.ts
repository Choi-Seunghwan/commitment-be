import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from '../auth/auth';
import { UserInfo } from 'src/user/user';
import { User } from 'src/user/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_PRIVATE_KEY'),
      passReqToCallback: true,
    });
  }

  async validate(
    req,
    payload: JwtPayload,
  ): Promise<{ user: UserInfo; token: string } | boolean> {
    const rawToken = req.headers['authorization'].split(' ')[1];
    const { id } = payload;
    const user: User = await this.authService.validateUser(id);

    if (!user) return false;

    const userInfo = userInfoFactory(user);
    return { user: userInfo, token: rawToken };
  }
}
