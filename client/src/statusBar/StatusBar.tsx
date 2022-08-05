import { Collapse, Typography } from 'antd';
import axios from 'axios';

import React, { useEffect, useState } from 'react';
import { CustomImage } from '../CustomLi/CustomLi';
import fake from '../mock';
import { useAppSelector } from '../redux/hooks';
import { UserMap } from '../types/types';
const { Title } = Typography;
const { Panel } = Collapse;

export const StatusBar = (props: { userMap: UserMap }) => {
    const { userMap } = props;

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
                    {Array.from(userMap.entries()).map(([id, user]) =>
                        user.user.status ? (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                    alignItems: 'center',
                                    maxWidth: '300px',
                                }}
                                className='hoStat'>
                                {' '}
                                <CustomImage obj={user} key={id} />{' '}
                                <Typography
                                    style={{
                                        width: '100%',
                                        paddingLeft: '30px',
                                        fontWeight: 'bold',
                                        color: '#A1A1A1',
                                    }}>
                                    {user.nickname}
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
                    {Array.from(userMap.entries()).map(([id, user]) =>
                        !user.user.status ? (
                            <div
                                className='hoStat'
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    maxWidth: '300px',
                                }}>
                                <CustomImage obj={user} key={id} />{' '}
                                <Typography
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        paddingLeft: '30px',
                                        fontWeight: 'bold',
                                        color: '#A1A1A1',
                                    }}>
                                    {user.nickname}
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
