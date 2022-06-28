import { MediaConnection } from 'peerjs';
import { useContext, useEffect, useState } from 'react';
import { PeerSocketContext } from '../context/PeerSocket';
import { useAppSelector } from '../redux/hooks';

interface UserInfo {
  username: string;
  id: string;
}

const VocalChannel = (props: { channelName: string }) => {
  const { peer, socket } = useContext(PeerSocketContext);
  const { channelName } = props;
  const user = useAppSelector((state) => state.userReducer);
  const [userList, setUserList] = useState<UserInfo[]>([]);

  const openPeer = (id: string) => {
    console.log('peerid:', id);
    socket?.emit('peerId', id);
  };

  const callEvent = (call: MediaConnection) => {
    const audioNode = new Audio();
    // eslint-disable-next-line no-restricted-globals
    if (confirm(`Call incoming`)) {
      console.log('streamref.current:', user.stream);
      call.answer(user.stream);

      call.on('stream', (stream) => {
        audioNode.srcObject = stream;
        console.log('receiving stream');
        audioNode.play();
      });

      call.on('close', () => {
        audioNode.remove();
      });
    }
  };

  useEffect(() => {
    peer?.on('call', callEvent);
    peer?.on('open', openPeer);
    socket?.on('hello', hello);
    return () => {
      peer?.off('call', callEvent);
      peer?.off('open', openPeer);
      socket?.off('hello', hello);
    };
  });
  const callUser = (id: string) => {
    const audioNode = new Audio();
    if (user.stream) {
      console.log(id);
      const call = peer?.call(id, user.stream);

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

  const hello = (data: { username: string; id: string }) => {
    console.log('hello');
    setUserList((prevUserList) => [
      ...prevUserList,
      { username: data.username, id: data.id },
    ]);
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

  return <div>{displayUserList()}</div>;
};

export default VocalChannel;
