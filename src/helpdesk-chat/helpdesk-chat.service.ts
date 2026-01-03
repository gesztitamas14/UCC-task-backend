import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessage } from 'src/chat/entities/chat.entity';
import { In, Repository } from 'typeorm';
import { Chat, ChatStatus } from './entities/helpdesk-chat.entity';
import { User } from 'src/users/user.entity';
import { CreateChatMessageDto } from 'src/chat/dto/chat.dto';
import { KnowledgeBaseEntry } from 'src/knowledge-base/entities/knowledge-base.entity';
import { ChatService } from 'src/chat/chat.service';
import { BotMatchingService } from 'src/bot-matching/bot-matching.service';


@Injectable()
export class HelpdeskChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,

    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(KnowledgeBaseEntry)
    private kbRepo: Repository<KnowledgeBaseEntry>,

    private readonly chatService: ChatService,
    private readonly botMatchingService: BotMatchingService,
  ) { }

  async getAllChats(): Promise<any[]> {
    const chats = await this.chatRepository.find({
      where: { status: In([ChatStatus.CLOSED, ChatStatus.HUMAN]) },
      order: { updated_at: 'DESC' }
    });

    const result = await Promise.all(chats.map(async chat => {
      const lastMessage = await this.chatMessageRepository.findOne({
        where: { chat_id: chat.id },
        order: { created_at: 'DESC' },
      });

      const user = await this.userRepository.findOne({ where: { id: chat.user_id } });

      return {
        id: chat.id,
        userId: chat.user_id,
        email: user?.email || 'Unknown',
        status: chat.status,
        lastMessage: lastMessage?.message || '',
        lastMessageAt: lastMessage?.created_at || chat.created_at
      };
    }));

    return result;
  }

  async findById(chatId: number): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
    });

    if (!chat) {
      throw new Error('Chat not found');
    }

    return chat;
  }

  async updateStatus(chatId: number, status: ChatStatus): Promise<Chat> {
    const chat = await this.chatRepository.findOne({ where: { id: chatId } });
    if (!chat) throw new Error('Chat not found');

    chat.status = status;
    return this.chatRepository.save(chat);
  }

  async getOrCreateChatForUser(userId: number): Promise<Chat> {
    let chat = await this.chatRepository.findOne({
      where: {
        user_id: userId,
        status: In([ChatStatus.OPEN, ChatStatus.HUMAN]),
      },
    });

    if (chat) {
      return chat;
    }

    chat = this.chatRepository.create({
      user_id: userId,
      status: ChatStatus.OPEN,
    });

    chat = await this.chatRepository.save(chat);

    this.chatMessageRepository.save({
      chat_id: chat.id,
      sender_role: 'HELP_DESK',
      message: `
      Hi! You are talking with the UCC_TASK's bot operator<br>
      How can I help you?<br>
      <br>
      If you wish to talk to a human operator, type: <b>human operator</b>.
    `,
    });

    return chat;
  }

  async handleUserMessage(
    chat: Chat,
    dto: CreateChatMessageDto,
  ) {
    if (chat.status !== ChatStatus.OPEN) return;

    if (dto.sender_role !== 'USER') return;

    const entries = await this.kbRepo.find({
      where: { active: true },
    });

    const normalized = dto.message.toLowerCase().trim();

    if (['human operator'].includes(normalized)) {
      chat.status = ChatStatus.HUMAN;
      await this.chatRepository.save(chat);

      await this.chatService.createSystemMessage(
        chat.id,
        'Okay. Redirecting to a human operator',
      );
      return;
    }

    const match = this.botMatchingService.match(dto.message, entries);

    if (match) {
      await this.chatService.createSystemMessage(
        chat.id,
        match.answer,
      );
    } else {
      await this.chatService.createSystemMessage(
        chat.id,
        'I am not sure I understand <br>Type: <b>human operator</b>, if you want to talk to a human.',
      );
    }
  }

}
