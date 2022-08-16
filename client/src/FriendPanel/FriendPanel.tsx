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
    const { friendMap, receivedFriendRequestMap, acceptFriendRequest } =
        useContext(UserMapsContext);

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
                        <li
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
                        </li>
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
                                    <CloseCircleOutlined className='iconFriend' />{' '}
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
                </li>
            </TabPane>
            <TabPane tab='Ajouter un ami' key='4'>
                Ajout amis
            </TabPane>
        </Tabs>
    );
};
