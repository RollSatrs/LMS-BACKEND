import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AiModule } from './ai/ai.module';
import { CategoryModule } from './category/category.module';
import { CourseModule } from './course/course.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { FavoriteModule } from './favorite/favorite.module';
import { ReviewModule } from './review/review.module';
import { LessonModule } from './lesson/lesson.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ContentModule } from './content/content.module';

@Module({
  imports: [AuthModule, AiModule, CategoryModule, CourseModule, EnrollmentModule, FavoriteModule, ReviewModule, LessonModule, AnalyticsModule, ContentModule, ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
