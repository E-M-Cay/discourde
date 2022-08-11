export interface ServerUser {
    id: number;
    nickname: string;
    user: User;
}

export interface User {
    id: number;
    status: number;
    username: string;
    picture?: string;
}

export interface TextMessage {
    id: number;
    content: string;
    send_time: string;
    author: number;
}

export interface ServerResponse {
    id: number;
    nickname: string;
    server: Server;
}

export interface Server {
    id: number;
    logo: string;
    main_img?: string;
    name: string;
}

export type UserMap = Omit<Map<number, ServerUser>, 'delete' | 'set' | 'clear'>;
