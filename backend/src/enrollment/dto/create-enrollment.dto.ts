import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class CreateEnrollmentDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  courseIds: number[];
}
