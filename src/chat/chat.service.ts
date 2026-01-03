import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { ChatMessage } from './entities/chat.entity';
import { CreateChatMessageDto } from './dto/chat.dto';


@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
  ) {}

  async create(dto: CreateChatMessageDto): Promise<ChatMessage> {
    const msg = this.chatMessageRepository.create(dto);
    return this.chatMessageRepository.save(msg);
  }

  async findSince(since: string): Promise<ChatMessage[]> {
    return this.chatMessageRepository.find({
      where: { created_at: MoreThan(new Date(since)) },
      order: { created_at: 'ASC' },
    });
  }

  async findByChatId(chatId: number): Promise<ChatMessage[]> {
    return this.chatMessageRepository.find({
      where: { chat_id: chatId },
      order: { created_at: 'ASC' },
    });
  }

  async createSystemMessage(
    chatId: number,
    message: string,
  ): Promise<ChatMessage> {
    const msg = this.chatMessageRepository.create({
      chat_id: chatId,
      sender_role: 'HELP_DESK',
      message,
    });

    return this.chatMessageRepository.save(msg);
  }
}
