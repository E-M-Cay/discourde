import { useContext, useEffect, useState } from 'react';
import 'antd/dist/antd.min.css';

import { MessageItem } from './MessageItem';
import axios from 'axios';
import { useAppSelector } from '../redux/hooks';
import { PeerSocketContext } from '../context/PeerSocket';
import { UserMap, TextMessage } from '../types/types';

const Message = (props: { userMap: UserMap }) => {
    const { userMap } = props;
    const { socket } = useContext(PeerSocketContext);
    const activeChannel = useAppSelector(
        (state) => state.userReducer.activeChannel
    );

    const [messages, setMessages] = useState<TextMessage[]>([]);

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
                    //console.log(res.data, 'data');
                });
        }
    }, [activeChannel]);

    useEffect(() => {
        socket?.on(`message:${activeChannel}`, receiveMessage);

        return () => {
            socket?.off(`message:${activeChannel}`, receiveMessage);
        };
    }, [socket, activeChannel]);

    const receiveMessage = (message: TextMessage) => {
        setMessages((prev) => [...prev, message]);
        console.log(message, 'message');
    };

    return (
        <div className='message'>
            {messages?.map((obj: TextMessage, i: number) => (
                <MessageItem obj={obj} key={i} userMap={userMap} />
            ))}
        </div>
    );
};

export default Message;
