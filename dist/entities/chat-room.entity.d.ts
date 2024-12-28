import { User } from './user.entity';
import { Chat } from './chat.entity';
export declare class ChatRoom {
    id: number;
    title: string;
    lastResult: string;
    user: User;
    chats: Chat[];
    createdAt: Date;
}
