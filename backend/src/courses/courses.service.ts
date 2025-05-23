import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto, UpdatePublishDto } from './dto/update-course.dto';
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

  async fetchCourseDetail(id: number) {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id: +id },
      });

      if (!course) {
        throw new NotFoundException("Couldn't find the course for given ID.");
      }

      const { createdAt, updatedAt, ...result } = course;

      return result;
    } catch (error) {
      throw error;
    }
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

  async updatePublished(data: UpdatePublishDto) {
    try {
      const exists = await this.prisma.course.findUnique({
        where: { id: data.id },
      });
      if (!exists) {
        throw new NotFoundException('Course not found for given ID');
      }
      return await this.prisma.course.update({
        where: {
          id: data.id,
        },
        data: {
          isPublished: data.isPublished,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async fetchAllCoursesAdmin({ page, limit }: { page: number; limit: number }) {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.course.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.course.count(),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async searchCourses({ search, userId }: { search: string; userId: string }) {
    try {
      const enrolledCourses = await this.prisma.enrollment.findMany({
        where: {
          userId: Number(userId), // More explicit conversion
        },
        select: {
          courseId: true,
        },
      });

      const enrolledCourseIds = enrolledCourses.map(
        (course) => course.courseId,
      );

      const courses = await this.prisma.course.findMany({
        where: {
          isPublished: true,
          name: {
            contains: search.trim(), // Trim whitespace
            mode: 'insensitive',
          },
          ...(enrolledCourseIds.length > 0 && {
            // Only add exclusion if there are enrolled courses
            id: {
              notIn: enrolledCourseIds,
            },
          }),
        },
        select: {
          id: true,
          name: true,
        },
      });

      return courses;
    } catch (error) {
      throw error;
    }
  }

  async loadMyCourses(userId: number) {
    try {
      const enrolledList = await this.prisma.enrollment.findMany({
        where: {
          userId: userId,
        },
        select: {
          course: true,
        },
      });
      const courses = enrolledList.map((item) => ({
        id: item.course.id,
        name: item.course.name,
        description: item.course.description,
        duration: item.course.duration,
        price: item.course.price,
        currency: item.course.currency,
      }));

      return courses;
    } catch (error) {
      throw error;
    }
  }
}
