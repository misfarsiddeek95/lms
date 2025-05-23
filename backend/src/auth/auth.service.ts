import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: loginDto.email },
      });

      if (!user) {
        return null;
      }

      if (!user?.isActive) {
        throw new ForbiddenException(
          'Your account is inactive. Please contact support.',
        );
      }

      if (user && (await bcrypt.compare(loginDto.password, user.password))) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
      name: `${user.firstName} ${user.lastName}`,
      user_id: user.id,
    };
  }

  async invalidateToken(token: string): Promise<void> {
    // Store the invalidated token in the database
    await this.prisma.token.create({
      data: { token },
    });
  }

  async isTokenInvalid(token: string): Promise<boolean> {
    // Check if the token is in the invalidated tokens list
    const invalidToken = await this.prisma.token.findUnique({
      where: { token },
    });
    return !!invalidToken;
  }
}
