import axios from 'axios';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { NotificationsContext } from '../context/NotificationsContext';
import { PeerSocketContext } from '../context/PeerSocket';
import { UserMapsContext } from '../context/UserMapsContext';
import { useAppSelector } from '../redux/hooks';
import { PrivateMessage } from '../types/types';
import { MessageItem } from './MessageItem';

const PrivateMessageChat = (props: { name: string; setName: Function }) => {
  const { setName } = props;
  const activePrivateChat = useAppSelector(
    (state) => state.userReducer.activePrivateChat
  );
  const me = useAppSelector((state) => state.userReducer.me);
  const [messages, setMessages] = useState<PrivateMessage[]>([]);

  const { socket } = useContext(PeerSocketContext);
  const { privateChatMap } = useContext(UserMapsContext);
  const { addNotification } = useContext(NotificationsContext);
  const [lastCompress, setLastCompress] = useState(true);

  const bottomRef = useRef<any>(null);

  useEffect(() => {
    if (activePrivateChat) {
      axios
        .get(`/privatemessage/messages/${activePrivateChat}`, {
          headers: {
            access_token: localStorage.getItem('token') as string,
          },
        })
        .then((res) => {
          ////console.log(res.data);
          setMessages(res.data.messages);
          setName(res.data.username);
        });
    }
  }, [activePrivateChat]);

  const receiveMessage = useCallback(
    (message: PrivateMessage) => {
      if (message.user1.id === activePrivateChat || message.user1.id === me?.id)
        setMessages((prev) => [...prev, message]);
      //console.log(message, 'message');
    },
    [activePrivateChat, me]
  );

  useEffect(() => {
    socket.on(`privatemessage`, receiveMessage);

    return () => {
      socket.off(`privatemessage`, receiveMessage);
    };
  }, [socket, receiveMessage]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const messageSanitizer = (
    message: PrivateMessage,
    lastmessageKey: number
  ) => {
    if (
      message.send_time.split(':')[0] ===
        messages[lastmessageKey]?.send_time.split(':')[0] &&
      message.user1.id === messages[lastmessageKey]?.user1.id &&
      message.send_time.split(':')[1] ===
        messages[lastmessageKey]?.send_time.split(':')[1] &&
      (messages[lastmessageKey]?.user1.id !==
        messages[lastmessageKey - 1]?.user1.id ||
        messages[lastmessageKey - 1]?.send_time.split(':')[0] !==
          messages[lastmessageKey]?.send_time.split(':')[0] ||
        messages[lastmessageKey - 1]?.send_time.split(':')[1] !==
          messages[lastmessageKey]?.send_time.split(':')[1])
    ) {
      return 3;
    } else if (
      message.send_time.split(':')[0] ===
        messages[lastmessageKey]?.send_time.split(':')[0] &&
      message.user1.id === messages[lastmessageKey]?.user1.id &&
      message.send_time.split(':')[1] ===
        messages[lastmessageKey]?.send_time.split(':')[1]
    ) {
      return 2;
    } else {
      return 1;
    }
  };

  function newDayCheck(message: PrivateMessage, lastmessageKey: number) {
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
      {messages?.map((obj: PrivateMessage, i: number) => {
        const user =
          obj.user1.id === me?.id ? me : privateChatMap.get(obj.user1.id);
        // //console.log(privateChatMap, 'user', obj.user1.id);
        return (
          user && (
            <MessageItem
              id={user?.id as number}
              key={i}
              username={user?.username as string}
              picture={user?.picture as string}
              content={obj.content}
              send_time={obj.send_time}
              compress={messageSanitizer(obj, i - 1)}
              isLast={i === messages.length - 1}
              isNewDay={newDayCheck(obj, i - 1)}
            />
          )
        );
      })}
      <span style={{ height: 0 }} ref={bottomRef} />
    </div>
  );
};

export default PrivateMessageChat;
