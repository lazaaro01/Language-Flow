import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Progress')
@Controller('progress')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Obter painel de progresso' })
  @ApiResponse({ status: 200, description: 'Dados do dashboard' })
  getDashboard(@CurrentUser('id') userId: string) {
    return this.progressService.getDashboard(userId);
  }

  @Post('xp')
  @ApiOperation({ summary: 'Registrar ganho de XP' })
  @ApiResponse({ status: 201, description: 'XP registrado com sucesso' })
  logXp(
    @CurrentUser('id') userId: string,
    @Body() body: { amount: number; source: string },
  ) {
    return this.progressService.logXp(userId, body.amount, body.source);
  }
}
