import { useEffect, useRef, useState } from 'react';
import './App.css';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { Avatar, Input, Typography } from 'antd';
import { setToken, setMe, setIsConnected } from './redux/userSlice';
import { Home } from './Home/Home';
import { Modal } from 'antd';
import { profilePng } from './profilePng/profilePng';
import PeerSocketProvider from './context/PeerSocket';

const { Title, Text } = Typography;

const App = () => {
  const dispatch = useAppDispatch();
  const registerUsernameRef = useRef<string>('');
  const registerEmailRef = useRef<string>('');
  const loginEmailRef = useRef<string>('');
  const registerPasswordRef = useRef<string>('');
  const loginPasswordRef = useRef<string>('');
  const { isConnected } = useAppSelector((state) => state.userReducer);
  const [isLoggin, setIsLoggin] = useState(false);

  const [pictureLink, setPictureLink] = useState(
    '/profile-pictures/serpent.png'
  );

  // const [isModalVisible, setIsModalVisible] = useState(
  //   localStorage.getItem('token') ? false : true
  // );

  const isModalVisible = !isConnected;

  // const handleOk = () => {
  //   setIsModalVisible(false);
  // };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(setToken(token));
      axios
        .get('/user/token_check', {
          headers: {
            access_token: token,
          },
        })
        .then((res) => {
          if (res.data.ok) {
            //console.log('res.data', res.data);
            // connectSocket(token);
            dispatch(setMe(res.data.user));
            dispatch(setIsConnected(true));
          }
        })
        .catch((e) => {
          console.log(e);
          // setIsModalVisible(true);
        });

      // verifyAndRefreshToken(token);
    }
    // else setIsModalVisible(true);
  }, [dispatch]);

  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    ref: React.MutableRefObject<string>
  ) => {
    ref.current = e.target.value;
  };

  const onSubmitRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios.post(`/user/register`, {
      email: registerEmailRef.current,
      password: registerPasswordRef.current,
      username: registerUsernameRef.current,
      picture: pictureLink,
    });
  };

  const onSubmitLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post(`/user/login`, {
        email: loginEmailRef.current,
        password: loginPasswordRef.current,
      })
      .then((res) => {
        if (res.data.token) {
          dispatch(setToken(res.data.token));
          dispatch(setMe(res.data.user));
          dispatch(setIsConnected(true));
          localStorage.setItem('token', res.data.token);
          //console.log('res data user', res.data.user);
          // handleOk();
          let audio = new Audio('girl-hey-ringtone-second-version.mp3');
          audio.play();
        }
      });
  };

  return (
    <>
      <PeerSocketProvider>{isConnected && <Home />}</PeerSocketProvider>
      <Modal
        visible={isModalVisible}
        closable={false}
        footer={null}
        title={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <Title
              onClick={() => setIsLoggin(false)}
              style={{ height: '100%', width: '90px', margin: 0 }}
              level={3}
              className={isLoggin ? 'titllede' : 'titledactive'}
            >
              Login
            </Title>
            <Avatar size={50} src={'/profile-pictures/discourde.png'} />
            <Title
              onClick={() => setIsLoggin(true)}
              style={{ height: '100%', width: '90px', margin: 0 }}
              level={3}
              className={isLoggin ? 'titledactive' : 'titllede'}
            >
              Register
            </Title>
          </div>
        }
        // style={{backgroundColor: '#535353'}}
      >
        <div className='App'>
          <>
            <form
              style={{ display: isLoggin ? '' : 'none' }}
              onSubmit={(e) => onSubmitRegister(e)}
            >
              <Title style={{ color: '#2c2c2c' }} level={3}>
                Register
              </Title>
              <div
                style={{
                  maxWidth: '80%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: 'auto',
                }}
              >
                <label htmlFor='registerEmail'>Email</label>

                <Input
                  style={{ maxWidth: '50%' }}
                  placeholder='email'
                  id='registerEmail'
                  onChange={(e) => onChangeHandler(e, registerEmailRef)}
                />
              </div>
              <div
                style={{
                  paddingTop: '10px',
                  maxWidth: '80%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: 'auto',
                }}
              >
                <label htmlFor='registerPassword'>Password</label>
                <Input
                  type={'password'}
                  style={{ maxWidth: '50%' }}
                  placeholder='password'
                  id='registerPassword'
                  onChange={(e) => onChangeHandler(e, registerPasswordRef)}
                />{' '}
              </div>
              <div
                style={{
                  paddingTop: '10px',
                  maxWidth: '80%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: 'auto',
                }}
              >
                <label htmlFor='registerUsername'>Username</label>

                <Input
                  placeholder='username'
                  style={{
                    paddingTop: '10px',
                    maxWidth: '50%',
                  }}
                  id='registerUsername'
                  onChange={(e) => onChangeHandler(e, registerUsernameRef)}
                />
              </div>

              <div style={{ marginTop: '30px' }}>
                {profilePng.map((png, key) => (
                  <>
                    <Avatar
                      style={{
                        margin: '5px',
                        border: png === pictureLink ? '4px solid green' : '',
                      }}
                      onClick={() => setPictureLink(png)}
                      size={png === pictureLink ? 60 : 50}
                      src={png}
                    />
                    {key === 4 && <br />}
                  </>
                ))}
              </div>
              <br />
              <input
                style={{
                  borderRadius: 0,
                  border: 0,
                  padding: '3px 10px',
                  color: 'grey',
                  backgroundColor: '#40444b',
                }}
                type='submit'
              />
            </form>
            <form
              style={{ display: isLoggin ? 'none' : '' }}
              onSubmit={(e) => onSubmitLogin(e)}
            >
              <Title style={{ color: '#2c2c2c' }} level={3}>
                Login
              </Title>
              <div
                style={{
                  paddingTop: '10px',

                  maxWidth: '80%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: 'auto',
                }}
              >
                <label htmlFor='loginPassword'>Email</label>
                <Input
                  type='text'
                  id='loginPassword'
                  onChange={(e) => onChangeHandler(e, loginEmailRef)}
                  placeholder='email'
                  style={{
                    width: '50%',
                  }}
                />
              </div>
              <div
                style={{
                  padding: '10px 0',

                  maxWidth: '80%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: 'auto',
                }}
              >
                <label htmlFor='loginPassword'>Password</label>
                <Input
                  type='password'
                  id='loginPassword'
                  placeholder='password'
                  onChange={(e) => onChangeHandler(e, loginPasswordRef)}
                  style={{
                    width: '50%',
                  }}
                ></Input>
              </div>
              <input
                style={{
                  borderRadius: 0,
                  border: 0,
                  marginTop: '20px',
                  padding: '3px 10px',
                  color: 'grey',
                  backgroundColor: '#40444b',
                }}
                type='submit'
              />
            </form>{' '}
          </>
        </div>
      </Modal>
    </>
  );
};

export default App;
