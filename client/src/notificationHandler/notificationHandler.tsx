import { notification } from "antd";

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const openNotification  = (type: NotificationType, title: any, content: any) => {
  
            notification[type]({
              message: title,
              description: content,
              placement: 'bottom',
            })
}

