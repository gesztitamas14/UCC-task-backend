import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  occurrence_datetime: Date;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @ManyToOne(() => User, user => user.events)
  user: User;

  @CreateDateColumn()
  created_at: Date;
}
