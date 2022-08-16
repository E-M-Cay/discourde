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

export interface ReceivedFriendRequest {
    id: number;
    sender: User;
}

export interface SentFriendRequest {
    id: number;
    received: User;
}

export interface Friendship {
    id: number;
    friend: User;
}

export interface TextMessage {
    id: number;
    content: string;
    send_time: string;
    author: number;
}

export interface PrivateMessage {
    receiver: number;
    content: string;
    user1: {
        id: number;
    };
    send_time: string;
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

export interface Channel {
    hidden: boolean;
    id: number;
    name: string;
}

export interface VocalChan extends Channel {
    users: number[];
}

export type ServerUserMap = Omit<
    Map<number, ServerUser>,
    'delete' | 'set' | 'clear'
>;

export type PrivateChatMap = Omit<
    Map<number, User>,
    'delete' | 'set' | 'clear'
>;

export type ReceivedFriendRequestMap = Omit<
    Map<number, ReceivedFriendRequest>,
    'delete' | 'set' | 'clear'
>;

export type SentFriendRequestMap = Omit<
    Map<number, SentFriendRequest>,
    'delete' | 'set' | 'clear'
>;

export type FriendshipMap = Omit<
    Map<number, Friendship>,
    'delete' | 'set' | 'clear'
>;
