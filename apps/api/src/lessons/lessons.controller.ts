import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('lessons')
@UseGuards(JwtAuthGuard)
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Get('modules')
  getModules() {
    return this.lessonsService.getModules();
  }

  @Get('module/:module')
  getLessonsByModule(@Param('module') module: string) {
    return this.lessonsService.getLessonsByModule(module);
  }

  @Get(':id')
  getLesson(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.lessonsService.getLesson(id, userId);
  }

  @Post(':lessonId/exercises/:exerciseId/attempt')
  completeExercise(
    @CurrentUser('id') userId: string,
    @Param('exerciseId') exerciseId: string,
    @Body() body: { answer: string },
  ) {
    return this.lessonsService.completeExercise(userId, exerciseId, body.answer);
  }

  @Post(':lessonId/complete')
  completeLesson(
    @CurrentUser('id') userId: string,
    @Param('lessonId') lessonId: string,
  ) {
    return this.lessonsService.completeLesson(userId, lessonId);
  }
}
