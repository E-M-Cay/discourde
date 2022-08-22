import { Typography } from 'antd';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { ProfileCall } from '../components/ProfileCall';
import { UserMapsContext } from '../context/UserMapsContext';
import { CustomImageChat } from '../CustomLi/CustomLi';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { setActivePrivateChat } from '../redux/userSlice';
import { PrivateChatMap } from '../types/types';

const PrivateChatBar = () => {
  const dispatch = useAppDispatch();
  const { privateChatMap } = useContext(UserMapsContext);

  const onClickHandler = (id: number) => {
    dispatch(setActivePrivateChat(id));
  };

  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#2F3136' }}>
      <div
        style={{
          height: '41.4px',
          width: '100%',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '16.8px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid rgba(26, 26, 26, 0.67)',
        }}
      >
        <Typography
          style={{
            color: 'white',
            paddingLeft: '15px',
            fontWeight: 'bold',
            fontSize: '16.8px',
          }}
        >
          Private Chats
        </Typography>
      </div>
      <div style={{ backgroundColor: '#2F3136', height: '773.55px' }}>
        {Array.from(privateChatMap.entries()).map(([id, user]) => (
          <div
            key={id}
            className='hoStat'
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              maxWidth: '300px',
            }}
          >
            <CustomImageChat
              key={id}
              id={id}
              picture={user.picture}
              nickname={user.username}
              onClickHandler={onClickHandler}
            />
            <Typography
              style={{
                width: '100%',
                height: '100%',
                paddingLeft: '5px',
                fontWeight: 'bold',
                color: '#A1A1A1',
              }}
            >
              {user.username.length > 15
                ? user.username.slice(0, 15) + '...'
                : user.username}
            </Typography>
          </div>
        ))}
      </div>
      <ProfileCall />
    </div>
  );
};

export default PrivateChatBar;
