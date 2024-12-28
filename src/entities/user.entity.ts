import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { ChatRoom } from './chat-room.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  profileImage: string;

  @OneToMany(() => ChatRoom, chatRoom => chatRoom.user)
  chatRooms: ChatRoom[];

  @CreateDateColumn()
  createdAt: Date;
}