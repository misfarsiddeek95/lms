import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    example: 'Advanced NestJS Development',
    description: 'Course name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Master NestJS with advanced techniques',
    description: 'Course description',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: '8 weeks',
    description: 'Course duration',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  duration: string;

  @ApiProperty({
    example: 199.99,
    description: 'Course price (max 2 decimal places)',
    required: true,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  price: number;

  @ApiProperty({
    example: 'USD',
    description: 'Currency code',
    required: true,
    minLength: 2,
    maxLength: 3,
  })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({
    example: true,
    description: 'Whether the course is published',
    required: false,
    default: false,
  })
  @IsBoolean()
  isPublished: boolean;
}
