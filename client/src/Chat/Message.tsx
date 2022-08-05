import React, { useContext, useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import fake from '../mockMessage';
import { MessageItem } from './MessageItem';
import axios from 'axios';
import { useAppSelector } from '../redux/hooks';
import { PeerSocketContext } from '../context/PeerSocket';

interface Message {
    id: number;
    content: string;
    send_time: string;
    author: number;
}

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

const Message = (props: { userMap: UserMap }) => {
    const { userMap } = props;
    const { socket } = useContext(PeerSocketContext);
    const activeChannel = useAppSelector(
        (state) => state.userReducer.activeChannel
    );

    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (activeChannel) {
            axios
                .get(`/channel/message/${activeChannel}`, {
                    headers: {
                        access_token: localStorage.getItem('token') as string,
                    },
                })
                .then((res) => {
                    setMessages(res.data);
                    console.log(res.data, 'data');
                });
        }
    }, [activeChannel]);

    useEffect(() => {
        socket?.on(`message:${activeChannel}`, receiveMessage);

        return () => {
            socket?.off(`message:${activeChannel}`, receiveMessage);
        };
    }, [socket, activeChannel]);

    const receiveMessage = (message: Message) => {
        setMessages((prev) => [...prev, message]);
        console.log(message, 'message');
    };

    return (
        <div className='message'>
            {messages?.map((obj: Message, i: number) => (
                <MessageItem obj={obj} key={i} userMap={userMap} />
            ))}
        </div>
    );
};

export default Message;
