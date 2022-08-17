import { Col, Row } from 'antd';
import { StatusBar } from '../statusBar/StatusBar';
import Chat from '../Chat/Chat';
import { ChanelBar } from '../ChanelBar/ChanelBar';
import { useAppSelector } from '../redux/hooks';
import { FriendPanel } from '../FriendPanel/FriendPanel';
import PrivateChatBar from '../PrivateChatBar/PrivateChatBar';
import { useEffect } from 'react';
import { GeneralSettings } from '../Modals/Modals';

export const Main = () => {
  const isHome = useAppSelector((state) => state.userReducer.home);

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
      <Col style={{ backgroundColor: '#535151' }} span={3.5}>
        {isHome ? <PrivateChatBar /> : <ChanelBar />}
      </Col>
      <Col span={16}>
        <Chat />
      </Col>
      <Col style={{ backgroundColor: 'grey' }} span={4}>
        {isHome ? <FriendPanel /> : <StatusBar />}
      </Col>
    </Row>
  );
};
