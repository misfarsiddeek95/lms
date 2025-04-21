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
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Users') // Groups all user-related endpoints
@ApiBearerAuth()
@Controller('user')
@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.ADMIN)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('fetch-students')
  fetchStudents(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 8,
  ) {
    return this.userService.fetchStudents({ page: +page, limit: +limit });
  }

  @Get('get-user/:id')
  getUser(@Param('id') id: string) {
    return this.userService.getUser(+id);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      example: {
        id: 11,
        email: 'joh@gmail.com',
        role: 'STUDENT',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        createdAt: '2025-04-19T22:44:08.556Z',
        updatedAt: '2025-04-19T22:44:08.556Z',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing token',
    schema: {
      example: {
        statusCode: 401,
        timestamp: '2025-04-19T22:48:38.361Z',
        path: '/api/user/register',
        message: {
          message: 'Unauthorized',
          statusCode: 401,
        },
      },
    },
  })
  @Public()
  async register(
    @Body()
    registerDto: CreateUserDto,
  ) {
    return this.userService.register(registerDto);
  }

  @Patch('update-user')
  @ApiOperation({ summary: 'Update user information' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully updated',
    schema: {
      example: {
        id: 11,
        email: 'joh@gmail.com',
        role: 'STUDENT',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        createdAt: '2025-04-19T22:44:08.556Z',
        updatedAt: '2025-04-19T22:44:08.556Z',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing token',
    schema: {
      example: {
        statusCode: 401,
        timestamp: '2025-04-19T22:48:38.361Z',
        path: '/api/user/register',
        message: {
          message: 'Unauthorized',
          statusCode: 401,
        },
      },
    },
  })
  async updateUser(@Body() updateDto: UpdateUserDto) {
    return this.userService.updateUser(updateDto);
  }

  @Delete('delete-user/:id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({
    name: 'id',
    description: 'User ID to delete',
    example: 11,
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully deleted',
    schema: {
      example: {
        id: 11,
        email: 'joh@gmail.com',
        password:
          '$2b$10$H8uiiofAjYAgAVzYAFH/Se7Uirsf1en9672d/jrp8TuGrt.WI95dq',
        role: 'STUDENT',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        createdAt: '2025-04-19T22:44:08.556Z',
        updatedAt: '2025-04-19T22:44:08.556Z',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing token',
    schema: {
      example: {
        statusCode: 401,
        timestamp: '2025-04-19T22:53:32.709Z',
        path: '/api/user/delete-user/11',
        message: {
          message: 'Unauthorized',
          statusCode: 401,
        },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Admin role required',
    schema: {
      example: {
        statusCode: 403,
        timestamp: '2025-04-19T22:52:14.363Z',
        path: '/api/user/delete-user/11',
        message: {
          message: 'You do not have permission to access this resource',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
    },
  })
  async deleteUser(@Param('id') id: string, @Req() request: Request) {
    return this.userService.deleteUser(id, request?.user);
  }

  @Get('search-students')
  async searchStudent(@Query('search') search: string) {
    return this.userService.searchStudent({ search });
  }
}
