import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from './create-course.dto';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

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

export class UpdatePublishDto {
  @ApiProperty({
    example: 1,
    description: 'Course ID (required for update)',
    required: false,
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    example: true,
    description: 'Whether the course is published',
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  isPublished: boolean;
}
