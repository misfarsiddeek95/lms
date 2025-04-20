import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async fetchAllCourses({
    search,
    page,
    limit,
  }: {
    search?: string;
    page: number;
    limit: number;
  }) {
    const where = {
      isPublished: true,
      ...(search
        ? {
            name: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.course.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

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
