import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Get('dashboard')
  getDashboard(@CurrentUser('id') userId: string) {
    return this.progressService.getDashboard(userId);
  }

  @Post('xp')
  logXp(
    @CurrentUser('id') userId: string,
    @Body() body: { amount: number; source: string },
  ) {
    return this.progressService.logXp(userId, body.amount, body.source);
  }
}
