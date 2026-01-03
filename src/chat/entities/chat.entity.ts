import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type SenderRole = 'USER' | 'HELP_DESK';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chat_id: number;

  @Column({ type: 'varchar' })
  sender_role: SenderRole;

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
