import { Avatar, Badge, Divider, notification, Typography } from 'antd';
import { useContext, useState } from 'react';
import { NotificationsContext } from '../context/NotificationsContext';

export const NotificationsComponent = () => {
  const { notifications, addNotification } = useContext(NotificationsContext);
  return (
    <div
      style={{ maxHeight: '600px', overflowX: 'auto', marginRight: '-17px' }}
    >
      {notifications.length > 0 ? (
        <div>
          <Typography.Title
            level={3}
            style={{
              color: '#2c2c2c',
              textAlign: 'center',
            }}
          >
            Centre de notification
          </Typography.Title>
          {notifications.map((notification: any, index: number) => (
            <>
              {index !== 0 && (
                <Divider
                  style={{ borderTop: '1px solid #36393f', marginTop: '30px' }}
                />
              )}
              <div
                className='notificationReje'
                onClick={() => {
                  //console.log('notification', notification);
                  notification.user &&
                    notification.openPrivateChat(notification.user);
                }}
                key={index}
              >
                <Typography.Title level={5} style={{ color: '#2c2c2c' }}>
                  <Avatar
                    size={35}
                    style={{ marginRight: '10px' }}
                    src={notification.picture ?? '/profile-pictures/crane1.png'}
                  />
                  {notification.user
                    ? 'Nouveau message de ' + notification.title
                    : notification.title}
                </Typography.Title>

                <p
                  style={{
                    marginLeft: '10px',
                    color: '#2c2c2c',
                    fontSize: '1rem',
                  }}
                >
                  {notification.content}
                </p>
              </div>
            </>
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
