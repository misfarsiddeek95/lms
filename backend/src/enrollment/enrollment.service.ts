import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Enrollment, User } from '@prisma/client';

@Injectable()
export class EnrollmentService {
  constructor(private prisma: PrismaService) {}

  async createEnrollments(data: CreateEnrollmentDto, loggedUser: any) {
    try {
      const { userId, courseIds } = data;

      if (!userId || !Array.isArray(courseIds) || courseIds.length === 0) {
        throw new BadRequestException(
          'Invalid request.  userId must be a number and courseIds must be a non-empty array of numbers.',
        );
      }

      // Check if the user exists.
      const user: User | null = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new BadRequestException(`User with ID ${userId} not found.`);
      }

      if (user.role === 'ADMIN') {
        throw new BadRequestException('Cannot assign course to an ADMIN');
      }

      if (loggedUser?.role === 'STUDENT' && userId !== loggedUser?.id) {
        throw new BadRequestException(
          'You cannot assign course to an another student',
        );
      }

      // Check if all courses exist.  This is important for data integrity.
      const courses = await this.prisma.course.findMany({
        where: {
          id: {
            in: courseIds,
          },
        },
      });

      if (courses.length !== courseIds.length) {
        const foundCourseIds = courses.map((c) => c.id);
        const missingCourseIds = courseIds.filter(
          (id) => !foundCourseIds.includes(id),
        );
        throw new BadRequestException(
          `Courses with IDs ${missingCourseIds.join(', ')} not found.`,
        );
      }

      // Check for existing enrollments to prevent duplicates.
      const existingEnrollments = await this.prisma.enrollment.findMany({
        where: {
          userId: userId,
          courseId: {
            in: courseIds,
          },
        },
        include: {
          user: true, // Include user and course details in the response
          course: true,
        },
      });

      const conflicts: any[] = [];
      const newCourseIdsToEnroll = courseIds.filter((courseId) => {
        const isEnrolled = existingEnrollments.some(
          (enrollment) => enrollment.courseId === courseId,
        );
        if (isEnrolled) {
          const conflictEnrollment = existingEnrollments.find(
            (e) => e.courseId === courseId,
          );
          conflicts.push({
            userId: userId,
            courseId: courseId,
            message: 'User is already enrolled in this course',
            enrollment: conflictEnrollment,
          });
          return false; //  Don't include this courseId in the new enrollments
        }
        return true; // Include if not already enrolled
      });

      // Create the new enrollments.
      const newEnrollments: Enrollment[] = [];
      if (newCourseIdsToEnroll.length > 0) {
        for (const courseId of newCourseIdsToEnroll) {
          const createdEnrollment = await this.prisma.enrollment.create({
            data: {
              userId: userId,
              courseId: courseId,
            },
            include: {
              user: true, // Include user and course details in the response
              course: true,
            },
          });
          newEnrollments.push(createdEnrollment);
        }
      }

      // Handle conflicts.
      if (conflicts.length > 0) {
        if (newEnrollments.length > 0) {
          // Return a 200 with both conflicts and successful enrollments
          const responseData = {
            message: 'Enrollment Conflict',
            conflicts: conflicts,
            enrolled: newEnrollments,
          };
          return responseData;
        }
        throw new ConflictException({
          message: 'Enrollment Conflict',
          conflicts: conflicts,
        });
      }

      return {
        message: 'Enrollment created successfully',
        conflicts: [],
        enrolled: newEnrollments,
      };
    } catch (error) {
      throw error;
    }
  }
}
