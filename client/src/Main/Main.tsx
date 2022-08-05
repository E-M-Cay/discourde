import { Col, Input, Layout, Row } from 'antd';
import { StatusBar } from '../statusBar/StatusBar';
import Chat from '../Chat/Chat';
import { ChanelBar } from '../ChanelBar/ChanelBar';
import chanelData from '../mock1';
import { FriendPanel } from '../FriendPanel/FriendPanel';
import { useAppSelector } from '../redux/hooks';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { MapOrEntries, useMap } from 'usehooks-ts';

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
    const activeServer = useAppSelector(
        (state) => state.userReducer.activeServer
    );
    const initialValue: MapOrEntries<number, ServerUser> = [];
    const [userMap, actions] = useMap<number, ServerUser>(initialValue);

    useEffect(() => {
        if (activeServer)
            axios
                .get(`/server/list_user/${activeServer}`, {
                    headers: {
                        access_token: localStorage.getItem('token') as string,
                    },
                })
                .then((res) => {
                    res.data.forEach((user: ServerUser) =>
                        actions.set(user.user.id, user)
                    );
                });

        return () => {
            actions.reset();
        };
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
                <Chat userMap={userMap} />
            </Col>
            <Col style={{ backgroundColor: 'grey' }} span={4}>
                <StatusBar userMap={userMap} />
            </Col>
        </Row>
    );
};
