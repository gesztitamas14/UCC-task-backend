import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ChatStatus {
  OPEN = 'OPEN',
  HUMAN = 'HUMAN',
  CLOSED = 'CLOSED',
}

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({
    type: 'enum',
    enum: ['OPEN', 'HUMAN', 'CLOSED'],
    default: 'OPEN'
  })
  status: ChatStatus;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
