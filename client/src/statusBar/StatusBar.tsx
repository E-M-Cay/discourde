import { Collapse, Typography } from 'antd';
import axios from 'axios';

import React, { useEffect, useState } from 'react';
import { CustomImage } from '../CustomLi/CustomLi';
import fake from '../mock';
import { useAppSelector } from '../redux/hooks';
const { Title } = Typography;
const { Panel } = Collapse;

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

export const StatusBar = () => {
    const activeServer = useAppSelector(
        (state) => state.userReducer.activeServer
    );
    const [userList, setUserList] = useState<ServerUser[]>([]);

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
        <div
            className={'scrollIssue'}
            style={{
                height: '100vh',
                borderRight: 0,
                padding: 0,
                overflowY: 'scroll',
            }}>
            <Collapse defaultActiveKey={['1', '2']} ghost>
                <Panel
                    key='1'
                    header='en ligne'
                    style={{ margin: '0 !important' }}>
                    {userList.map((object, i: number) =>
                        object.user.status ? (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                    alignItems: 'center',
                                    maxWidth: '300px',
                                }}
                                className='hoStat'>
                                {' '}
                                <CustomImage obj={object} key={i} />{' '}
                                <Typography
                                    style={{
                                        width: '100%',
                                        paddingLeft: '30px',
                                        fontWeight: 'bold',
                                        color: '#A1A1A1',
                                    }}>
                                    {object.nickname}
                                </Typography>{' '}
                            </div>
                        ) : (
                            ''
                        )
                    )}
                </Panel>
                <Panel
                    key='2'
                    header='hors ligne'
                    style={{ margin: '0 !important' }}>
                    {userList.map((object: ServerUser, i: number) =>
                        !object.user.status ? (
                            <div
                                className='hoStat'
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    maxWidth: '300px',
                                }}>
                                <CustomImage obj={object} key={i} />{' '}
                                <Typography
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        paddingLeft: '30px',
                                        fontWeight: 'bold',
                                        color: '#A1A1A1',
                                    }}>
                                    {object.nickname}
                                </Typography>{' '}
                            </div>
                        ) : (
                            ''
                        )
                    )}
                </Panel>
            </Collapse>
        </div>
    );
};
