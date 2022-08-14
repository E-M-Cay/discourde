import { Col, Row } from 'antd';
import { StatusBar } from '../statusBar/StatusBar';
import Chat from '../Chat/Chat';
import { ChanelBar } from '../ChanelBar/ChanelBar';
//import { FriendPanel } from '../FriendPanel/FriendPanel';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useMap } from 'usehooks-ts';
import { ServerUser, User } from '../types/types';
import { PeerSocketContext } from '../context/PeerSocket';
import { FriendPanel } from '../FriendPanel/FriendPanel';
import PrivateChatBar from '../PrivateChatBar/PrivateChatBar';
import { setActivePrivateChat, setIsHome } from '../redux/userSlice';

export const Main = () => {
    const isHome = useAppSelector((state) => state.userReducer.home);
    const activeServer = useAppSelector(
        (state) => state.userReducer.activeServer
    );
    const me = useAppSelector((state) => state.userReducer.me);
    const [userMap, userActions] = useMap<number, ServerUser>([]);
    const [privateChatMap, privateChatActions] = useMap<number, User>([]);
    const { socket } = useContext(PeerSocketContext);
    const dispatch = useAppDispatch();

    const [setUser, setAllUsers, removeUser, resetUsers] = [
        userActions.set,
        userActions.setAll,
        userActions.remove,
        userActions.reset,
    ];

    const [
        setPrivateChat,
        setAllPrivateChats,
        removePrivateChat,
        resetPrivateChats,
    ] = [
        privateChatActions.set,
        privateChatActions.setAll,
        privateChatActions.remove,
        privateChatActions.reset,
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

    const addPrivateChat = useCallback(
        (user: User) => {
            console.log(privateChatMap);

            if (user.id === me?.id) return;
            if (!privateChatMap.has(user.id)) {
                setPrivateChat(user.id, user);
            }

            dispatch(setActivePrivateChat(user.id));
            dispatch(setIsHome(true));
        },
        [setPrivateChat, me, dispatch, privateChatMap]
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

    useEffect(() => {
        axios
            .get('/privatemessage/userlist', {
                headers: {
                    access_token: localStorage.getItem('token') as string,
                },
            })
            .then((res) => {
                console.log(res.data);
                res.data.forEach((u: User) => setPrivateChat(u.id, u));
            });
    }, []);

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
                {isHome ? (
                    <PrivateChatBar privateChatMap={privateChatMap} />
                ) : (
                    <ChanelBar
                        userMap={userMap}
                        privateChatMap={privateChatMap}
                        addPrivateChat={addPrivateChat}
                    />
                )}
            </Col>
            <Col span={16}>
                <Chat userMap={userMap} privateChatMap={privateChatMap} />
            </Col>
            <Col style={{ backgroundColor: 'grey' }} span={4}>
                {isHome ? (
                    <FriendPanel />
                ) : (
                    <StatusBar
                        userMap={userMap}
                        addPrivateChat={addPrivateChat}
                        privateChatMap={privateChatMap}
                    />
                )}
            </Col>
        </Row>
    );
};
