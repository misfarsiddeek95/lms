import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    return await this.prisma.user
      .findMany({
        where: { role: 'EMPLOYEE' },
        select: {
          id: true,
          empId: true,
          firstName: true,
          lastName: true,
          userName: true,
          department: true,
          role: true,
          tasks: {
            select: {
              isCompleted: true,
            },
          },
        },
      })
      .then((users) =>
        users.map((user) => {
          const completedTasks = user?.tasks?.filter(
            (task) => task.isCompleted,
          ).length;
          const totalTasks = user?.tasks?.length;
          const completedPercentage =
            totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

          return {
            ...user,
            completedTasks,
            notCompletedTasks: totalTasks - completedTasks,
            completedPercentage,
            totalTasks,
          };
        }),
      );
  }

  async register(userDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    const empId = await this.generateEmpId();

    const isUsernameExist = await this.prisma.user.findUnique({
      where: {
        userName: userDto.username,
      },
    });

    if (isUsernameExist) {
      throw new ConflictException('Username already exists');
    }

    const createUser = await this.prisma.user
      .create({
        data: {
          empId,
          firstName: userDto.firstName,
          lastName: userDto.lastName,
          password: hashedPassword,
          role: userDto.role || Role.EMPLOYEE,
          department: userDto.department,
          userName: userDto.username,
        },
        select: {
          id: true,
          empId: true,
          firstName: true,
          lastName: true,
          userName: true,
          department: true,
          password: true,
          role: true,
          tasks: {
            select: {
              isCompleted: true,
            },
          },
        },
      })
      .then((user) => {
        const completedTasks = user?.tasks?.filter(
          (task) => task.isCompleted,
        ).length;
        const totalTasks = user?.tasks?.length;
        const completedPercentage =
          totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        return {
          ...user,
          completedTasks,
          notCompletedTasks: totalTasks - completedTasks,
          completedPercentage,
          totalTasks,
        };
      });

    const { password, ...result } = createUser;
    return result;
  }

  // generate empId like EMP00001
  private generateEmpId = async () => {
    const lastUser = await this.prisma.user.findFirst({
      orderBy: { id: 'desc' },
    });
    let nextNum = 1;
    if (lastUser?.empId) {
      const lastNumber = parseInt(lastUser.empId.replace('EMP', ''), 10);
      nextNum = lastNumber + 1;
    }
    return `EMP${String(nextNum).padStart(5, '0')}`;
  };

  async updateUser(updateDto: UpdateUserDto) {
    try {
      const checkUserExists = await this.prisma.user.findUniqueOrThrow({
        where: {
          id: updateDto.id,
        },
      });

      if (checkUserExists) {
        const existingUser = await this.prisma.user.findUnique({
          where: { userName: updateDto.username },
        });

        if (existingUser && existingUser.id !== checkUserExists.id) {
          throw new ConflictException(
            'Username already exists. Please try another.',
          );
        }

        // const hashedPassword = await bcrypt.hash(updateDto.password, 10);

        const updatedUser = await this.prisma.user.update({
          where: { id: updateDto.id },
          data: {
            firstName: updateDto.firstName,
            lastName: updateDto.lastName,
            role: updateDto.role || Role.EMPLOYEE,
            department: updateDto.department,
            userName: updateDto.username,
          },
        });
        const { password, ...result } = updatedUser;
        return result;
      }
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('User not found');
      }
      throw error; // Re-throw other errors
    }
  }

  async deleteUser(id: string) {
    try {
      const checkUserExists = await this.prisma.user.findUniqueOrThrow({
        where: {
          id: +id,
        },
      });

      if (checkUserExists) {
        return await this.prisma.user.delete({ where: { id: +id } });
      }
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('User not found');
      }
      throw error; // Re-throw other errors
    }
  }
}
