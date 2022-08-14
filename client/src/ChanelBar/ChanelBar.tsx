import {
    AudioMutedOutlined,
    AudioOutlined,
    BellOutlined,
    BorderlessTableOutlined,
    CloseOutlined,
    CustomerServiceOutlined,
    DownOutlined,
    LogoutOutlined,
    PlusCircleOutlined,
    SettingOutlined,
    SoundOutlined,
    TeamOutlined,
    UserAddOutlined,
} from '@ant-design/icons';
import {
    Button,
    Card,
    Collapse,
    Dropdown,
    Menu,
    Space,
    Tooltip,
    Modal,
    Typography,
    Input,
    Checkbox,
} from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import './ChanelBar.css';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setActiveChannel, setActiveVocalChannel } from '../redux/userSlice';
import { PeerSocketContext } from '../context/PeerSocket';
import { PrivateChatMap, User, UserMap } from '../types/types';
import { CustomImage } from '../CustomLi/CustomLi';

const { Panel } = Collapse;

interface Channel {
    hidden: boolean;
    id: number;
    name: string;
}

interface VocalChan extends Channel {
    users: number[];
}

export const ChanelBar = (props: {
    userMap: UserMap;
    privateChatMap: PrivateChatMap;
    addPrivateChat: (user: User) => void;
}) => {
    const { userMap, privateChatMap, addPrivateChat } = props;
    const activeServer = useAppSelector(
        (state) => state.userReducer.activeServer
    );
    const { peer, socket } = useContext(PeerSocketContext);
    const dispatch = useAppDispatch();
    const headerTxt: string = 'SALONS TEXTUELS';
    const headerVoc: string = 'SALONS VOCAUX';
    const serverName: string = 'TEEEST SERVEUR';
    const [vocalChannelList, setVocalChannelList] = useState<VocalChan[]>([]);
    const [textChannelList, setTextChannelList] = useState<Channel[]>([]);
    const activeVocalChannel = useAppSelector(
        (state) => state.userReducer.activeVocalChannel
    );
    const isHome = useAppSelector((state) => state.userReducer.home);

    let micro: boolean = true;

    useEffect(() => {
        if (activeServer)
            axios
                .get(`/channel/list/${activeServer}`, {
                    headers: {
                        access_token: localStorage.getItem('token') as string,
                    },
                })
                .then((res) => {
                    setVocalChannelList(res.data.vocal);
                    setTextChannelList(res.data.text);
                    console.log(res.data.text[0]);
                    dispatch(setActiveChannel(res.data.text[0].id));
                });
    }, [activeServer, dispatch]);

    const onChange = (key: any) => {};
    const onTextChannelClick = (id: number) => {
        dispatch(setActiveChannel(id));
    };
    const onVocalChannelClick = useCallback(
        (id: number) => {
            console.log(id, activeVocalChannel);
            if (activeVocalChannel === id) return;
            dispatch(setActiveVocalChannel(id));
            //socket?.emit('joinvocalchannel', id);
        },
        [socket, activeVocalChannel]
    );

    const handleJoinVocal = (data: { user: number; chan: number }) => {
        const { user, chan } = data;

        setVocalChannelList((prevState) => {
            return prevState.map((c) => {
                if (c.id === chan) {
                    return { ...c, users: [...c.users, user] };
                }
                return c;
            });
        });
    };

    const handleLeftVocal = (data: { user: number; chan: number }) => {
        const { user, chan } = data;
        console.log('left vocal', user, chan);
        setVocalChannelList((prevState) => {
            return prevState.map((c) => {
                if (c.id === chan) {
                    return { ...c, users: c.users.filter((u) => u !== user) };
                }
                return c;
            });
        });
    };

    useEffect(() => {
        socket?.on(`joiningvocal`, handleJoinVocal);
        socket?.on(`leftvocal`, handleLeftVocal);
        return () => {
            socket?.off(`joiningvocal`, handleJoinVocal);
            socket?.off(`leftvocal`, handleLeftVocal);
        };
    }, [socket]);

    const [stateMic, setmicState] = useState(true);
    const [stateHead, setheadState] = useState(true);
    const [stateMenu, setmenuState] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newTextChannelName, setNewTextChannelName] = useState('');
    const [isAdminChannel, setIsAdminChannel] = useState(false);
    const [isModalVisibleInvitation, setIsModalVisibleInvitation] =
        useState(false);
    const [isModalVisibleParams, setIsModalVisibleParams] = useState(false);
    const [channelName, setChannelName] = useState('');

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const showModal2 = () => {
        setIsModalVisibleInvitation(true);
    };

    const handleOk2 = () => {
        setIsModalVisibleInvitation(false);
    };

    const handleCancel2 = () => {
        setIsModalVisibleInvitation(false);
    };
    const showModal3 = () => {
        setIsModalVisibleParams(true);
    };

    const handleOk3 = () => {
        setIsModalVisibleParams(false);
    };

    const handleCancel3 = () => {
        setIsModalVisibleParams(false);
    };

    const handleCreateChannel = (isVocal: any) => {
        console.log(isVocal, 'rcvghjbknl', newTextChannelName);
        if (newTextChannelName.length > 0) {
            axios
                .post(
                    `/${isVocal ? 'vocalc' : 'c'}hannel/create`,
                    {
                        name: newTextChannelName,
                        server_id: activeServer,
                        hidden: isAdminChannel,
                    },
                    {
                        headers: {
                            access_token: localStorage.getItem(
                                'token'
                            ) as string,
                        },
                    }
                )
                .then((res) => {
                    setTextChannelList([...textChannelList, res.data]);
                    setNewTextChannelName('');
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    setIsModalVisible(false);
                });
        }
    };

    const createChannel = (e: React.FormEvent<HTMLFormElement>) => {
        console.log('bhfdksdklf');
        e.preventDefault();
        axios
            .post(
                'channel/create',
                { name: channelName, server_id: activeServer },
                {
                    headers: {
                        access_token: localStorage.getItem('token') as string,
                    },
                }
            )
            .then((res) => {
                setIsModalVisible(false);
            });
    };

    const deleteServer = useCallback(() => {
        axios.delete(`/server/delete_server/${activeServer}`, {
            headers: { access_token: localStorage.getItem('token') as string },
        });
    }, [activeServer]);

    const handleLinkCreation = () => {
        const id: string = Math.random().toString(16).slice(2);
        axios.post(
            '/server/link',
            { uuid: id, server: activeServer },
            {
                headers: {
                    access_token: localStorage.getItem('token') as string,
                },
            }
        );
    };

    const menu = (
        <Menu
            className='menu'
            items={[
                {
                    label: (
                        <li
                            style={{ color: 'white' }}
                            key={0}
                            onClick={showModal2}>
                            <UserAddOutlined
                                style={{
                                    color: 'darkgrey',
                                    fontSize: 'small',
                                }}
                            />{' '}
                            Inviter des gens{' '}
                        </li>
                    ),
                    key: '0',
                },
                {
                    label: (
                        <li style={{ color: 'white' }} key={1}>
                            <TeamOutlined
                                style={{
                                    color: 'darkgrey',
                                    fontSize: 'small',
                                }}
                            />{' '}
                            Gestion des membres{' '}
                        </li>
                    ),
                    key: '1',
                },
                {
                    type: 'divider',
                },
                {
                    label: (
                        <li
                            style={{ color: 'white' }}
                            onClick={showModal3}
                            key={2}>
                            <SettingOutlined
                                style={{
                                    color: 'darkgrey',
                                    fontSize: 'small',
                                }}
                            />{' '}
                            Paramètres du serveur{' '}
                        </li>
                    ),
                    key: '2',
                },
                {
                    label: (
                        <li
                            style={{ color: 'white' }}
                            key={3}
                            onClick={showModal}>
                            <PlusCircleOutlined
                                style={{
                                    color: 'darkgrey',
                                    fontSize: 'small',
                                }}
                            />{' '}
                            Créer un salon{' '}
                        </li>
                    ),
                    key: '3',
                },
                {
                    label: (
                        <li
                            style={{ color: 'white' }}
                            key={4}
                            onClick={() => deleteServer()}>
                            <PlusCircleOutlined
                                style={{
                                    color: 'darkgrey',
                                    fontSize: 'small',
                                }}
                            />{' '}
                            Supprimer serveur{' '}
                        </li>
                    ),
                    key: '4',
                },
                {
                    type: 'divider',
                },
                {
                    label: (
                        <li style={{ color: 'white' }} key={5}>
                            <BellOutlined
                                style={{
                                    color: 'darkgrey',
                                    fontSize: 'small',
                                }}
                            />{' '}
                            Notifications{' '}
                        </li>
                    ),
                    key: '5',
                },
                {
                    type: 'divider',
                },
                {
                    label: (
                        <a style={{ color: 'white' }} href=''>
                            <LogoutOutlined
                                style={{
                                    color: 'red',
                                    fontSize: 'small',
                                }}
                            />{' '}
                            Quitter le serveur{' '}
                        </a>
                    ),
                    key: '6',
                },
            ]}
        />
    );

    return (
        <div
            style={{ width: '100%', backgroundColor: '#1F1F1F' }}
            className='site-layout-background'>
            <Modal
                title='Basic Modal'
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                style={{ backgroundColor: '#1F1F1F' }}>
                <form onSubmit={(e) => createChannel(e)}>
                    <input
                        type='text'
                        defaultValue={channelName}
                        onChange={(e) => setChannelName(e.target.value)}
                        placeholder='Enter channel name'
                    />
                    <input type='submit' value='Create' />
                </form>
            </Modal>
            <Modal
                title='Basic Modal'
                visible={isModalVisibleInvitation}
                onOk={handleOk2}
                onCancel={handleCancel2}
                style={{ backgroundColor: '#1F1F1F' }}>
                <Button onClick={(e) => handleLinkCreation()}>
                    créer lien
                </Button>
            </Modal>
            <Modal
                title='Basic Modal'
                visible={isModalVisibleParams}
                onOk={handleOk3}
                onCancel={handleCancel3}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                    <Input placeholder='Add text channel' />
                    <Checkbox
                        onChange={(e) => setIsAdminChannel(e.target.checked)}>
                        isAdmin
                    </Checkbox>
                    <Button
                        type='primary'
                        onClick={() => handleCreateChannel(true)}>
                        Create
                    </Button>
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                    <Input
                        onChange={(e) =>
                            setNewTextChannelName('kggkhgghlfghkl')
                        }
                        placeholder='Add vocal channel'
                    />
                    <Checkbox
                        onChange={(e) => setIsAdminChannel(e.target.checked)}>
                        isAdmin
                    </Checkbox>{' '}
                    <Button
                        type='primary'
                        onClick={() => handleCreateChannel(false)}>
                        Create
                    </Button>
                </div>
            </Modal>

            {!isHome && (
                <Dropdown overlay={menu} trigger={['click']}>
                    <ul onClick={(e) => e.preventDefault()}>
                        <Space>
                            <p
                                style={{ color: 'white' }}
                                className='serverName'>
                                {serverName}
                                <a onClick={() => setmenuState(!stateMenu)}>
                                    {stateMenu ? (
                                        <DownOutlined className='menuIcon' />
                                    ) : (
                                        <CloseOutlined className='menuIcon' />
                                    )}
                                </a>
                            </p>
                        </Space>
                    </ul>
                </Dropdown>
            )}

            <div
                className={'scrollIssue'}
                style={{
                    height: '81vh',
                    width: '100%',
                    borderRight: 0,
                    padding: 0,
                    flexWrap: 'wrap',
                    overflowY: 'scroll',
                }}>
                {!isHome && (
                    <Collapse
                        ghost
                        defaultActiveKey={['1', '2']}
                        onChange={onChange}
                        style={{ backgroundColor: '#1F1F1F' }}>
                        <Panel
                            className='headerPanel'
                            header={headerTxt}
                            key='1'>
                            {textChannelList &&
                                textChannelList.map((chan) => (
                                    <li
                                        key={chan.id}
                                        onClick={() =>
                                            onTextChannelClick(chan.id)
                                        }
                                        className='panelContent'>
                                        {' '}
                                        <BorderlessTableOutlined /> {chan.name}
                                    </li>
                                ))}
                        </Panel>

                        <Panel
                            className='headerPanel'
                            header={headerVoc}
                            key='2'>
                            {vocalChannelList &&
                                vocalChannelList.map((chan) => (
                                    <li
                                        key={chan.id}
                                        onClick={() =>
                                            onVocalChannelClick(chan.id)
                                        }
                                        className='panelContent'>
                                        {' '}
                                        <SoundOutlined /> {chan.name}
                                        {activeVocalChannel === chan.id && (
                                            <>
                                                <br />
                                                <BorderlessTableOutlined className='activeChannel' />
                                            </>
                                        )}
                                        {chan.users.map((u) => (
                                            <div key={u}>
                                                {userMap.get(u)?.nickname ||
                                                    'Error retrieving user'}
                                            </div>
                                        ))}
                                    </li>
                                ))}
                        </Panel>
                    </Collapse>
                )}
            </div>
            <div style={{ backgroundColor: '#353535' }}>
                <Card
                    title='User + avatar'
                    extra={
                        <a href='#'>
                            <Tooltip
                                placement='top'
                                title={'Paramètres utilisateur'}>
                                <SettingOutlined
                                    style={{
                                        color: 'darkgrey',
                                        fontSize: 'large',
                                    }}
                                />
                            </Tooltip>
                        </a>
                    }
                    style={{ backgroundColor: '#353535', border: 0 }}>
                    <Tooltip placement='top' title={'Micro'}>
                        <a onClick={() => setmicState(!stateMic)}>
                            {stateMic ? (
                                <AudioOutlined className='microOn' />
                            ) : (
                                <AudioMutedOutlined className='microOff' />
                            )}
                        </a>
                    </Tooltip>
                    <Tooltip placement='top' title={'Casque'}>
                        <a onClick={() => setheadState(!stateHead)}>
                            {stateHead ? (
                                <CustomerServiceOutlined className='microOn' />
                            ) : (
                                <CustomerServiceOutlined className='microOff' />
                            )}
                        </a>
                    </Tooltip>
                </Card>
            </div>
        </div>
    );
};
