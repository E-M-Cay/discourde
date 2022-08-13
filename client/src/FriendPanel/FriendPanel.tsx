import {
    AudioMutedOutlined,
    AudioOutlined,
    BellOutlined,
    BorderlessTableOutlined,
    CloseCircleOutlined,
    CloseOutlined,
    CustomerServiceOutlined,
    DownOutlined,
    LogoutOutlined,
    MenuOutlined,
    MessageOutlined,
    PlusCircleOutlined,
    SettingOutlined,
    SoundOutlined,
    TeamOutlined,
    UserAddOutlined,
} from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Collapse,
    Divider,
    Dropdown,
    Menu,
    Skeleton,
    Space,
    Tabs,
    Tooltip,
} from 'antd';
import Sider from 'antd/lib/layout/Sider';
import React, { useState } from 'react';
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
    const gayList: Array<any> = [];

    let arthur: string = 'Arthur';
    gayList.push(arthur);
    console.log('List des omo : ' + gayList);

    const onlineUsers: Array<any> = [];
    const onRequestUsers: Array<any> = [];
    const allFriends: Array<any> = [];

    // for (let index = 0; index < friendsData.length; index++) {
    //     if (friendsData[index].onRequest) {
    //         const onRequestUser = friendsData[index].nickname;
    //         onRequestUsers.push(onRequestUser);
    //     } else if (!friendsData[index].onRequest && friendsData[index].onLine) {
    //         const onLineUser = friendsData[index].nickname;
    //         onlineUsers.push(onLineUser);
    //     } else if (!friendsData[index].onRequest) {
    //         const useer = friendsData[index].nickname;
    //         allFriends.push(useer);
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
                    Tous les amis - {allFriends.length}
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
                    {allFriends.map((nickname) => (
                        <li
                            onClick={onClick}
                            className='panelContent'
                            style={{
                                margin: 0,
                                padding: 0,
                                height: '8vh',
                                fontWeight: 'bold',
                            }}>
                            <Divider style={{ margin: 0 }} /> {nickname}{' '}
                            <MessageOutlined className='iconFriend' />{' '}
                            <MenuOutlined className='iconFriend' />
                        </li>
                    ))}
                </li>
            </TabPane>
            <TabPane tab='En attente' key='3'>
                <p style={{ position: 'fixed', fontSize: 'large' }}>
                    En attente - {onRequestUsers.length}
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
                    {onRequestUsers.map((nickname) => (
                        <li
                            onClick={onClick}
                            className='panelContent'
                            style={{
                                margin: 0,
                                padding: 0,
                                height: '8vh',
                                fontWeight: 'bold',
                            }}>
                            <Divider style={{ margin: 0 }} /> {nickname}{' '}
                            <CloseCircleOutlined className='iconFriend' />{' '}
                        </li>
                    ))}
                </li>
            </TabPane>
            <TabPane tab='Ajouter un ami' key='4'>
                Ajout amis
            </TabPane>
        </Tabs>
    );
};
