import { useContext, useEffect, useRef, useState } from 'react';
import 'antd/dist/antd.min.css';

import { MessageItem } from './MessageItem';
import axios from 'axios';
import { useAppSelector } from '../redux/hooks';
import { PeerSocketContext } from '../context/PeerSocket';
import { ServerUserMap, TextMessage } from '../types/types';
import { UserMapsContext } from '../context/UserMapsContext';

const Message = () => {
  const { socket } = useContext(PeerSocketContext);
  const activeChannel = useAppSelector(
    (state) => state.userReducer.activeChannel
  );
  const { serverUserMap } = useContext(UserMapsContext);

  const [messages, setMessages] = useState<TextMessage[]>([]);
  const [name, setName] = useState<string>('Chan name');

  const bottomRef = useRef<any>(null);

  useEffect(() => {
    if (activeChannel) {
      axios
        .get(`/channel/message/${activeChannel}`, {
          headers: {
            access_token: localStorage.getItem('token') as string,
          },
        })
        .then((res) => {
          console.log(res.data, 'channels');
          setMessages(res.data.response);
          setName(res.data.channelName);
        });
    }
  }, [activeChannel]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket.on(`message:${activeChannel}`, receiveMessage);
    return () => {
      socket.off(`message:${activeChannel}`, receiveMessage);
    };
  }, [socket, activeChannel]);

  const receiveMessage = (message: TextMessage) => {
    setMessages((prev) => [...prev, message]);
    console.log(message, 'message');
  };

  return (
    <div style={{ maxHeight: '100%' }} className='message'>
      <div>{name}</div>
      {messages?.map((obj: TextMessage, i: number) => {
        const user = serverUserMap.get(obj.author);
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
      <span style={{ height: 0 }} ref={bottomRef} />
    </div>
  );
};

export default Message;
