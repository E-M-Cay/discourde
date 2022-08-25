import { useContext, useEffect, useRef, useState } from 'react';
import 'antd/dist/antd.min.css';

import { MessageItem } from './MessageItem';
import axios from 'axios';
import { useAppSelector } from '../redux/hooks';
import { PeerSocketContext } from '../context/PeerSocket';
import { TextMessage } from '../types/types';
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
          //console.log(res.data, 'channels');
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
    //console.log(message, 'message');
  };

  const messageSanitizer = (message: TextMessage, lastmessageKey: number) => {
    if (
      message.send_time.split(':')[0] ===
        messages[lastmessageKey]?.send_time.split(':')[0] &&
      message.author === messages[lastmessageKey]?.author &&
      message.send_time.split(':')[1] ===
        messages[lastmessageKey]?.send_time.split(':')[1] &&
      (messages[lastmessageKey]?.author !==
        messages[lastmessageKey - 1]?.author ||
        messages[lastmessageKey - 1]?.send_time.split(':')[0] !==
          messages[lastmessageKey]?.send_time.split(':')[0] ||
        messages[lastmessageKey - 1]?.send_time.split(':')[1] !==
          messages[lastmessageKey]?.send_time.split(':')[1])
    ) {
      return 3;
    } else if (
      message.send_time.split(':')[0] ===
        messages[lastmessageKey]?.send_time.split(':')[0] &&
      message.author === messages[lastmessageKey]?.author &&
      message.send_time.split(':')[1] ===
        messages[lastmessageKey]?.send_time.split(':')[1]
    ) {
      return 2;
    } else {
      return 1;
    }
  };
  // //console.log(messages, 'message');

  function newDayCheck(message: TextMessage, lastmessageKey: number) {
    let testeur1 =
      message.send_time.split('T').length > 1
        ? message.send_time
        : message.send_time.split(' ')[0] +
          'T' +
          message.send_time.split(' ')[1];
    let testeur2 =
      messages[lastmessageKey]?.send_time.split('T').length > 1
        ? messages[lastmessageKey]?.send_time
        : messages[lastmessageKey]?.send_time.split(' ')[0] +
          'T' +
          messages[lastmessageKey]?.send_time.split(' ')[1];
    if (testeur1.split('T')[0] !== testeur2.split('T')[0]) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <div
      style={{
        height: 'calc(95vh - 44px) !important',
        display: 'table-cell',
        verticalAlign: 'bottom',
        overflowX: 'auto',
      }}
      className='message'
    >
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
              compress={messageSanitizer(obj, i - 1)}
              isLast={i === messages.length - 1}
              isNewDay={newDayCheck(obj, i - 1)}
              fromNormalChat={true}
            />
          )
        );
      })}
      <span style={{ height: 0 }} ref={bottomRef} />
    </div>
  );
};

export default Message;
