import { Controller, Get, UseGuards } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Achievements')
@Controller('achievements')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AchievementsController {
  constructor(private achievementsService: AchievementsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar conquistas do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de conquistas' })
  getAll(@CurrentUser('id') userId: string) {
    return this.achievementsService.getAll(userId);
  }

  @Get('ranking')
  @ApiOperation({ summary: 'Obter ranking global' })
  @ApiResponse({ status: 200, description: 'Ranking global' })
  getRanking(@CurrentUser('id') userId: string) {
    return this.achievementsService.getRanking(userId);
  }

  @Get('ranking/weekly')
  @ApiOperation({ summary: 'Obter ranking semanal' })
  @ApiResponse({ status: 200, description: 'Ranking semanal' })
  getWeeklyRanking(@CurrentUser('id') userId: string) {
    return this.achievementsService.getWeeklyRanking(userId);
  }
}
