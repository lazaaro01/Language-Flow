import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Listar conversas do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de conversas' })
  getConversations(@CurrentUser('id') userId: string) {
    return this.chatService.getConversations(userId);
  }

  @Get('scenarios')
  @ApiOperation({ summary: 'Listar cenários de conversação disponíveis' })
  @ApiResponse({ status: 200, description: 'Lista de cenários' })
  getScenarios() {
    return this.chatService.getScenarios();
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Obter detalhes de uma conversa' })
  @ApiParam({ name: 'id', description: 'ID da conversa' })
  @ApiResponse({ status: 200, description: 'Detalhes da conversa' })
  getConversation(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.chatService.getConversation(id, userId);
  }

  @Post('conversations')
  @ApiOperation({ summary: 'Criar nova conversa' })
  @ApiResponse({ status: 201, description: 'Conversa criada' })
  createConversation(
    @CurrentUser('id') userId: string,
    @Body() data: { title: string; scenario?: string },
  ) {
    return this.chatService.createConversation(userId, data);
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Enviar mensagem em uma conversa' })
  @ApiParam({ name: 'id', description: 'ID da conversa' })
  @ApiResponse({ status: 201, description: 'Mensagem enviada' })
  addMessage(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() data: { role: string; content: string },
  ) {
    return this.chatService.addMessage(id, userId, data);
  }
}
