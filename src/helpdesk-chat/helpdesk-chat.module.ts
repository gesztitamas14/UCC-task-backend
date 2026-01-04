import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelpdeskChatService } from './helpdesk-chat.service';
import { HelpdeskChatController } from './helpdesk-chat.controller';
import { Chat } from './entities/helpdesk-chat.entity';
import { User } from 'src/users/user.entity';
import { KnowledgeBaseEntry } from 'src/knowledge-base/entities/knowledge-base.entity';
import { BotMatchingService } from 'src/bot-matching/bot-matching.service';

import { ChatMessage } from 'src/chat-messages/entities/chat-messages.entity';
import { ChatService } from 'src/chat-messages/chat-messages.service';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, ChatMessage, User, KnowledgeBaseEntry])],
  providers: [HelpdeskChatService, ChatService, BotMatchingService],
  controllers: [HelpdeskChatController],
  exports: [HelpdeskChatService],
})
export class HelpdeskChatModule {}
