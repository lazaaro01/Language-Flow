import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Lessons')
@Controller('lessons')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Get('modules')
  @ApiOperation({ summary: 'Listar todos os módulos de aprendizado' })
  @ApiResponse({ status: 200, description: 'Lista de módulos' })
  getModules() {
    return this.lessonsService.getModules();
  }

  @Get('module/:module')
  @ApiOperation({ summary: 'Obter lições de um módulo específico' })
  @ApiParam({ name: 'module', description: 'Identificador do módulo' })
  @ApiResponse({ status: 200, description: 'Lições do módulo' })
  getLessonsByModule(@Param('module') module: string) {
    return this.lessonsService.getLessonsByModule(module);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de uma lição' })
  @ApiParam({ name: 'id', description: 'ID da lição' })
  @ApiResponse({ status: 200, description: 'Detalhes da lição' })
  getLesson(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.lessonsService.getLesson(id, userId);
  }

  @Post(':lessonId/exercises/:exerciseId/attempt')
  @ApiOperation({ summary: 'Enviar resposta de um exercício' })
  @ApiParam({ name: 'lessonId', description: 'ID da lição' })
  @ApiParam({ name: 'exerciseId', description: 'ID do exercício' })
  @ApiResponse({ status: 200, description: 'Resultado do exercício' })
  completeExercise(
    @CurrentUser('id') userId: string,
    @Param('exerciseId') exerciseId: string,
    @Body() body: { answer: string },
  ) {
    return this.lessonsService.completeExercise(userId, exerciseId, body.answer);
  }

  @Post(':lessonId/complete')
  @ApiOperation({ summary: 'Marcar lição como concluída' })
  @ApiParam({ name: 'lessonId', description: 'ID da lição' })
  @ApiResponse({ status: 200, description: 'Lição concluída' })
  completeLesson(
    @CurrentUser('id') userId: string,
    @Param('lessonId') lessonId: string,
  ) {
    return this.lessonsService.completeLesson(userId, lessonId);
  }
}
