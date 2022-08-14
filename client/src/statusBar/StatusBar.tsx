import { Button, Collapse, Dropdown, Menu, Typography } from 'antd';
import { useState } from 'react';
import { CustomImage } from '../CustomLi/CustomLi';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { PrivateChatMap, User, UserMap } from '../types/types';

//const { Title } = Typography;
const { Panel } = Collapse;

export const StatusBar = (props: {
    userMap: UserMap;
    privateChatMap: PrivateChatMap;
    addPrivateChat: (user: any) => void;
}) => {
    const { userMap, privateChatMap, addPrivateChat } = props;
    const [activeUser, setActiveUser] = useState<User | undefined>(undefined);

    //antd menu for dropdown

    const menu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <a
                            target='_blank'
                            rel='noopener noreferrer'
                            onClick={() => addPrivateChat(activeUser)}>
                            message
                        </a>
                    ),
                },
                {
                    key: '2',
                    label: (
                        <a
                            target='_blank'
                            rel='noopener noreferrer'
                            href='https://www.aliyun.com'>
                            ajouter en ami
                        </a>
                    ),
                },
                {
                    key: '3',
                    label: (
                        <a
                            target='_blank'
                            rel='noopener noreferrer'
                            href='https://www.luohanacademy.com'>
                            role
                        </a>
                    ),
                },
                {
                    key: '4',
                    label: (
                        <a
                            target='_blank'
                            rel='noopener noreferrer'
                            href='https://www.luohanacademy.com'>
                            exclure
                        </a>
                    ),
                },
            ]}
        />
    );

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
                            <Dropdown
                                overlay={menu}
                                placement='bottomLeft'
                                arrow>
                                <div
                                    key={id}
                                    onMouseEnter={() =>
                                        setActiveUser(user.user)
                                    }
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-around',
                                        alignItems: 'center',
                                        maxWidth: '300px',
                                    }}
                                    className='hoStat'>
                                    {' '}
                                    <CustomImage
                                        obj={user}
                                        privateChatMap={privateChatMap}
                                        addPrivateChat={addPrivateChat}
                                        key={id}
                                    />{' '}
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
                            </Dropdown>
                        ) : null
                    )}
                </Panel>
                <Panel
                    key='2'
                    header='hors ligne'
                    style={{ margin: '0 !important' }}>
                    {Array.from(userMap.entries()).map(([id, user]) =>
                        !user.user.status ? (
                            <div
                                key={id}
                                className='hoStat'
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    maxWidth: '300px',
                                }}>
                                <Dropdown
                                    overlay={menu}
                                    placement='bottomLeft'
                                    arrow>
                                    <CustomImage
                                        obj={user}
                                        privateChatMap={privateChatMap}
                                        addPrivateChat={addPrivateChat}
                                        key={id}
                                    />{' '}
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
                                </Dropdown>
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
