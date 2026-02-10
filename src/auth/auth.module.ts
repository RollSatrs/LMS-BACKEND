import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt.guard';
import { RolesGuard } from './roles.guard';

@Module({
  imports:[
    JwtModule.register({
      secret: process.env.SECRET_KEY || "SECRET_KEY",
      signOptions:{
        expiresIn: 7 * 24 * 60 * 60,
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, RolesGuard],
  exports:[JwtModule, JwtAuthGuard, RolesGuard]
})
export class AuthModule {}
