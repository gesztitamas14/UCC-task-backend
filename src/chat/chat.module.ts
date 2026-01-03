import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './entities/chat.entity';
import { HelpdeskChatModule } from 'src/helpdesk-chat/helpdesk-chat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMessage,]),
    HelpdeskChatModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
