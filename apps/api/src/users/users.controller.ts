import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Obter perfil do usuário' })
  @ApiResponse({ status: 200, description: 'Perfil do usuário' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Atualizar perfil do usuário' })
  @ApiResponse({ status: 200, description: 'Perfil atualizado com sucesso' })
  updateProfile(
    @CurrentUser('id') userId: string,
    @Body() data: { name?: string; avatarUrl?: string; dailyGoalMinutes?: number },
  ) {
    return this.usersService.updateProfile(userId, data);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obter estatísticas do usuário' })
  @ApiResponse({ status: 200, description: 'Estatísticas do usuário' })
  getStats(@CurrentUser('id') userId: string) {
    return this.usersService.getStats(userId);
  }
}
