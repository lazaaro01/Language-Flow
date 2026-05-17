import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './common/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProgressModule } from './progress/progress.module';
import { LessonsModule } from './lessons/lessons.module';
import { FlashcardsModule } from './flashcards/flashcards.module';
import { ChatModule } from './chat/chat.module';
import { AchievementsModule } from './achievements/achievements.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProgressModule,
    LessonsModule,
    FlashcardsModule,
    ChatModule,
    AchievementsModule,
  ],
})
export class AppModule {}
