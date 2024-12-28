import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Chat } from './chat.entity';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  lastResult: string;

  @ManyToOne(() => User, user => user.chatRooms)
  user: User;

  @OneToMany(() => Chat, chat => chat.chatRoom)
  chats: Chat[];

  @CreateDateColumn()
  createdAt: Date;
}