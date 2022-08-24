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
import { PrivateMessage, User } from '../types/types';
import { PeerSocketContext } from './PeerSocket';
import { UserMapsContext } from './UserMapsContext';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface Notification {
  id?: number;
  type: NotificationType;
  title: string;
  content: string;
  isTmp?: boolean;
  picture?: string;
  user?: User;
  openPrivateChat?: Function;
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
  const { privateChatMap, setPrivateChat, openPrivateChat } =
    useContext(UserMapsContext);

  const addNotification = useCallback(
    (notification: Notification) => {
      !notification.isTmp &&
        setNotifications([...notifications, { ...notification, id: id }]);
      openNotification(
        notification.type,
        notification.title,
        notification.content,
        openPrivateChat,
        notification.picture,
        notification.user
      );
      setId(id + 1);
    },
    [setNotifications, id, notifications, openPrivateChat]
  );

  const maybeNotifyMessage = useCallback(
    async (message: PrivateMessage) => {
      const userId = message.user1.id;
      if (userId === me?.id || (isHome && activePrivateChat === userId)) return;
      let username = 'User';
      let picture = '/profile-pictures/serpent.png';
      let user: User | undefined;
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
            picture = res.data.picture;
            user = res.data;
          });
      } else {
        username = privateChatMap.get(userId)?.username as string;
        picture = privateChatMap.get(userId)?.picture as string;
        user = privateChatMap.get(userId);
      }
      let audio = new Audio('/when-604.mp3');
      audio.play();
      addNotification({
        type: 'success',
        title: username,
        content: message.content,
        picture: picture,
        user: user,
        openPrivateChat: openPrivateChat,
      });
    },
    [
      me,
      addNotification,
      activePrivateChat,
      privateChatMap,
      openPrivateChat,
      isHome,
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
