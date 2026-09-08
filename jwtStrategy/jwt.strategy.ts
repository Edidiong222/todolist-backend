import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';

import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt',
) {

  constructor(
    private userService: UserService,
  ) {

    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey: process.env.JWTSECRET!,
    });
  }


  async validate(payload: {
    id: string;
    email: string;
    role: string;
  }) {

    const user = await this.userService.findById(
      payload.id,
    );

    if (!user) {

      throw new UnauthorizedException(
        'Login first to access this endpoint',
      );

    }


    // ADDED: REMOVE PASSWORD BEFORE ATTACHING
    // USER TO req.user

    const {
      password,
      ...userWithoutPassword
    } = user;

    return userWithoutPassword;
  }

}