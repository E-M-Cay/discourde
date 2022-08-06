import { Col, Row } from 'antd';
import { StatusBar } from '../statusBar/StatusBar';
import Chat from '../Chat/Chat';
import { ChanelBar } from '../ChanelBar/ChanelBar';
//import { FriendPanel } from '../FriendPanel/FriendPanel';
import { useAppSelector } from '../redux/hooks';
import { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { MapOrEntries, useMap } from 'usehooks-ts';
import { ServerUser } from '../types/types';
import { PeerSocketContext } from '../context/PeerSocket';

export const Main = () => {
    const activeServer = useAppSelector(
        (state) => state.userReducer.activeServer
    );
    const initialValue: MapOrEntries<number, ServerUser> = [];
    const [userMap, actions] = useMap<number, ServerUser>(initialValue);
    // const [userMap, setUserMap] = useState<Map<number, number>>(new Map([]))
    const { socket } = useContext(PeerSocketContext);
    const { set, setAll, remove, reset } = actions;

    const resetUserMap = useCallback(() => {
        reset();
    }, [reset]);

    const setUserMap = useCallback(
        (user: ServerUser) => {
            set(user.user.id, user);
        },
        [set]
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
                    res.data.forEach((user: ServerUser) => setUserMap(user));
                });

        return () => {
            resetUserMap();
        };
    }, [activeServer, setUserMap, resetUserMap]);

    const handleDisconnection = useCallback(
        (id: number) => {
            const copy = userMap.get(id) ?? null;
            if (!copy) return;
            copy.user.status = 0;
            set(id, copy);
            console.log('disconnecting', id);
        },
        [set, userMap]
    );

    const handleConnection = useCallback(
        (id: number) => {
            console.log('connecting', id);
            const copy = userMap.get(id) ?? null;
            console.log(copy, 'copy con');
            if (!copy) return;
            copy.user.status = 1;
            set(id, copy);
        },
        [set, userMap]
    );

    useEffect(() => {
        console.table(userMap);
    }, [userMap]);

    useEffect(() => {
        socket?.on('userdisconnected', handleDisconnection);
        socket?.on('userconnected', handleConnection);
        return () => {
            socket?.off('userdisconnected', handleDisconnection);
            socket?.off('userconnected', handleConnection);
        };
    }, [socket, handleDisconnection, handleConnection]);

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
