import { notification } from "antd";

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const openNotification  = (type: NotificationType, title: string, content: string) => {
            
            notification[type]({
              message: title,
              description: content,
              placement: 'bottom',
            })
}

