import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEnrollmentDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the user being enrolled',
    required: true,
    type: Number,
  })
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of course IDs to enroll the user in',
    required: true,
    type: [Number],
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  courseIds: number[];
}
