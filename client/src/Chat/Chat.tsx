import React, { useEffect } from 'react';
import 'antd/dist/antd.css';
import Message from './Message';
import ChatBar from './ChatBar';

interface ServerUser {
    id: number;
    nickname: string;
    user: User;
}

interface User {
    id: number;
    status: number;
    username: string;
}

type UserMap = Omit<Map<number, ServerUser>, 'delete' | 'set' | 'clear'>;

const Chat = (props: { userMap: UserMap }) => {
    const { userMap } = props;
    return (
        <div className='chat'>
            <div className='message'>
                <Message userMap={userMap} />
            </div>
            <div className='chatbar'>
                <ChatBar />
            </div>
        </div>
    );
};

export default Chat;
