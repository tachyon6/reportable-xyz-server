import { ChatRoom } from './chat-room.entity';
export declare class User {
    id: number;
    email: string;
    name: string;
    profileImage: string;
    chatRooms: ChatRoom[];
    createdAt: Date;
}
