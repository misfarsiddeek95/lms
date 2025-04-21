import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma, Role } from '@prisma/client';
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

  async getUser(id: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const { password, ...result } = user;
      return result;
    } catch (error) {
      throw error;
    }
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

      if (data.email && data.email !== isUserExists.email) {
        const existingUser = await this.prisma.user.findUnique({
          where: { email: data.email },
        });

        if (existingUser && existingUser.id !== isUserExists.id) {
          throw new ConflictException(
            'Email already exists. Please try another.',
          );
        }
      }

      const { id, ...rest } = data;
      const cleanedData = this.removeUndefinedFields(rest);

      const updatedUser = await this.prisma.user.update({
        where: {
          id,
        },
        data: cleanedData,
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

  removeUndefinedFields<T extends object>(obj: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== undefined),
    ) as Partial<T>;
  }

  async searchStudent({ search }: { search: string }) {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          role: 'STUDENT', // Only students
          isActive: true,
          OR: [
            {
              firstName: {
                contains: search,
                mode: Prisma.QueryMode.insensitive, // Case-insensitive match
              },
            },
            {
              lastName: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
        orderBy: {
          firstName: 'asc',
        },
      });

      // Optional: Combine firstName + lastName for easier use in frontend
      return users.map((user) => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
      }));
    } catch (error) {
      console.error('Error searching students:', error);
      throw error;
    }
  }
}
