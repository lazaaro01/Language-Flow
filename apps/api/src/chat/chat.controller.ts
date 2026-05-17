import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('conversations')
  getConversations(@CurrentUser('id') userId: string) {
    return this.chatService.getConversations(userId);
  }

  @Get('scenarios')
  getScenarios() {
    return this.chatService.getScenarios();
  }

  @Get('conversations/:id')
  getConversation(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.chatService.getConversation(id, userId);
  }

  @Post('conversations')
  createConversation(
    @CurrentUser('id') userId: string,
    @Body() data: { title: string; scenario?: string },
  ) {
    return this.chatService.createConversation(userId, data);
  }

  @Post('conversations/:id/messages')
  addMessage(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() data: { role: string; content: string },
  ) {
    return this.chatService.addMessage(id, userId, data);
  }
}
