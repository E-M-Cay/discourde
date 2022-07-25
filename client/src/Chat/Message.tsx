import React, { useEffect } from 'react';
import 'antd/dist/antd.css';
import fake from '../mockMessage';
import { MessageItem } from './MessageItem';
import axios from 'axios';
import { useAppSelector } from '../redux/hooks';
const Message = () => {
    const activeChannel = useAppSelector(
        (state) => state.userReducer.activeChannel
    );

    useEffect(() => {
        if (activeChannel) {
            axios
                .get(`/channel/message/${activeChannel}`, {
                    headers: {
                        access_token: localStorage.getItem('token') as string,
                    },
                })
                .then((res) => console.log(res.data, 'messages'));
        }
    }, [activeChannel]);
    return (
        <div className='message'>
            {fake.map((fake: any, i: any) => (
                <MessageItem obj={fake} key={i} />
            ))}
        </div>
    );
};

export default Message;
