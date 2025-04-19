import { IsBoolean, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '@prisma/client'; // Import the Role enum from Prisma
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'John',
    description: 'User first name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'SecurePassword123!',
    description: 'User password (min 8 characters)',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    enum: Object.values(Role),
    example: Role.STUDENT,
    description: 'User role',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(Role), {
    message: `Role must be one of: ${Object.values(Role).join(', ')}`,
  })
  role: Role;

  @ApiProperty({
    example: true,
    description: 'Whether the user is active',
    required: false,
    default: true,
  })
  @IsBoolean()
  isActive?: boolean;
}
