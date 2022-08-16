import {
    CloseCircleOutlined,
    MenuOutlined,
    MessageOutlined,
    CheckCircleFilled,
} from '@ant-design/icons';
import { Collapse, Divider, Tabs } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { UserMapsContext } from '../context/UserMapsContext';
import { useAppSelector } from '../redux/hooks';
import { ReceivedFriendRequest, Friendship } from '../types/types';
// import friendsData from '../mockFriends';
import './FriendPanel.css';

const { TabPane } = Tabs;
const { Panel } = Collapse;

export const FriendPanel = () => {
    const onlineUsers: Array<any> = [];
    // const me = useAppSelector((state) => state.userReducer.me);
    const {
        friendMap,
        receivedFriendRequestMap,
        sentFriendRequestMap,
        acceptFriendRequest,
        refuseFriendRequest,
        deleteFriendRequest,
    } = useContext(UserMapsContext);

    const [serverRequests, setServerRequests] = useState<Array<any>>([]);

    useEffect(() => {}, []);

    // for (let index = 0; index < friendsData.length; index++) {
    //     if (friendsData[index].onRequest) {
    //         const onRequestUser = friendsData[index].nickname;
    //         friendRequests.push(onRequestUser);
    //     } else if (!friendsData[index].onRequest && friendsData[index].onLine) {
    //         const onLineUser = friendsData[index].nickname;
    //         onlineUsers.push(onLineUser);
    //     } else if (!friendsData[index].onRequest) {
    //         const useer = friendsData[index].nickname;
    //         friendships.push(useer);
    //     }
    //     console.log(onlineUsers);
    // }

    useEffect(() => {
        axios
            .get('serverinvitation/getinvitations', {
                headers: {
                    access_token: localStorage.getItem('token') as string,
                },
            })
            .then((res) => {
                console.log(res, 'pépon');
                setServerRequests(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleAcceptServerInvitation = (
        invitationId: number,
        serverId: number
    ) => {
        axios
            .post(
                'serverinvitation/acceptInvitation',
                {
                    serverInvitationId: invitationId,
                    serverId: serverId,
                },
                {
                    headers: {
                        access_token: localStorage.getItem('token') as string,
                    },
                }
            )
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onChange = (key: any) => {
        console.log(key);
    };
    const onClick = (e: any) => {
        console.log('click ', e);
    };

    return (
        <Tabs onChange={onChange} type='card'>
            <TabPane tab='En ligne' key='1'>
                <p style={{ position: 'fixed', fontSize: 'large' }}>
                    En ligne - {onlineUsers.length}
                </p>
                <br />
                <br />
                <li
                    className={'scrollIssue'}
                    style={{
                        height: '87vh',
                        width: '100%',
                        borderRight: 0,
                        padding: 0,
                        flexWrap: 'wrap',
                        overflowY: 'scroll',
                    }}>
                    {onlineUsers.map((nickname) => (
                        <div
                            onClick={onClick}
                            className='panelContent'
                            style={{
                                margin: 0,
                                padding: 0,
                                height: '8vh',
                                fontWeight: 'bold',
                            }}>
                            <Divider style={{ margin: 0 }} /> {nickname}{' '}
                            <div className='iconFriend'>
                                {' '}
                                <a>
                                    <MessageOutlined />
                                </a>{' '}
                                <a>
                                    <MenuOutlined />
                                </a>
                            </div>{' '}
                        </div>
                    ))}
                </li>
            </TabPane>
            <TabPane tab='Tous' key='2'>
                <p style={{ position: 'fixed', fontSize: 'large' }}>
                    Tous les amis - {friendMap.size}
                </p>
                <br />
                <br />
                <li
                    className={'scrollIssue'}
                    style={{
                        height: '87vh',
                        width: '100%',
                        borderRight: 0,
                        padding: 0,
                        flexWrap: 'wrap',
                        overflowY: 'scroll',
                    }}>
                    {Array.from(friendMap.entries()).map(([id, friendship]) => (
                        <span
                            key={friendship.id}
                            onClick={onClick}
                            className='panelContent'
                            style={{
                                margin: 0,
                                padding: 0,
                                height: '8vh',
                                fontWeight: 'bold',
                            }}>
                            <>
                                <Divider style={{ margin: 0 }} />{' '}
                                {friendship.friend.username}{' '}
                                <MessageOutlined className='iconFriend' />{' '}
                                <MenuOutlined className='iconFriend' />
                            </>
                        </span>
                    ))}
                </li>
            </TabPane>
            <TabPane tab='En attente' key='3'>
                <p style={{ position: 'fixed', fontSize: 'large' }}>
                    En attente - {receivedFriendRequestMap.size}
                </p>
                <br />
                <br />
                <li
                    className={'scrollIssue'}
                    style={{
                        height: '87vh',
                        width: '100%',
                        borderRight: 0,
                        padding: 0,
                        flexWrap: 'wrap',
                        overflowY: 'scroll',
                    }}>
                    <p>Requête d'amis reçues</p>
                    {Array.from(receivedFriendRequestMap.entries()).map(
                        ([id, request]) => (
                            <div
                                key={id}
                                onClick={onClick}
                                className='panelContent'
                                style={{
                                    margin: 0,
                                    padding: 0,
                                    height: '8vh',
                                    fontWeight: 'bold',
                                }}>
                                <>
                                    <Divider style={{ margin: 0 }} />{' '}
                                    {request.sender.username}{' '}
                                    <CloseCircleOutlined
                                        className='iconFriend'
                                        onClick={() =>
                                            deleteFriendRequest(
                                                request.id,
                                                request.sender.id
                                            )
                                        }
                                    />{' '}
                                    <CheckCircleFilled
                                        className='iconFriend'
                                        onClick={() =>
                                            acceptFriendRequest(
                                                request.id,
                                                request.sender.id
                                            )
                                        }
                                    />
                                </>
                            </div>
                        )
                    )}
                    <p>Requêtes d'amis envoyées</p>
                    {Array.from(sentFriendRequestMap.entries()).map(
                        ([id, request]) => (
                            <div
                                key={id}
                                onClick={onClick}
                                className='panelContent'
                                style={{
                                    margin: 0,
                                    padding: 0,
                                    height: '8vh',
                                    fontWeight: 'bold',
                                }}>
                                <>
                                    <Divider style={{ margin: 0 }} />{' '}
                                    {request.receiver.username}{' '}
                                    <CloseCircleOutlined
                                        className='iconFriend'
                                        onClick={() =>
                                            deleteFriendRequest(
                                                request.id,
                                                request.receiver.id
                                            )
                                        }
                                    />{' '}
                                </>
                            </div>
                        )
                    )}
                    <p>Serveur à rejoindre</p>
                    {serverRequests.map((request) => (
                        <div key={request.id}>
                            <Divider style={{ margin: 0 }} />{' '}
                            {request.server.name} {request.sender.username}
                            <button
                                onClick={() =>
                                    handleAcceptServerInvitation(
                                        request.id,
                                        request.server.id
                                    )
                                }>
                                accepter
                            </button>
                        </div>
                    ))}
                </li>
            </TabPane>
            <TabPane tab='Ajouter un ami' key='4'>
                Ajout amis
            </TabPane>
        </Tabs>
    );
};
