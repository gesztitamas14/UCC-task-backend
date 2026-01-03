import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatMessageDto } from './dto/chat.dto';
import { ChatMessage } from './entities/chat.entity';
import { HelpdeskChatService } from 'src/helpdesk-chat/helpdesk-chat.service';


@Controller('api/chat')
export class ChatController {
  constructor(private chatService: ChatService, private readonly helpdeskChatService: HelpdeskChatService,) {}

  @Post()
  async create(@Body() dto: CreateChatMessageDto): Promise<ChatMessage> {
    const msg = await this.chatService.create(dto);

    const chat = await this.helpdeskChatService.findById(dto.chat_id);

    await this.helpdeskChatService.handleUserMessage(chat, dto);

    return msg;
  }

  @Get()
  async getSince(@Param('since') since: string): Promise<ChatMessage[]> {
    return this.chatService.findSince(since);
  }

  @Get(':chatId')
  async getByChatId(@Param('chatId') chatId: string): Promise<ChatMessage[]> {
    return this.chatService.findByChatId(+chatId);
  }
}
