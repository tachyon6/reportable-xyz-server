import { ChatRoom } from './chat-room.entity';
export declare class Chat {
    id: number;
    userInput: string;
    response: string;
    result: string;
    isReverted: boolean;
    chatRoom: ChatRoom;
    createdAt: Date;
}
