import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('courses')
@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.ADMIN)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post('create-or-update-course')
  create(@Body() data: UpdateCourseDto) {
    return this.coursesService.createOrUpdate(data);
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Delete('delete-course/:id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(+id);
  }
}
