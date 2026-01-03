import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { HelpdeskChatModule } from './helpdesk-chat/helpdesk-chat.module';
import { KnowledgeBaseModule } from './knowledge-base/knowledge-base.module';
import { BotMatchingService } from './bot-matching/bot-matching.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT')!, 10),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    AuthModule,
    EventsModule,
    UsersModule,
    ChatModule,
    HelpdeskChatModule,
    KnowledgeBaseModule,
  ],
  providers: [BotMatchingService],
})
export class AppModule {}
