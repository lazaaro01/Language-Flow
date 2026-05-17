import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('profile')
  updateProfile(
    @CurrentUser('id') userId: string,
    @Body() data: { name?: string; avatarUrl?: string; dailyGoalMinutes?: number },
  ) {
    return this.usersService.updateProfile(userId, data);
  }

  @Get('stats')
  getStats(@CurrentUser('id') userId: string) {
    return this.usersService.getStats(userId);
  }
}
