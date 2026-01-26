import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { db } from 'src';
import { usersTable } from 'src/db/schema';
import { eq } from 'drizzle-orm';
import { hashFunction, unHashFunction } from 'shared/tools/tools';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) { }
  async register(dto: RegisterDto) {
    const user = await db.select()
      .from(usersTable)
      .where(eq(usersTable.email, dto.email))
      .limit(1)
    console.log(user)
    if (user.length) throw new ConflictException('Пользователь с таким email уже существует');
    const hashPassowrd = await hashFunction(dto.password)
    const newUser = await db
      .insert(usersTable)
      .values({
        fullname: dto.fullname,
        email: dto.email,
        passwordHash: hashPassowrd,
        role: dto.role,
      })
      .returning()
    return { message: 'Регистрация прошла успешно', user: newUser };
  }

  async login(dto: LoginDto) {
    const user = await db.select()
      .from(usersTable)
      .where(eq(usersTable.email, dto.email))
      .limit(1)

    if (!user.length) throw new UnauthorizedException('Неверный email или пароль');

    const isPasswordValid = await unHashFunction(
      dto.password,
      user[0].passwordHash,
    );
    if (!isPasswordValid) throw new UnauthorizedException('Неверный email или пароль');

    const payload = {
      id: user[0].id,
      email: user[0].email,
      role: user[0].role
    }

    const token = this.jwtService.sign(payload)

    return {
      message: 'Успешный вход',
      user: {
        id: user[0].id,
        fullname: user[0].fullname,
        email: user[0].email,
        role: user[0].role,
      },
      token
    }
  }
}
