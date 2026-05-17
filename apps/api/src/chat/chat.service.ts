import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: { userId },
      include: { _count: { select: { messages: true } } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getConversation(id: string, userId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id, userId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');
    return conversation;
  }

  async createConversation(userId: string, data: { title: string; scenario?: string }) {
    return this.prisma.conversation.create({
      data: { userId, title: data.title, scenario: data.scenario },
    });
  }

  async addMessage(
    conversationId: string,
    userId: string,
    data: { role: string; content: string },
  ) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, userId },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');

    const message = await this.prisma.conversationMessage.create({
      data: {
        conversationId,
        role: data.role,
        content: data.content,
      },
    });

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async getScenarios() {
    return [
      { id: 'interview', label: 'Job Interview', icon: 'briefcase' },
      { id: 'restaurant', label: 'At a Restaurant', icon: 'utensils' },
      { id: 'travel', label: 'International Travel', icon: 'plane' },
      { id: 'casual', label: 'Casual Conversation', icon: 'smile' },
      { id: 'business', label: 'Business Meeting', icon: 'building' },
      { id: 'technical', label: 'Tech Talk', icon: 'code' },
    ];
  }
}
