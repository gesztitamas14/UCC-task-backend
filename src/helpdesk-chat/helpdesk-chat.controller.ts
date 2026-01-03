import { Controller, Get, Patch, Param, Post, Body } from '@nestjs/common';
import { HelpdeskChatService } from './helpdesk-chat.service';
import { Chat, ChatStatus } from './entities/helpdesk-chat.entity';

@Controller('api/helpdesk/chats')
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
