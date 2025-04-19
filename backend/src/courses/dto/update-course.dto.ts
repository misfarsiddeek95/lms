import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from './create-course.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @ApiProperty({
    example: 1,
    description: 'Course ID (required for update)',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  id: number;
}
