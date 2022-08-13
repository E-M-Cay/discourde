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
    const [name, setName] = useState<string>('Chan name');

    useEffect(() => {
        if (activeChannel) {
            axios
                .get(`/channel/message/${activeChannel}`, {
                    headers: {
                        access_token: localStorage.getItem('token') as string,
                    },
                })
                .then((res) => {
                    setMessages(res.data.response);
                    setName(res.data.channelName);
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
            <div>{name}</div>
            {messages?.map((obj: TextMessage, i: number) => {
                const user = userMap.get(obj.author);
                return (
                    user && (
                        <MessageItem
                            id={user.user.id}
                            username={user.nickname}
                            picture={user.user.picture}
                            content={obj.content}
                            send_time={obj.send_time}
                            key={i}
                        />
                    )
                );
            })}
        </div>
    );
};

export default Message;
