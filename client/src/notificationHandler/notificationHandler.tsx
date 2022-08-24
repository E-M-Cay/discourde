import { Avatar, Button, notification } from 'antd';
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
  const btn = user?.username ? (
    <button
      style={{
        borderRadius: 0,
        border: 0,
        padding: '3px 10px',
        color: 'grey',
        backgroundColor: '#40444b',
      }}
      onClick={() => openPrivateChat(user)}
    >
      Go on the message{' '}
    </button>
  ) : null;

  notification.open({
    message: picture ? 'Nouveau message de ' + title : title,
    description: content,
    placement: 'topRight',
    className: 'notificationHandler',
    onClick: () => openPrivateChat(user),
    style: { color: '#e2e2e2' },
    icon: (
      <Avatar
        size={38}
        style={{ marginRight: '50px' }}
        src={picture ?? '/profile-pictures/crane1.png'}
      />
    ),
  });
};
