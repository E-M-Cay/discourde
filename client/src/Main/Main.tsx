import { Col, Row } from 'antd';
import { StatusBar } from '../statusBar/StatusBar';
import Chat from '../Chat/Chat';
import { ChanelBar } from '../ChanelBar/ChanelBar';
//import { FriendPanel } from '../FriendPanel/FriendPanel';
import { useAppSelector } from '../redux/hooks';
import { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { MapOrEntries, useMap } from 'usehooks-ts';
import { ServerUser, User } from '../types/types';
import { PeerSocketContext } from '../context/PeerSocket';

export const Main = () => {
    const isHome = useAppSelector((state) => state.userReducer.home);
    const activeServer = useAppSelector(
        (state) => state.userReducer.activeServer
    );
    const [userMap, userActions] = useMap<number, ServerUser>([]);
    const [FriendMap, friendActions] = useMap<Number, User>([]);
    // const [userMap, setUserMap] = useState<Map<number, number>>(new Map([]))
    const { socket } = useContext(PeerSocketContext);
    const [setUser, setAllUsers, removeUser, resetUsers] = [
        userActions.set,
        userActions.setAll,
        userActions.remove,
        userActions.reset,
    ];

    const resetUserMap = useCallback(() => {
        resetUsers();
    }, [resetUsers]);

    const setUserMap = useCallback(
        (user: ServerUser) => {
            setUser(user.user.id, user);
        },
        [setUser]
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
            const user = userMap.get(id) ?? null;
            if (!user) return;
            setUser(id, { ...user, user: { ...user.user, status: 0 } });
        },
        [setUser, userMap]
    );

    const handleConnection = useCallback(
        (id: number) => {
            const user = userMap.get(id) ?? null;
            if (!user) return;
            setUser(id, { ...user, user: { ...user.user, status: 1 } });
        },
        [setUser, userMap]
    );

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
                {/*isHome ? 'prout' : */ <ChanelBar userMap={userMap} />}
            </Col>
            <Col span={16}>
                <Chat userMap={userMap} />
            </Col>
            <Col style={{ backgroundColor: 'grey' }} span={4}>
                {/* {friendBar} */}
                <StatusBar userMap={userMap} />
            </Col>
        </Row>
    );
};
