import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Courses') // Groups all course-related endpoints
@ApiBearerAuth()
@Controller('courses')
@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.ADMIN)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get('fetch-all-courses')
  @Public()
  @ApiOperation({ summary: 'Fetch all courses (public)' })
  @ApiResponse({
    status: 200,
    description: 'List of all available courses',
    schema: {
      example: [
        {
          id: 1,
          name: 'Intro to JS',
          description: 'JavaScript basics for beginners.',
          duration: '2 Months',
          price: '149.99',
          currency: 'USD',
          isPublished: true,
          createdAt: '2025-04-19T22:00:00.000Z',
          updatedAt: '2025-04-19T22:00:00.000Z',
        },
      ],
    },
  })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  fetchAllCourses(
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.coursesService.fetchAllCourses({
      search,
      page: +page,
      limit: +limit,
    });
  }

  @Post('create-or-update-course')
  @ApiOperation({
    summary: 'Create or update a course',
    description:
      'Creates new course if ID is not provided, updates existing if ID is provided',
  })
  @ApiBody({ type: UpdateCourseDto })
  @ApiResponse({
    status: 201,
    description: 'Course created/updated successfully',
    schema: {
      example: {
        id: 6,
        name: 'Introduction to PHP',
        description: 'A beginner-friendly course to learn PHP.',
        duration: '3 Months',
        price: '199.99',
        currency: 'USD',
        isPublished: true,
        createdAt: '2025-04-19T22:59:59.590Z',
        updatedAt: '2025-04-19T22:59:59.590Z',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing token',
    schema: {
      example: {
        statusCode: 401,
        timestamp: '2025-04-19T23:02:20.799Z',
        path: '/api/courses/create-or-update-course',
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
        timestamp: '2025-04-19T23:03:41.741Z',
        path: '/api/courses/create-or-update-course',
        message: {
          message: 'You do not have permission to access this resource',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
    },
  })
  create(@Body() data: UpdateCourseDto) {
    return this.coursesService.createOrUpdate(data);
  }

  @Delete('delete-course/:id')
  @ApiOperation({ summary: 'Delete a course' })
  @ApiParam({
    name: 'id',
    description: 'Course ID to delete',
    example: '1',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Course deleted successfully',
    schema: {
      example: {
        id: 5,
        name: 'Introduction to Next.js',
        description: 'A beginner-friendly course to learn Next.js.',
        duration: '3 Months',
        price: '500',
        currency: 'USD',
        isPublished: true,
        createdAt: '2025-04-19T21:13:38.703Z',
        updatedAt: '2025-04-19T21:13:38.703Z',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing token',
    schema: {
      example: {
        statusCode: 401,
        timestamp: '2025-04-19T23:04:43.242Z',
        path: '/api/courses/delete-course/1',
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
        timestamp: '2025-04-19T23:04:15.626Z',
        path: '/api/courses/delete-course/1',
        message: {
          message: 'You do not have permission to access this resource',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.coursesService.remove(+id);
  }
}
