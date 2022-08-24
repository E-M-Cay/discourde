import { Avatar, notification } from 'antd';
import { User } from '../types/types';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const openNotification = (
  type: NotificationType,
  title: string,
  content: string,
  openPrivateChat: Function,
  picture?: string,
  user?: User
) => {
  // notification[type]({
  notification.open({
    message: picture ? 'Nouveau message de ' + title : title,
    description: content,
    placement: 'topRight',
    className: 'notificationHandler',
    onClick: () => {
      if (user) {
        openPrivateChat(user);
      }
    },
    icon: (
      <Avatar
        size={38}
        style={{ marginRight: '50px' }}
        src={picture ?? '/profile-pictures/crane1.png'}
      />
    ),
  });
};
