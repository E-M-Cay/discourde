import { Col, Input, Layout, Row } from 'antd';
import { StatusBar } from '../statusBar/StatusBar';
import Chat from '../Chat/Chat';
import { ChanelBar } from '../ChanelBar/ChanelBar';
import chanelData from '../mock1';
import { FriendPanel } from '../FriendPanel/FriendPanel';
import { useAppSelector } from '../redux/hooks';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface ServerUser {
    id: number;
    nickname: string;
    user: User;
}

interface User {
    id: number;
    status: number;
    username: string;
}

export const Main = () => {
    const [userList, setUserList] = useState<ServerUser[]>([]);
    const activeServer = useAppSelector(
        (state) => state.userReducer.activeServer
    );

    useEffect(() => {
        if (activeServer)
            axios
                .get(`/server/list_user/${activeServer}`, {
                    headers: {
                        access_token: localStorage.getItem('token') as string,
                    },
                })
                .then((res) => {
                    setUserList(res.data);
                });
    }, [activeServer]);

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
            <Col span={16}>
                <Chat />
            </Col>
            <Col style={{ backgroundColor: 'grey' }} span={4}>
                <StatusBar userList={userList} />
            </Col>
        </Row>
    );
};
