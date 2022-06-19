import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import './App.css';
import Peer from 'peerjs';
import { SocketContext } from './context/socket';
import axios from 'axios';
import { host, peerServerHost } from './env/host';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { joinRoomSuccess, setUsername } from './redux/userSlice';

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
  const peerRef = useRef<Peer>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.username);
  const usernameRef = useRef<string>(user);

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
    setUserList((prevUserList) => [
      ...prevUserList,
      { username: data.username, id: data.id },
    ]);
  };

  const fetchMessage = () => {
    if (!message) {
      console.log('axios');
      axios.get(`https://${host}/toto`).then((res) => setMessage(res.data));
    }
  };

  const updateUsername = (newUsername: string) => {
    dispatch(setUsername(newUsername));
  };

  useEffect(() => {
    let secure: boolean = false;
    let port: number = 9000;

    if (process.env.NODE_ENV === 'production') {
      secure = true;
      port = 443;
    }
    if (!peerRef.current) {
      const peer = new Peer({
        config: {
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
          sdpSemantics: 'unified-plan',
        },
        port: port,
        host: peerServerHost,
        path: '/',
        debug: 1,
        secure: secure,
      });

      peer.on('open', (id) => {
        socket.emit('peerId', id);
      });

      peer.on('call', (call) => {
        const audioNode = new Audio();
        // eslint-disable-next-line no-restricted-globals
        if (confirm(`Call incoming`)) {
          console.log('streamref.current:', streamRef.current);
          call.answer(streamRef.current);

          call.on('stream', (stream) => {
            audioNode.srcObject = stream;
            console.log('receiving stream');
            audioNode.play();
          });

          call.on('close', () => {
            audioNode.remove();
          });
        }
      });

      peerRef.current = peer;
    }

    socket.on('connect', onConnection);
    socket.on('hello', hello);
    socket.on('username', updateUsername);
    return () => {
      socket.off('username', updateUsername);
      socket.off('connect', onConnection);
      socket.off('hello', hello);
    };
  }, [socket, onConnection]);

  const callUser = (id: string) => {
    const audioNode = new Audio();
    if (streamRef.current) {
      console.log(id);
      const call = peerRef.current?.call(id, streamRef.current);

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

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    usernameRef.current = e.target.value;
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit('username', usernameRef.current);
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
      {user != '' && (
        <>
          <div>{user}</div>
          <form onSubmit={(e) => onSubmitHandler(e)}>
            <input
              type='text'
              id='usernameInput'
              onChange={(e) => onChangeHandler(e)}
              defaultValue={user}
            />
            <input type='submit' />
          </form>
        </>
      )}
    </div>
  );
};

export default App;
