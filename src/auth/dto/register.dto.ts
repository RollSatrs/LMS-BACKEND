// src/auth/dto/register.dto.ts
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
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
  @MinLength(8, { message: 'Пароль должен быть не менее 8 символов' })
  password: string

  @IsOptional()
  @IsEnum(ROLES)
  role?: Role
}
