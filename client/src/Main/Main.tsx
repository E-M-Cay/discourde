import { Col, Row } from 'antd';
import { StatusBar } from '../statusBar/StatusBar';
import Chat from '../Chat/Chat';
import { ChanelBar } from '../ChanelBar/ChanelBar';
import { useAppSelector } from '../redux/hooks';
import { FriendPanel } from '../FriendPanel/FriendPanel';
import PrivateChatBar from '../PrivateChatBar/PrivateChatBar';
import { useEffect, useState } from 'react';
import { GeneralSettings } from '../Modals/Modals';
import { CallPanel } from '../CallPanel/CallPanel';
import { Channel, ServerResponse, VocalChan } from '../types/types';

export const Main = (props: {
  handleLeaveServer: () => void;
  setServers: React.Dispatch<React.SetStateAction<ServerResponse[]>>;
}) => {
  const { handleLeaveServer, setServers } = props;
  const isHome = useAppSelector((state) => state.userReducer.home);
  const [vocalChannelList, setVocalChannelList] = useState<VocalChan[]>([]);
  const [textChannelList, setTextChannelList] = useState<Channel[]>([]);

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
        <Chat textChannelList={textChannelList} />
      </Col>
      <Col style={{ backgroundColor: 'grey' }} span={3}>
        {isHome ? <FriendPanel setServers={setServers} /> : <StatusBar />}
      </Col>
    </Row>
  );
};
