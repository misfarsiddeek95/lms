import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Delete,
  Param,
  Get,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';
import { Request } from 'express';

@Controller('user')
@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.ADMIN)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(
    @Body()
    registerDto: CreateUserDto,
  ) {
    return this.userService.register(registerDto);
  }

  @Patch('update-user')
  async updateUser(@Body() updateDto: UpdateUserDto) {
    return this.userService.updateUser(updateDto);
  }

  @Delete('delete-user/:id')
  async deleteUser(@Param('id') id: string, @Req() request: Request) {
    return this.userService.deleteUser(id, request?.user);
  }
}
