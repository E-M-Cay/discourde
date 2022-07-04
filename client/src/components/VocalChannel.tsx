import { MediaConnection } from 'peerjs';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { PeerSocketContext } from '../context/PeerSocket';
import { useAppSelector } from '../redux/hooks';

interface UserInfo {
  socketId: string;
  id: string;
}

const VocalChannel = (props: { channelName: string }) => {
  const { peer, socket } = useContext(PeerSocketContext);
  const { channelName } = props;
  const user = useAppSelector((state) => state.userReducer);
  const [userList, setUserList] = useState<UserInfo[]>([]);
  const streamRef = useRef<MediaStream>();

  const toggleMicrophone = async () => {
    if (!streamRef.current?.active) {
      await navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          stream.getAudioTracks().forEach((track) => {
            console.log(track.getSettings());
          });
          streamRef.current = stream;
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      try {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const openPeer = useCallback(
    (id: string) => {
      console.log('peerid:', id);
      socket?.emit('peerId', id);
      socket?.emit('getUsers');
    },
    [socket]
  );

  const callEvent = useCallback(
    async (call: MediaConnection) => {
      console.log('call');
      const audioNode = new Audio();
      // eslint-disable-next-line no-restricted-globals
      //if (confirm(`Call incoming`)) {
      //console.log('streamref.current:', user.stream);
      await toggleMicrophone();
      call.answer(user.stream);

      call.on('stream', (stream) => {
        audioNode.srcObject = stream;
        console.log('receiving stream');
        audioNode.play();
      });

      call.on('close', () => {
        audioNode.remove();
      });
      //}
    },
    [user.stream]
  );

  const receiveUsers = (userList: UserInfo[]) => {
    setUserList([...userList]);
  };

  const callUser = useCallback(
    (id: string) => {
      const audioNode = new Audio();
      if (!streamRef.current?.active) {
        toggleMicrophone();
      }
      console.log(id);
      const call = peer?.call(id, streamRef.current as MediaStream);

      call?.on('stream', (stream) => {
        audioNode.srcObject = stream;
        console.log('receiving stream');
        audioNode.play();
      });

      call?.on('close', () => {
        audioNode.remove();
      });
    },
    [peer, user.stream]
  );

  const hello = useCallback(
    async (data: { socketId: string; id: string }) => {
      console.log('hello');
      setUserList((prevUserList) => [
        ...prevUserList,
        { socketId: data.socketId, id: data.id },
      ]);
      await toggleMicrophone();
      callUser(data.id);
    },
    [callUser]
  );

  useEffect(() => {
    peer?.on('call', callEvent);
    peer?.on('open', openPeer);
    socket?.on('hello', hello);
    socket?.on('users', receiveUsers);
    return () => {
      peer?.off('call', callEvent);
      peer?.off('open', openPeer);
      socket?.off('hello', hello);
      socket?.off('users', receiveUsers);
    };
  }, [peer, socket, callEvent, openPeer, hello]);

  const displayUserList = () => {
    return userList.map((u) => {
      return (
        <div>
          {u.socketId}, {u.id}
          <button onClick={() => callUser(u.id)}></button>
        </div>
      );
    });
  };

  return <div>{displayUserList()}</div>;
};

export default VocalChannel;
