import { Image, Typography, Tooltip, Avatar, Badge } from 'antd';
import logo from '../assets/discourde.png';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  setActiveServer,
  setIsHome,
  setActiveServerName,
  setActiveServerOwner,
} from '../redux/userSlice';
import { ServerResponse } from '../types/types';

export const CustomLimage = (props: { obj?: ServerResponse }) => {
  const { obj } = props;
  const [isFocused, setFocus] = useState(false);
  const dispatch = useAppDispatch();
  const isHome = useAppSelector((state) => state.userReducer.home);

  const onClickServer = () => {
    if (obj) {
      dispatch(setActiveServer(obj.server.id));
      dispatch(setActiveServerName(obj.server.name));
      dispatch(setActiveServerOwner(obj.server.owner?.id || -1));
      dispatch(setIsHome(false));
    } else {
      dispatch(setIsHome(true));
      dispatch(setActiveServer(0));
    }
  };

  const activeServer = useAppSelector(
    (state) => state.userReducer.activeServer
  );

  return (
    <Tooltip
      mouseLeaveDelay={0.3}
      placement='left'
      style={{ fontSize: '32px' }}
      title={obj?.server.name || 'Home'}
    >
      {(obj?.server.id === activeServer && !isHome) || (!obj && isHome) ? (
        <div
          style={{
            height: '0',
            paddingBottom: '30px',
            width: '30px',
            backgroundColor: '#FFFFFF',
            position: 'relative',
            top: '21px',
            left: '-33px',
            borderRadius: '8px',
          }}
        />
      ) : null}

      <img
        onMouseEnter={() => setFocus(true)}
        alt={obj?.server.name || 'Home'}
        onMouseLeave={() => setFocus(false)}
        onClick={onClickServer}
        className={'imgS'}
        style={{
          margin:
            (obj?.server.id === activeServer && !isHome) || (!obj && isHome)
              ? '-23px auto 7px auto'
              : '7px auto',
          width: '60px',
          backgroundColor: isFocused ? '#4b4b4b' : '#353535',
          opacity: isFocused ? 0.7 : 1,
          borderRadius: '30px',
          cursor: 'pointer',
          height: '60px',
        }}
        src={obj?.server.main_img || logo}
      />
    </Tooltip>
  );
};

export const CustomImage = (props: {
  status: number;
  username: string;
  picture?: string;
}) => {
  const { status, username, picture } = props;
  const [isFocused, setFocus] = useState(false);

  const returnColor = (status: number) => {
    switch (status) {
      case 0:
        return 'grey';
      case 1:
        return 'green';
      case 2:
        return 'yellow';
      case 3:
        return 'red';
      default:
        console.log('could not read status');
    }
  };

  return (
    <Badge
      className='fixStatus'
      dot
      style={{ backgroundColor: returnColor(status) }}
    >
      <Avatar
        alt={username}
        size={33}
        // onMouseEnter={() => setFocus(true)}
        // onMouseLeave={() => setFocus(false)}
        className={'imgS2'}
        style={{
          // border: returnColor(status),
          margin: '5px 5px 5px 0',
          // width: '38px',
          backgroundColor: '#4b4b4b',
          cursor: 'pointer',
        }}
        src={picture ?? logo}
      />
    </Badge>
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
  status: number;
  onClickHandler: (id: number) => void;
}) => {
  const [isFocused, setFocus] = useState(false);
  const { nickname, picture, onClickHandler, id, status } = props;

  const returnColor = (status: number) => {
    switch (status) {
      case 0:
        return 'grey';
      case 1:
        return 'green';
      case 2:
        return 'yellow';
      case 3:
        return 'red';
      default:
        console.log('could not read status');
    }
  };

  return (
    <Badge
      className='fixStatus'
      dot
      style={{ backgroundColor: returnColor(status) }}
    >
      {/* <Avatar shape='square' size='large' /> */}
      <Avatar
        alt={nickname}
        // size={37}
        // onMouseEnter={() => setFocus(true)}
        // onMouseLeave={() => setFocus(false)}
        // size={40}
        onClick={() => onClickHandler(id)}
        style={{
          // border: returnColor(status),
          backgroundColor: '#535353',
          margin: '5px auto',
          // width: '45px',
          // borderRadius: '22px',
          cursor: 'pointer',
          // height: '45px',
          // marginRight: '17px',
          marginLeft: '10px',
        }}
        src={picture ?? logo}
      />
    </Badge>
  );
};
