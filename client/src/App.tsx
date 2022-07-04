import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import './App.css';
import { PeerSocketContext } from './context/PeerSocket';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { joinRoomSuccess, setUsername, setStream } from './redux/userSlice';
import VocalChannel from './components/VocalChannel.js';

const App = () => {
  const { socket, peer, connectPeer, connectSocket } =
    useContext(PeerSocketContext);
  const [micStatus, setMicStatus] = useState<boolean>(false);
  const [message, setMessage] = useState<string>();
  const streamRef = useRef<MediaStream>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userReducer);
  const registerUsernameRef = useRef<string>('');
  const registerEmailRef = useRef<string>('');
  const loginEmailRef = useRef<string>('');
  const registerPasswordRef = useRef<string>('');
  const loginPasswordRef = useRef<string>('');

  const toggleMicrophone = () => {
    if (!user.stream?.active) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          stream.getAudioTracks().forEach((track) => {
            console.log(track.getSettings());
          });
          dispatch(setStream(stream));
          setMicStatus(true);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      try {
        streamRef.current = undefined;
      } catch (e) {
        console.error(e);
      }
    }
  };

  const onConnection = useCallback(() => {
    console.log('socket con');
    socket?.emit('connected', socket.id);
    connectPeer();
  }, [socket, connectPeer]);

  const fetchMessage = () => {
    if (!message) {
      console.log('axios');
      axios.get(`/toto`).then((res) => setMessage(res.data));
    }
  };

  const updateUsername = useCallback(
    (newUsername: string) => {
      dispatch(setUsername(newUsername));
    },
    [dispatch]
  );

  useEffect(() => {
    socket?.on('connect', onConnection);
    socket?.on('username', updateUsername);
    return () => {
      socket?.off('username', updateUsername);
      socket?.off('connect', onConnection);
    };
  }, [socket, onConnection, updateUsername, dispatch]);

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
    });
  };

  const onSubmitLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post(`/user/login`, {
        email: loginEmailRef.current,
        password: loginPasswordRef.current,
      })
      .then((data) => {
        if (data.data.token) {
          connectSocket();
        }
      });
  };

  return (
    <div className='App'>
      <button onClick={toggleMicrophone}>Open mic</button>
      <div>{message}</div>
      <div>Mic status: {micStatus ? 'open' : 'closed'}</div>
      <button onClick={fetchMessage}>Fetch message</button>
      <VocalChannel channelName='toto' />
      <>
        <form onSubmit={(e) => onSubmitRegister(e)}>
          <div>Register</div>
          <label>
            email
            <input
              type='text'
              id='registerEmail'
              onChange={(e) => onChangeHandler(e, registerEmailRef)}
            />
          </label>
          <label>
            password
            <input
              type='password'
              id='registerPassword'
              onChange={(e) => onChangeHandler(e, registerPasswordRef)}
            />
          </label>
          <label>
            username
            <input
              type='text'
              id='registerUsername'
              onChange={(e) => onChangeHandler(e, registerUsernameRef)}
            />
          </label>
          <input type='submit' />
        </form>
        <form onSubmit={(e) => onSubmitLogin(e)}>
          <div>Login</div>
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
              onChange={(e) => onChangeHandler(e, loginPasswordRef)}></input>
          </label>
          <input type='submit' />
        </form>
      </>
    </div>
  );
};

export default App;
