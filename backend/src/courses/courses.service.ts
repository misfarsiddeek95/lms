import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdate(data: UpdateCourseDto) {
    try {
      const course = await this.prisma.course.upsert({
        where: {
          id: data.id ?? 0,
        },
        update: {
          name: data.name,
          description: data.description,
          duration: data.duration,
          price: data.price,
          isPublished: data.isPublished,
          currency: data.currency,
        },
        create: {
          name: data.name!,
          description: data.description!,
          duration: data.duration!,
          price: data.price!,
          isPublished: data.isPublished ?? false,
          currency: data.currency!,
        },
      });
      return course;
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return `This action returns all courses`;
  }

  async remove(id: number) {
    try {
      const checkExists = await this.prisma.course.findUnique({
        where: { id: +id },
      });

      if (!checkExists) {
        throw new NotFoundException("Couldn't find the course for given ID.");
      }

      return await this.prisma.course.delete({ where: { id: +id } });
    } catch (error) {
      throw error;
    }
  }
}
