import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() params: RegisterDto) {
    return await this.authService.register(params)
  }

  @Post("login")
  async login(@Body()
    params:LoginDto,
    @Res({passthrough: true})
    res: Response
  ){
    const {token, user, message} = await this.authService.login(params)
    res.cookie("access_token", token,{
      httpOnly: true,      // ❗ JS не может прочитать
      secure: false,       // true если https
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    return{
      message,
      user
    }
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@Req() req:Request){
    return req.user
  }
}
