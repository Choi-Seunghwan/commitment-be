import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from '../auth/auth';
import { User } from 'src/user/user.entity';
import { JWT_PRIVATE_KEY } from 'src/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService, private authService: AuthService, private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(JWT_PRIVATE_KEY),
      passReqToCallback: true,
    });
  }

  async validate(req, payload: JwtPayload): Promise<User> {
    // const rawToken = req.headers['authorization'].split(' ')[1];
    const { id } = payload;
    const user: User = await this.authService.validateUser(id);

    if (!user) throw new UnauthorizedException('user not found');

    return user;
  }
}
