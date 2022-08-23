import axios from 'axios';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { openNotification } from '../notificationHandler/notificationHandler';
import { useAppSelector } from '../redux/hooks';
import { PrivateMessage } from '../types/types';
import { PeerSocketContext } from './PeerSocket';
import { UserMapsContext } from './UserMapsContext';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface Notification {
  id?: number;
  type: NotificationType;
  title: string;
  content: string;
  isTmp?: boolean;
}
interface NotificationsContextInterface {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  clearNotification: () => void;
}
const NotificationsContext = createContext<NotificationsContextInterface>({
  notifications: [],
  addNotification: (_any?: any) => {
    throw new Error('addNotification not correctly overriden');
  },
  clearNotification: (_any?: any) => {
    throw new Error('clearNotification not correctly overriden');
  },
});

interface Props {
  children: React.ReactNode;
}

const NotificationsContextProvider: React.FunctionComponent<Props> = ({
  children,
}) => {
  const me = useAppSelector((state) => state.userReducer.me);
  const activePrivateChat = useAppSelector(
    (state) => state.userReducer.activePrivateChat
  );
  const isHome = useAppSelector((state) => state.userReducer.home);
  const [id, setId] = useState(0);
  const { socket } = useContext(PeerSocketContext);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { privateChatMap, setPrivateChat } = useContext(UserMapsContext);

  const addNotification = useCallback(
    (notification: Notification) => {
      !notification.isTmp &&
        setNotifications([...notifications, { ...notification, id: id }]);
      openNotification(
        notification.type,
        notification.title,
        notification.content
      );
      setId(id + 1);
    },
    [setNotifications, id, notifications]
  );

  const maybeNotifyMessage = useCallback(
    async (message: PrivateMessage) => {
      const userId = message.user1.id;
      if (userId === me?.id || (isHome && activePrivateChat === userId)) return;
      let username = 'User';
      if (!privateChatMap.has(userId)) {
        await axios
          .get(`user/${userId}`, {
            headers: {
              access_token: localStorage.getItem('token') as string,
            },
          })
          .then((res) => {
            setPrivateChat(res.data.id, res.data);
            username = res.data.username;
          });
      } else {
        username = privateChatMap.get(userId)?.username as string;
      }
      let audio = new Audio('/when-604.mp3');
      audio.play();
      addNotification({
        type: 'success',
        title: username,
        content: message.content,
      });
    },
    [
      me,
      addNotification,
      activePrivateChat,
      privateChatMap,
      isHome,
      addNotification,
      setPrivateChat,
    ]
  );

  useEffect(() => {
    socket.on(`privatemessage`, maybeNotifyMessage);

    return () => {
      socket.off(`privatemessage`, maybeNotifyMessage);
    };
  }, [socket, maybeNotifyMessage]);

  const clearNotification = () => {
    setNotifications([]);
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, addNotification, clearNotification }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsContextProvider;

export { NotificationsContext };
