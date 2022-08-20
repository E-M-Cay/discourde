import { Avatar, Button, Input, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import logo from '../assets/discourde.png';
import { useState } from 'react';
import axios from 'axios';
import { setMe } from '../redux/userSlice';

const UserProfileSettings = () => {
  const { Title } = Typography;
  const me = useAppSelector((state) => state.userReducer.me);
  const dispatch = useAppDispatch();
  const [usernameInput, setUsernameInput] = useState(me?.username);
  const [pictureInput, setPictureInput] = useState(me?.picture);

  const handleProfileChange = () => {
    axios
      .post(
        'user/update',
        {
          picture: pictureInput,
          username: usernameInput,
        },
        {
          headers: {
            access_token: localStorage.getItem('token') as string,
          },
        }
      )
      .then((res) => {
        dispatch(setMe(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div style={{ minHeight: '500px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Avatar size={64} src={me?.picture || logo} />
        <Title level={2}>{' ' + me?.username}</Title>
        <div></div>
      </div>
      <div style={{ marginTop: '24px' }}>
        <>
          <Input
            type={'text'}
            value={usernameInput}
            onChange={(e) => {
              setUsernameInput(e.target.value);
            }}
            placeholder={'Change your username'}
          />

          <Input
            type={'text'}
            value={pictureInput}
            onChange={(e) => {
              setPictureInput(e.target.value);
            }}
            placeholder={'Change your picture'}
          />

          <Button onClick={() => handleProfileChange()}>Change</Button>
        </>
      </div>
    </div>
  );
};

export default UserProfileSettings;
