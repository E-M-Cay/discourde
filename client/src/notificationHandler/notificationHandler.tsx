import { Avatar, notification } from 'antd';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const openNotification = (
  type: NotificationType,
  title: string,
  content: string,
  picture?: string
) => {
  // notification[type]({
  notification.open({
    message: title,
    description: content,
    placement: 'topLeft',
    className: 'notificationHandler',
    duration: 999,
    icon: <Avatar src={picture ?? '/profile-pictures/crane1.png'} />,
  });
};
