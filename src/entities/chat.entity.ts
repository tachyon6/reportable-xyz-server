import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { ChatRoom } from './chat-room.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  userInput: string;

  @Column({ type: 'text' })
  response: string;

  @Column({ type: 'text' })
  result: string;

  @Column({ default: false })
  isReverted: boolean;

  @ManyToOne(() => ChatRoom, chatRoom => chatRoom.chats)
  chatRoom: ChatRoom;

  @CreateDateColumn()
  createdAt: Date;
}