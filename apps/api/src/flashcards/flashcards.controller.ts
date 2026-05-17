import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { FlashcardsService } from './flashcards.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('flashcards')
@UseGuards(JwtAuthGuard)
export class FlashcardsController {
  constructor(private flashcardsService: FlashcardsService) {}

  @Get()
  getAll(@CurrentUser('id') userId: string) {
    return this.flashcardsService.getAll(userId);
  }

  @Get('due')
  getDue(@CurrentUser('id') userId: string) {
    return this.flashcardsService.getDue(userId);
  }

  @Get('stats')
  getStats(@CurrentUser('id') userId: string) {
    return this.flashcardsService.getStats(userId);
  }

  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body() data: { word: string; definition: string; exampleSentence: string },
  ) {
    return this.flashcardsService.create(userId, data);
  }

  @Post(':id/review')
  review(@Param('id') id: string, @Body() body: { quality: number }) {
    return this.flashcardsService.review(id, body.quality);
  }
}
