import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { Enrollment, Role } from '@prisma/client';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Request } from 'express';

@Controller('enrollment')
@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.ADMIN)
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Roles(Role.ADMIN, Role.STUDENT)
  @Post('create-enrollment')
  async createEnrollments(
    @Body() data: CreateEnrollmentDto,
    @Req() request: Request,
  ) {
    return this.enrollmentService.createEnrollments(data, request?.user);
  }
}
