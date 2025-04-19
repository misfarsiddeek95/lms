// jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'm$r@131918',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    // Extract the token from the request
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    // Check if the token exists
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    // Check if the token is invalid
    if (await this.authService.isTokenInvalid(token)) {
      throw new UnauthorizedException('Token is invalid');
    }

    // Validate the user
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
