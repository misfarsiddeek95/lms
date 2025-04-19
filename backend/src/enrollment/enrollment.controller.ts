import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { Enrollment, Role } from '@prisma/client';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
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
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('Enrollments')
@ApiBearerAuth()
@Controller('enrollment')
@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.ADMIN)
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Roles(Role.ADMIN, Role.STUDENT)
  @Post('create-enrollment')
  @ApiOperation({
    summary: 'Create new enrollments',
    description:
      'Enroll a user in multiple courses. Admins can enroll any user, students can only enroll themselves.',
  })
  @ApiBody({ type: CreateEnrollmentDto })
  @ApiCreatedResponse({
    description: 'Enrollments created successfully',
    schema: {
      example: {
        message: 'Enrollment created successfully',
        conflicts: [],
        enrolled: [
          {
            id: 27,
            userId: 10,
            courseId: 4,
            enrolledAt: '2025-04-19T23:09:47.407Z',
            user: {
              id: 10,
              email: 'david@gmail.com',
              password: '$2b$10$QqjZKXNMp7D....',
              role: 'STUDENT',
              firstName: 'David',
              lastName: 'Bombal',
              isActive: true,
              createdAt: '2025-04-19T22:12:32.030Z',
              updatedAt: '2025-04-19T22:12:32.030Z',
            },
            course: {
              id: 4,
              name: 'Introduction to TypeScript',
              description: 'A beginner-friendly course to learn TypeScript.',
              duration: '10 Weeks',
              price: '149.99',
              currency: 'USD',
              isPublished: true,
              createdAt: '2025-04-19T21:02:16.225Z',
              updatedAt: '2025-04-19T21:02:16.225Z',
            },
          },
          {
            id: 28,
            userId: 10,
            courseId: 3,
            enrolledAt: '2025-04-19T23:09:47.423Z',
            user: {
              id: 10,
              email: 'david@gmail.com',
              password: '$2b$10$QqjZKXNMp7....',
              role: 'STUDENT',
              firstName: 'David',
              lastName: 'Bombal',
              isActive: true,
              createdAt: '2025-04-19T22:12:32.030Z',
              updatedAt: '2025-04-19T22:12:32.030Z',
            },
            course: {
              id: 3,
              name: 'NestJS Mastery',
              description: 'Advanced NestJS training',
              duration: '20 Weeks',
              price: '199.99',
              currency: 'USD',
              isPublished: true,
              createdAt: '2025-04-19T21:01:29.844Z',
              updatedAt: '2025-04-19T21:01:29.844Z',
            },
          },
        ],
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing token',
    schema: {
      example: {
        statusCode: 401,
        timestamp: '2025-04-19T23:11:18.668Z',
        path: '/api/enrollment/create-enrollment',
        message: {
          message: 'Unauthorized',
          statusCode: 401,
        },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Students can only enroll themselves',
    schema: {
      example: {
        statusCode: 403,
        timestamp: '2025-04-19T23:14:25.003Z',
        path: '/api/enrollment/create-enrollment',
        message: {
          message: 'You cannot assign course to an another student',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
    },
  })
  async createEnrollments(
    @Body() data: CreateEnrollmentDto,
    @Req() request: Request,
  ) {
    return this.enrollmentService.createEnrollments(data, request?.user);
  }

  @Roles(Role.ADMIN, Role.STUDENT)
  @ApiOperation({
    summary: 'Remove an enrollment',
    description:
      'Delete an enrollment record. Admins can remove any enrollment, students can only remove their own.',
  })
  @ApiParam({
    name: 'id',
    description: 'Enrollment ID to remove',
    example: 1,
    type: Number,
  })
  @ApiOkResponse({
    description: 'Enrollment removed successfully',
    schema: {
      example: {
        message: 'Enrollment deleted successfully',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing token',
    schema: {
      example: {
        statusCode: 401,
        timestamp: '2025-04-19T23:17:10.220Z',
        path: '/api/enrollment/remove-enrollment/28',
        message: {
          message: 'Unauthorized',
          statusCode: 401,
        },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Students can only remove their own enrollments',
    schema: {
      example: {
        statusCode: 403,
        timestamp: '2025-04-19T23:18:15.538Z',
        path: '/api/enrollment/remove-enrollment/28',
        message: {
          message: 'You cannot delete the enrollment of another student',
          error: 'Bad Request',
          statusCode: 403,
        },
      },
    },
  })
  @Delete('remove-enrollment/:id')
  async removeEnrollment(@Param('id') id: number, @Req() request: Request) {
    return this.enrollmentService.removeEntollment(+id, request?.user);
  }
}
