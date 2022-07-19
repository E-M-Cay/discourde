import { Image, Typography, Tooltip } from 'antd';
import React from 'react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setActiveServer } from '../redux/userSlice';

interface ServerResponse {
  id: number;
  nickname: string;
  server: Server;
}

interface Server {
  id: number;
  logo: string;
  main_img: string;
  name: string;
}

export const CustomLimage = (props: { obj: ServerResponse }) => {
  const obj = props.obj;
  const [isFocused, setFocus] = useState(false);
  const dispatch = useAppDispatch();
  return (
    <Tooltip
      mouseLeaveDelay={0.3}
      placement='left'
      style={{ fontSize: '32px' }}
      title={obj.server.name}>
      <img
        onMouseEnter={() => setFocus(true)}
        alt={obj.server.name}
        onMouseLeave={() => setFocus(false)}
        onClick={() => dispatch(setActiveServer(obj.server.id))}
        className={'imgS'}
        style={{
          margin: '5px auto',
          width: 'auto',
          maxWidth: "50px",
          backgroundColor: isFocused ? '#4b4b4b' : '#353535',
          borderRadius: '30px',
          cursor: 'pointer',
          height: "50px",
        }}
        src={obj.server.main_img[0] === 'h' ? obj.server.main_img : 'https://robohash.org/etdoloremvoluptas.png?size=50x50&set=set1'}
      />
    </Tooltip>
  );
};
export const CustomImage = ({ obj }: any) => {
  const [isFocused, setFocus] = useState(false);
  return (
    <img
      alt={obj.first_name}
      onMouseEnter={() => setFocus(true)}
      onMouseLeave={() => setFocus(false)}
      className={'imgS2'}
      style={{
        margin: '5px auto',
        width: 'auto',
        backgroundColor: '#4b4b4b',
        borderRadius: '30px',
        cursor: 'pointer',
      }}
      src={obj.img}
    />
  );
};
export const CustomImageMess = ({ obj }: any) => {
  const [isFocused, setFocus] = useState(false);
  return (
    <img
      alt={obj.first_name}
      onMouseEnter={() => setFocus(true)}
      onMouseLeave={() => setFocus(false)}
      style={{
        backgroundColor: '#535353',
        margin: '5px auto',
        width: 'auto',
        borderRadius: '22px',
        cursor: 'pointer',
        height: '45px',
        marginRight: '17px',
        marginLeft: '10px',
      }}
      src={obj.photo}
    />
  );
};
