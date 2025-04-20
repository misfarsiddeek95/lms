import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async fetchStudents({ page, limit }: { page: number; limit: number }) {
    const [students, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where: {
          role: 'STUDENT',
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          enrollments: {
            include: {
              course: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where: { role: 'STUDENT' } }),
    ]);

    const result = students.map((student) => ({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      isActive: student.isActive,
      role: student.role,
      email: student.email,
      courses: student.enrollments.map((enrollment) => ({
        courseId: enrollment.course.id.toString(),
        courseName: enrollment.course.name,
        enrolledDate: new Date(enrollment.enrolledAt).toLocaleDateString(), // Format as needed
        fee: enrollment.course.currency + ' ' + enrollment.course.price,
        duration: enrollment.course.duration,
      })),
    }));

    return {
      data: result,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async register(data: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const isUserNameExists = await this.prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });

      if (isUserNameExists) {
        throw new ConflictException('Username already exists');
      }

      const createUser = await this.prisma.user.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role || Role.STUDENT,
          password: hashedPassword,
          email: data.email,
          isActive: data.isActive || true,
        },
      });

      const { password, ...result } = createUser;
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateUser(data: UpdateUserDto) {
    try {
      const isUserExists = await this.prisma.user.findUnique({
        where: {
          id: data.id,
        },
      });

      if (!isUserExists) {
        throw new NotFoundException("Couldn't find the user for given ID");
      }

      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser && existingUser.id !== isUserExists.id) {
        throw new ConflictException(
          'Username already exists. Please try another.',
        );
      }

      const updatedUser = await this.prisma.user.update({
        where: {
          id: data.id,
        },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role || Role.STUDENT,
          email: data.email,
          isActive: data.isActive,
        },
      });
      const { password, ...result } = updatedUser;
      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: string, user: any) {
    try {
      if (user?.id === +id) {
        throw new ForbiddenException(
          'You are not allowed to delete your own account',
        );
      }

      const checkUserExists = await this.prisma.user.findUnique({
        where: {
          id: +id,
        },
      });

      if (!checkUserExists) {
        throw new NotFoundException("Couldn't find the user for given ID");
      }

      return await this.prisma.user.delete({ where: { id: +id } });
    } catch (error) {
      throw error;
    }
  }
}
