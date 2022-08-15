import { createContext } from "react";

interface NotificationsContextInterface {
  notifications: [{ title: any; content: any }];
  setNotifications: (notifications: [{ title: any; content: any }]) => void;
}

const NotificationsContext = createContext<NotificationsContextInterface[]>([]);

export { NotificationsContext };
