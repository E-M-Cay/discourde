import { Avatar, Button, Input, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import logo from '../assets/discourde.png';
import { useState } from 'react';
import axios from 'axios';
import { setMe } from '../redux/userSlice';
import { profilePng } from '../profilePng/profilePng';

const UserProfileSettings = () => {
  const { Title } = Typography;
  const { me, activeServer } = useAppSelector((state) => state.userReducer);
  const dispatch = useAppDispatch();
  const [usernameInput, setUsernameInput] = useState(me?.username);
  const [pictureInput, setPictureInput] = useState(me?.picture);
  const [serverNickname, setServerNickname] = useState<string>('');

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

  const handleNicknameChange = () => {
    axios
      .post(
        'server/updatenickname',
        {
          idserver: activeServer,
          nickname: serverNickname,
        },
        {
          headers: {
            access_token: localStorage.getItem('token') as string,
          },
        }
      )
      .then((res) => {
        //console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setServerNickname('');
      });
  };

  return (
    <div>
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
          <div
            style={{
              padding: '10px 0',
              maxWidth: '80%',
              display: 'flex',
              justifyContent: 'space-between',
              margin: 'auto',
            }}
          >
            <label htmlFor='handleUsername'>Username</label>
            <Input
              style={{
                width: '50%',
              }}
              type={'text'}
              id={'handleUsername'}
              value={usernameInput}
              onChange={(e) => {
                setUsernameInput(e.target.value);
              }}
              placeholder={'Change your username'}
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                marginTop: '30px',
              }}
            >
              {profilePng.map((png, key) => (
                <>
                  {key < 5 && (
                    <Avatar
                      style={{
                        margin: '5px',
                        cursor: 'pointer',
                        boxSizing: 'border-box',
                        border: png === pictureInput ? '4px solid green' : '',
                      }}
                      onClick={() => setPictureInput(png)}
                      size={50}
                      src={png}
                    />
                  )}
                </>
              ))}
            </div>
            <div>
              {profilePng.map((png, key) => (
                <>
                  {key > 4 && (
                    <Avatar
                      style={{
                        margin: '5px',
                        cursor: 'pointer',
                        boxSizing: 'border-box',
                        border: png === pictureInput ? '4px solid green' : '',
                      }}
                      onClick={() => setPictureInput(png)}
                      size={50}
                      src={png}
                    />
                  )}
                </>
              ))}
            </div>
          </div>
          <div
            style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            <button
              onClick={() => handleProfileChange()}
              style={{
                borderRadius: 0,
                border: 0,
                marginTop: '20px',
                padding: '3px 10px',
                color: 'grey',
                backgroundColor: '#40444b',
              }}
            >
              Submit
            </button>
          </div>
        </>
        {activeServer && activeServer !== -1 ? (
          <div
            style={{
              padding: '15px 0',
              maxWidth: '80%',
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '25px',
              margin: 'auto',
              borderTop: '1px solid #40444b',
            }}
          >
            <label htmlFor='handleNickname'>Server nickname</label>
            <Input
              style={{
                width: '70%',
                marginTop: '20px',
              }}
              type={'text'}
              id={'handleNickname'}
              onChange={(e) => {
                setServerNickname(e.target.value);
              }}
            />
            <button
              onClick={() => handleNicknameChange()}
              style={{
                borderRadius: 0,
                border: 0,
                marginTop: '20px',
                padding: '3px 10px',
                color: 'grey',
                backgroundColor: '#40444b',
              }}
            >
              Change server nickname
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default UserProfileSettings;
