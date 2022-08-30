import { Col, Row } from 'antd';
import { StatusBar } from '../statusBar/StatusBar';
import Chat from '../Chat/Chat';
import { ChanelBar } from '../ChanelBar/ChanelBar';
import { useAppSelector } from '../redux/hooks';
import { FriendPanel } from '../FriendPanel/FriendPanel';
import PrivateChatBar from '../PrivateChatBar/PrivateChatBar';
import { useContext, useEffect, useState } from 'react';
import { GeneralSettings } from '../Modals/Modals';

import { Channel, ServerResponse, VocalChan } from '../types/types';
import { PeerSocketContext } from '../context/PeerSocket';
import { NotificationsContext } from '../context/NotificationsContext';

export const Main = (props: {
  handleLeaveServer: () => void;
  setServers: React.Dispatch<React.SetStateAction<ServerResponse[]>>;
  servers: ServerResponse[];
}) => {
  const { handleLeaveServer, setServers, servers } = props;
  const { home: isHome, me } = useAppSelector((state) => state.userReducer);
  const [vocalChannelList, setVocalChannelList] = useState<VocalChan[]>([]);
  const [textChannelList, setTextChannelList] = useState<Channel[]>([]);
  const { socket } = useContext(PeerSocketContext);
  const { addNotification } = useContext(NotificationsContext);
  // const activeServerObject =

  const handleLeftServer = (data: { user: number; server: number }) => {
    const { user, server } = data;
    if (user === me?.id) {
      setServers((prevState) =>
        prevState.filter((serv) => serv.server.id !== server)
      );
    }
  };

  useEffect(() => {
    socket.on(
      'kicked',
      (data: { serverName: string; serverPicture: string }) => {
        const { serverName, serverPicture } = data;
        const audio = new Audio('/door-slam.mp3');
        audio.play();
        addNotification({
          title: 'Exclusion',
          content: `Vous avez été exclu du server ${serverName} !`,
          isTmp: true,
          picture: serverPicture,
        });
      }
    );
    socket.on('userleftserver', handleLeftServer);

    return () => {
      socket.off('userleftserver', handleLeftServer);
      socket.off('kicked');
    };
  }, []);

  return (
    <Row
      style={{
        height: '100vh',
        width: '100%',
        marginLeft: '0 !important',
      }}
      className='main'
    >
      <GeneralSettings />
      <Col style={{ backgroundColor: '#535151' }} span={3}>
        {isHome ? (
          <PrivateChatBar />
        ) : (
          <ChanelBar
            servers={props.servers}
            handleLeaveServer={handleLeaveServer}
            vocalChannelList={vocalChannelList}
            textChannelList={textChannelList}
            setTextChannelList={setTextChannelList}
            setVocalChannelList={setVocalChannelList}
          />
        )}
      </Col>
      <Col span={18}>
        {/* <CallPanel /> */}
        <Chat
          textChannelList={textChannelList}
          vocalChannelList={vocalChannelList}
        />
      </Col>
      <Col style={{ backgroundColor: 'grey' }} span={3}>
        {isHome ? <FriendPanel setServers={setServers} /> : <StatusBar />}
      </Col>
    </Row>
  );
};
