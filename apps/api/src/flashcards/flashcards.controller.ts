import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { FlashcardsService } from './flashcards.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Flashcards')
@Controller('flashcards')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FlashcardsController {
  constructor(private flashcardsService: FlashcardsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os flashcards do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de flashcards' })
  getAll(@CurrentUser('id') userId: string) {
    return this.flashcardsService.getAll(userId);
  }

  @Get('due')
  @ApiOperation({ summary: 'Obter flashcards pendentes de revisão' })
  @ApiResponse({ status: 200, description: 'Flashcards para revisar' })
  getDue(@CurrentUser('id') userId: string) {
    return this.flashcardsService.getDue(userId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obter estatísticas dos flashcards' })
  @ApiResponse({ status: 200, description: 'Estatísticas' })
  getStats(@CurrentUser('id') userId: string) {
    return this.flashcardsService.getStats(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar novo flashcard' })
  @ApiResponse({ status: 201, description: 'Flashcard criado' })
  create(
    @CurrentUser('id') userId: string,
    @Body() data: { word: string; definition: string; exampleSentence: string },
  ) {
    return this.flashcardsService.create(userId, data);
  }

  @Post(':id/review')
  @ApiOperation({ summary: 'Revisar um flashcard (SM-2)' })
  @ApiParam({ name: 'id', description: 'ID do flashcard' })
  @ApiResponse({ status: 200, description: 'Resultado da revisão' })
  review(@Param('id') id: string, @Body() body: { quality: number }) {
    return this.flashcardsService.review(id, body.quality);
  }
}
