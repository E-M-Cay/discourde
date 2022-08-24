import { Avatar, Badge, notification, Typography } from 'antd';
import { useContext, useState } from 'react';
import { NotificationsContext } from '../context/NotificationsContext';

export const NotificationsComponent = () => {
  const { notifications, addNotification } = useContext(NotificationsContext);
  return (
    <div>
      {notifications.length > 0 ? (
        <div>
          {notifications.map((notification: any, index: number) => (
            <div key={index}>
              <h3>{notification.title}</h3>
              <p>{notification.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <Typography.Title
          style={{ color: '#2c2c2c', textAlign: 'center' }}
          level={4}
        >
          Tu n'as pas de nouvelles notifications
        </Typography.Title>
      )}
    </div>
  );
};
