import { Image, Typography, Tooltip } from 'antd';
import logo from '../assets/discourde.png';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  setActiveServer,
  setIsHome,
  setActiveServerName,
} from '../redux/userSlice';
import {
  PrivateChatMap,
  ServerResponse,
  ServerUser,
  User,
} from '../types/types';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';

export const CustomLimage = (props: { obj?: ServerResponse }) => {
  const { obj } = props;
  const [isFocused, setFocus] = useState(false);
  const dispatch = useAppDispatch();

  const onClickServer = () => {
    if (obj) {
      dispatch(setActiveServer(obj.server.id));
      dispatch(setActiveServerName(obj.server.name));
      dispatch(setIsHome(false));
    } else {
      dispatch(setIsHome(true));
      dispatch(setActiveServer(0));
    }
  };

  return (
    <Tooltip
      mouseLeaveDelay={0.3}
      placement='left'
      style={{ fontSize: '32px' }}
      title={obj?.server.name || 'Home'}
    >
      <img
        onMouseEnter={() => setFocus(true)}
        alt={obj?.server.name || 'Home'}
        onMouseLeave={() => setFocus(false)}
        onClick={onClickServer}
        className={'imgS'}
        style={{
          margin: '7px auto',
          width: '60px',
          backgroundColor: isFocused ? '#4b4b4b' : '#353535',
          borderRadius: '30px',
          cursor: 'pointer',
          height: '60px',
        }}
        src={
          obj?.server.main_img
            ? obj?.server.main_img[0] === 'h'
              ? obj?.server.main_img
              : logo
            : logo
        }
      />
    </Tooltip>
  );
};

export const CustomImage = (props: { obj: ServerUser }) => {
  const { obj } = props;
  const [isFocused, setFocus] = useState(false);

  return (
    <img
      alt={obj.user.username}
      onMouseEnter={() => setFocus(true)}
      onMouseLeave={() => setFocus(false)}
      className={'imgS2'}
      style={{
        margin: '5px auto',
        width: '38px',
        backgroundColor: '#4b4b4b',
        borderRadius: '30px',
        cursor: 'pointer',
      }}
      src={obj.user.picture ?? logo}
    />
  );
};

export const CustomImageMess = (props: {
  picture?: string;
  nickname: string;
}) => {
  const [isFocused, setFocus] = useState(false);
  const { nickname, picture } = props;
  return (
    <img
      alt={nickname}
      onMouseEnter={() => setFocus(true)}
      onMouseLeave={() => setFocus(false)}
      style={{
        backgroundColor: '#535353',
        margin: '5px auto',
        width: '45px',
        borderRadius: '22px',
        cursor: 'pointer',
        height: '45px',
        marginRight: '17px',
        marginLeft: '10px',
      }}
      src={picture ?? logo}
    />
  );
};

export const CustomImageChat = (props: {
  id: number;
  picture?: string;
  nickname: string;
  onClickHandler: (id: number) => void;
}) => {
  const [isFocused, setFocus] = useState(false);
  const { nickname, picture, onClickHandler, id } = props;
  return (
    <img
      alt={nickname}
      onMouseEnter={() => setFocus(true)}
      onMouseLeave={() => setFocus(false)}
      onClick={() => onClickHandler(id)}
      style={{
        backgroundColor: '#535353',
        margin: '5px auto',
        width: '45px',
        borderRadius: '22px',
        cursor: 'pointer',
        height: '45px',
        marginRight: '17px',
        marginLeft: '10px',
      }}
      src={picture ?? logo}
    />
  );
};
