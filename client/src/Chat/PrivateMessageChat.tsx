import axios from 'axios';
import { useCallback, useContext, useEffect, useState } from 'react';
import { NotificationsContext } from '../context/NotificationsContext';
import { PeerSocketContext } from '../context/PeerSocket';
import { UserMapsContext } from '../context/UserMapsContext';
import { useAppSelector } from '../redux/hooks';
import { PrivateChatMap, PrivateMessage, TextMessage } from '../types/types';
import { MessageItem } from './MessageItem';

const PrivateMessageChat = () => {
  const activePrivateChat = useAppSelector(
    (state) => state.userReducer.activePrivateChat
  );
  const me = useAppSelector((state) => state.userReducer.me);
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [name, setName] = useState<string>('user name');
  const { socket } = useContext(PeerSocketContext);
  const { privateChatMap } = useContext(UserMapsContext);
  const { notifications, addNotification } = useContext(NotificationsContext);

  useEffect(() => {
    if (activePrivateChat) {
      axios
        .get(`/privatemessage/messages/${activePrivateChat}`, {
          headers: {
            access_token: localStorage.getItem('token') as string,
          },
        })
        .then((res) => {
          //console.log(res.data);
          setMessages(res.data.messages);
          setName(res.data.username);
        });
    }
  }, [activePrivateChat]);

  const receiveMessage = useCallback(
    (message: PrivateMessage) => {
      if (message.user1.id === activePrivateChat || message.user1.id === me?.id)
        setMessages((prev) => [...prev, message]);
      console.log(message, 'message');
    },
    [activePrivateChat, me]
  );

  useEffect(() => {
    socket?.on(`privatemessage`, receiveMessage);

    return () => {
      socket?.off(`privatemessage`, receiveMessage);
    };
  }, [socket, receiveMessage]);

  return (
    <div className='message'>
      <div>{name}</div>
      {messages?.map((obj: PrivateMessage, i: number) => {
        const user =
          obj.user1.id === me?.id ? me : privateChatMap.get(obj.user1.id);
        // console.log(privateChatMap, 'user', obj.user1.id);
        return (
          user && (
            <MessageItem
              id={user?.id as number}
              key={i}
              username={user?.username as string}
              picture={user?.picture as string}
              content={obj.content}
              send_time={obj.send_time}
            />
          )
        );
      })}
    </div>
  );
};

export default PrivateMessageChat;
