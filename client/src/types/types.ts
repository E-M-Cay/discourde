export interface ServerUser {
    id: number;
    nickname: string;
    user: User;
}

export interface User {
    id: number;
    status: number;
    username: string;
}

export interface TextMessage {
    id: number;
    content: string;
    send_time: string;
    author: number;
}

export type UserMap = Omit<Map<number, ServerUser>, 'delete' | 'set' | 'clear'>;
