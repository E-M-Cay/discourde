import { Col, Input, Layout, Row } from 'antd';
import { StatusBar } from '../statusBar/StatusBar';
import Chat from '../Chat/Chat';
import { ChanelBar } from '../ChanelBar/ChanelBar';
import chanelData from '../mock1';
import { FriendPanel } from '../FriendPanel/FriendPanel';
import { useAppSelector } from '../redux/hooks';
import { CallPanel } from '../CallPanel/CallPanel';
import './Main.css';

export const Main = () => {
    return (
        <Row
            style={{
                height: '100vh',
                width: '100%',
                marginLeft: '0 !important',
            }}
            className='main'>
            <Col style={{ backgroundColor: '#535151' }} span={3.5}>
                <ChanelBar />
            </Col>
            <Col span={16} className='onCall'>
                <CallPanel />
            </Col>
            <Col  span={4}>
                <StatusBar />
            </Col>
        </Row>
    );
};
