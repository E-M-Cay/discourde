import {
    CloseCircleOutlined,
    MenuOutlined,
    MessageOutlined,
    CheckCircleFilled,
} from '@ant-design/icons';
import { Collapse, Divider, Tabs } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import { FriendRequest, Friendship } from '../types/types';
// import friendsData from '../mockFriends';
import './FriendPanel.css';

const { TabPane } = Tabs;
const { Panel } = Collapse;

export const FriendPanel = (serveur: any) => {
    for (const obj in serveur) {
        console.table(
            `${obj} pipi : ${serveur[obj].nickname}, ${serveur[obj].email}`
        );
    }

    const onlineUsers: Array<any> = [];
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const [friendships, setFriendShips] = useState<Friendship[]>([]);
    const me = useAppSelector((state) => state.userReducer.me);

    useEffect(() => {
        axios
            .get('/friends/requests', {
                headers: {
                    access_token: localStorage.getItem('token') as string,
                },
            })
            .then((res) => {
                setFriendRequests(res.data);
            });

        axios
            .get('/friends/list', {
                headers: {
                    access_token: localStorage.getItem('token') as string,
                },
            })
            .then((res) => {
                setFriendShips(res.data);
            });
    }, []);

    const acceptFriendRequest = (id: number) => {
        // axios.post;
    };

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
                    Tous les amis - {friendships.length}
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
                    {friendships.map((friendship) => (
                        <li
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
                                {/* {friendship.friend.username}{' '} */}
                                <MessageOutlined className='iconFriend' />{' '}
                                <MenuOutlined className='iconFriend' />
                            </>
                        </li>
                    ))}
                </li>
            </TabPane>
            <TabPane tab='En attente' key='3'>
                <p style={{ position: 'fixed', fontSize: 'large' }}>
                    En attente - {friendRequests.length}
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
                    {friendRequests.map((friendRequest) => (
                        <div
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
                                {friendRequest.sender.username}{' '}
                                <CloseCircleOutlined className='iconFriend' />{' '}
                                <CheckCircleFilled
                                    className='iconFriend'
                                    onClick={() =>
                                        acceptFriendRequest(friendRequest.id)
                                    }
                                />
                            </>
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
