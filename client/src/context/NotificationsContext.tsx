import { createContext, useState } from "react";
import { openNotification } from "../notificationHandler/notificationHandler";

type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface Notification {
    type: NotificationType;
    title: string;
    content: string;
  }
  interface NotificationsContextInterface {
    notifications: Notification[];
    addNotification: (notification: Notification) => void;
    clearNotification: () => void;
    }
const NotificationsContext = createContext<NotificationsContextInterface>({notifications: [], addNotification: (_any?: any) => {
  throw new Error("addNotification not correctly overriden");
}, clearNotification: (_any?: any) => {
  throw new Error("clearNotification not correctly overriden");
}});

interface Props {
    children: React.ReactNode;
}

const NotificationsContextProvider: React.FunctionComponent<Props> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const addNotification = (notification: Notification) => {
    setNotifications([...notifications, notification]);
    openNotification(notification.type, notification.title, notification.content);
  }
  const clearNotification = () => {
    setNotifications([]);
  }
  return (
    <NotificationsContext.Provider value={{notifications, addNotification, clearNotification}} >
      {children}
      </NotificationsContext.Provider>
  )
}

export default NotificationsContextProvider;

export { NotificationsContext };
