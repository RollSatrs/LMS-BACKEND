// src/auth/dto/register.dto.ts
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator'
import { ROLES } from 'shared/constants/roles'
import type { Role } from 'shared/type/type.role'



export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  fullname: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  password: string

  @IsEnum(ROLES)
  role: Role
}
