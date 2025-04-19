import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from '@prisma/client'; // Import the Role enum from Prisma

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(Role), {
    message: 'Role must be either "ADMIN" or "EMPLOYEE"',
  })
  role: Role;

  @IsString()
  @IsOptional()
  department?: string;
}
