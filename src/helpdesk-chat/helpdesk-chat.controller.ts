import { Controller, Get, Patch, Param, Post, Body, UseGuards } from '@nestjs/common';
import { HelpdeskChatService } from './helpdesk-chat.service';
import { Chat, ChatStatus } from './entities/helpdesk-chat.entity';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('api/helpdesk/chats')
@UseGuards(JwtAuthGuard)
export class HelpdeskChatController {
  constructor(private readonly helpdeskChatService: HelpdeskChatService) {}

  @Get()
  async getChats() {
    return this.helpdeskChatService.getAllChats();
  }
  
  @Patch(':id/open')
  async openChat(@Param('id') id: string) {
    return this.helpdeskChatService.updateStatus(+id, ChatStatus.HUMAN);
  }

  @Patch(':id/close')
  async closeChat(@Param('id') id: string) {
    return this.helpdeskChatService.updateStatus(+id, ChatStatus.CLOSED);
  }

  @Post('get-or-create')
  async getOrCreateChat(@Body() body: { user_id: number }): Promise<Chat> {
    return this.helpdeskChatService.getOrCreateChatForUser(body.user_id);
  }
}
