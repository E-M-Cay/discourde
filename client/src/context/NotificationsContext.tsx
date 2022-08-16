import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { openNotification } from "../notificationHandler/notificationHandler";
import { useAppSelector } from "../redux/hooks";
import { PrivateMessage } from "../types/types";
import { PeerSocketContext } from "./PeerSocket";

type NotificationType = "success" | "info" | "warning" | "error";

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
    throw new Error("addNotification not correctly overriden");
  },
  clearNotification: (_any?: any) => {
    throw new Error("clearNotification not correctly overriden");
  },
});

interface Props {
  children: React.ReactNode;
}

const NotificationsContextProvider: React.FunctionComponent<Props> = ({
  children,
}) => {
  const me = useAppSelector((state) => state.userReducer.me);
  const [id, setId] = useState(0);
  const { socket } = useContext(PeerSocketContext);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const addNotification = (notification: Notification) => {
    !notification.isTmp &&
      setNotifications([...notifications, { ...notification, id: id }]);
    openNotification(
      notification.type,
      notification.title,
      notification.content
    );
    setId(id + 1);
  };
  const receiveMessage = useCallback(
    (message: PrivateMessage) => {
      if (message.user1.id !== me?.id) {
        addNotification({
          type: "success",
          title:
            "la personne " + message.user1.id + " vous a envoyé un message",
          content: message.content,
        });
      }
    },
    [socket, me, addNotification]
  );
  useEffect(() => {
    socket?.on(`privatemessage`, receiveMessage);

    return () => {
      socket?.off(`privatemessage`, receiveMessage);
    };
  }, [socket, receiveMessage]);
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
