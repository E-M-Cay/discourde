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
import logo from '../assets/discourde.png';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface Notification {
  id?: number;
  title: string;
  content: string;
  isTmp?: boolean;
  picture?: string | JSX.Element;
  handlerFunction?: () => void;
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

  const addNotification = useCallback(
    (notification: Notification) => {
      !notification.isTmp &&
        setNotifications([...notifications, { ...notification, id: id }]);
      openNotification(
        notification.title,
        notification.content,
        notification.handlerFunction,
        notification.picture ?? logo
      );
      setId(id + 1);
    },
    [setNotifications, id, notifications]
  );

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
