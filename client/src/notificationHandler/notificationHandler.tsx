import { Avatar, notification } from 'antd';
import { User } from '../types/types';
export const openNotification = (
  title: string,
  content: string,
  handlerFunction?: () => void,
  picture?: string | JSX.Element
) => {
  // notification[type]({
  // const btn = user?.username ? (
  //   <button
  //     style={{
  //       borderRadius: 0,
  //       border: 0,
  //       padding: '3px 10px',
  //       color: 'grey',
  //       backgroundColor: '#40444b',
  //     }}
  //     onClick={() => openPrivateChat(user)}
  //   >
  //     Go on the message{' '}
  //   </button>
  // ) : null;

  notification.open({
    message: title,
    description: content,
    placement: 'topRight',
    className: 'notificationHandler',
    onClick: handlerFunction,
    style: { color: '#e2e2e2' },
    icon: (
      <Avatar
        size={38}
        style={{ marginRight: '50px' }}
        src={picture ?? '/profile-pictures/crane1.png'}
      />
    ),
    maxCount: 3,
  });
};
