import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import './App.css';
import Peer from 'peerjs';
import { SocketContext } from './context/socket';
import axios from 'axios';
import { host, peerServerHost, peerPort } from './env/host';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { joinRoomSuccess, setUsername, setPeer } from './redux/userSlice';
import { startConnecting } from './redux/peerSlice';

interface UserInfo {
  username: string;
  id: string;
}

const App = () => {
  const socket = useContext(SocketContext);
  const [micStatus, setMicStatus] = useState<boolean>(false);
  const [userList, setUserList] = useState<UserInfo[]>([]);
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
    if (!streamRef.current) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          stream.getAudioTracks().forEach((track) => {
            console.log(track.getSettings());
          });
          streamRef.current = stream;
          setMicStatus(true);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      try {
        streamRef.current = undefined;
      } catch {}
    }
  };

  const onConnection = useCallback(() => {
    socket.emit('connected', socket.id);
  }, [socket]);

  const hello = (data: { username: string; id: string }) => {
    console.log('hello');
    setUserList((prevUserList) => [
      ...prevUserList,
      { username: data.username, id: data.id },
    ]);
  };

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
    dispatch(startConnecting());

    socket.on('connect', onConnection);
    socket.on('hello', hello);
    socket.on('username', updateUsername);
    return () => {
      socket.off('username', updateUsername);
      socket.off('connect', onConnection);
      socket.off('hello', hello);
    };
  }, [socket, onConnection, updateUsername, dispatch]);

  const callUser = (id: string) => {
    const audioNode = new Audio();
    if (streamRef.current) {
      console.log(id);
      const call = user.peer?.call(id, streamRef.current);

      call?.on('stream', (stream) => {
        audioNode.srcObject = stream;
        console.log('receiving stream');
        audioNode.play();
        //audioNode.remove();
      });

      call?.on('close', () => {
        audioNode.remove();
      });
    }
  };

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
    axios.post(`/user/login`, {
      email: loginEmailRef.current,
      password: loginPasswordRef.current,
    });
  };

  const displayUserList = () => {
    return userList.map((u) => {
      return (
        <div>
          {u.username}, {u.id}
          <button onClick={() => callUser(u.id)}></button>
        </div>
      );
    });
  };

  return (
    <div className='App'>
      <button onClick={toggleMicrophone}>Open mic</button>
      <div>{message}</div>
      <div>Mic status: {micStatus ? 'open' : 'closed'}</div>
      <div>{displayUserList()}</div>
      <button onClick={fetchMessage}>Fetch message</button>
      <audio id='audio' />
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
