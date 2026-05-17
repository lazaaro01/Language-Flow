import { Controller, Get, UseGuards } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('achievements')
@UseGuards(JwtAuthGuard)
export class AchievementsController {
  constructor(private achievementsService: AchievementsService) {}

  @Get()
  getAll(@CurrentUser('id') userId: string) {
    return this.achievementsService.getAll(userId);
  }

  @Get('ranking')
  getRanking(@CurrentUser('id') userId: string) {
    return this.achievementsService.getRanking(userId);
  }

  @Get('ranking/weekly')
  getWeeklyRanking(@CurrentUser('id') userId: string) {
    return this.achievementsService.getWeeklyRanking(userId);
  }
}
