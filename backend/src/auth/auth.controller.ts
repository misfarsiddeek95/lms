import {
  Body,
  Controller,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt')) // Protect the route with JWT authentication
  async logout(@Request() req) {
    // Extract the token from the request
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req) ?? null;

    // Check if the token exists
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    // Invalidate the token
    await this.authService.invalidateToken(token);

    return { message: 'Logged out successfully' };
  }
}
