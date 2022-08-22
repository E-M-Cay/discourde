import { Avatar, Badge, notification } from 'antd';
import { useContext, useState } from 'react';
import { NotificationsContext } from '../context/NotificationsContext';

export const NotificationsComponent = () => {
  const { notifications, addNotification } = useContext(NotificationsContext);
  return (
    <div>
      {notifications.map((notification: any, index: number) => (
        <div key={index}>
          <h3>{notification.title}</h3>
          <p>{notification.content}</p>
        </div>
      ))}
    </div>
  );
};
