import { useContext, useEffect, useRef, useState } from 'react';
import './App.css';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { Input, Typography } from 'antd';
import {
  setUsername,
  setToken,
  setMe,
  setIsConnected,
} from './redux/userSlice';
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
  const isConnected = useAppSelector((state) => state.userReducer.isConnected);

  const [pictureLink, setPictureLink] = useState(
    'https://randomuser.me/api/portraits/men/1.jpg'
  );

  const [isModalVisible, setIsModalVisible] = useState(
    localStorage.getItem('token') ? false : true
  );

  useEffect(() => {
    console.log('modal visible ?', isModalVisible);
  }, [isModalVisible]);

  // const showModal = () => {
  //   setIsModalVisible(true);
  // };

  //const verifyAndRefreshToken = (tk: string) => {};

  const handleOk = () => {
    setIsModalVisible(false);
  };

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
            console.log('res.data', res.data);
            // connectSocket(token);
            dispatch(setIsConnected(true));
            dispatch(setMe(res.data.user));
          }
        })
        .catch((e) => {
          console.log(e);
          setIsModalVisible(true);
        });

      // verifyAndRefreshToken(token);
    } else setIsModalVisible(true);
  }, [setIsConnected, dispatch]);

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
          dispatch(setIsConnected(true));
          localStorage.setItem('token', res.data.token);
          console.log('res data user', res.data.user);
          dispatch(setMe(res.data.user));
          dispatch(setToken(res.data.token));
          handleOk();
          let audio = new Audio('girl-hey-ringtone-second-version.mp3');
          audio.play();
        }
      });
  };

  return (
    <div>
      {
        <>
          <PeerSocketProvider>
            {isConnected && <Home setTokenMissing={setIsModalVisible} />}
          </PeerSocketProvider>
          <Modal
            visible={isModalVisible}
            closable={false}
            footer={null}
            // style={{backgroundColor: '#535353'}}
          >
            <div className='App'>
              <>
                <form onSubmit={(e) => onSubmitRegister(e)}>
                  <Title level={3}>Register</Title>
                  <div
                    style={{
                      maxWidth: '80%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      margin: 'auto',
                    }}
                  >
                    <Text>email</Text>

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
                    <Text>password</Text>
                    <Input.Password
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
                    <Text>username</Text>

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
                  <div
                    style={{
                      paddingTop: '10px',
                      maxWidth: '80%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      margin: 'auto',
                    }}
                  >
                    <Text>picture</Text>
                    <select
                      name='pictures'
                      onChange={(e) => setPictureLink(e.target.value)}
                      id='pictures'
                    >
                      {profilePng.map((png, key) => (
                        <option key={key} value={png || 'pipi'}>
                          {key < 10
                            ? 'men ' + (Number(key) + 1)
                            : 'women ' + (Number(key) + 1)}
                        </option>
                      ))}
                    </select>
                  </div>{' '}
                  <br />
                  <input type='submit' />
                </form>
                <form onSubmit={(e) => onSubmitLogin(e)}>
                  <Title level={3}>Login</Title>

                  <label>
                    email
                    <input
                      type='text'
                      id='loginPassword'
                      onChange={(e) => onChangeHandler(e, loginEmailRef)}
                    />
                  </label>
                  <label>
                    password
                    <input
                      type='password'
                      id='loginPassword'
                      onChange={(e) => onChangeHandler(e, loginPasswordRef)}
                    ></input>
                  </label>
                  <input type='submit' />
                </form>{' '}
              </>
            </div>
          </Modal>
        </>
      }
    </div>
  );
};

export default App;
