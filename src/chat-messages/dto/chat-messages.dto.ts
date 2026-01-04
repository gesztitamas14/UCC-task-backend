export class CreateChatMessageDto {
  chat_id: number;
  sender_role: 'USER' | 'HELP_DESK';
  message: string;
}
