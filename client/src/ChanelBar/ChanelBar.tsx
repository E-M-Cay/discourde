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
import { Channel, PrivateChatMap, User, VocalChan } from '../types/types';
import { CustomImage } from '../CustomLi/CustomLi';
import { ServerChannels, ServerInvit, ServerParams } from '../Modals/Modals';
import { DropdownMenu } from '../DropdownMenu/DropdownMenu';
import { ChannelCollapse } from '../ChannelCollapse/ChannelCollapse';

const { Panel } = Collapse;

export const ChanelBar = () => {
    const activeServer = useAppSelector(
        (state) => state.userReducer.activeServer
    );
    const { socket } = useContext(PeerSocketContext);
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
    const [isModify, setIsModify] = useState(0);
    const [isModifyVoc, setIsModifyVoc] = useState(0);
    const [stateMenu, setmenuState] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newTextChannelName, setNewTextChannelName] = useState('');
    const [isAdminChannel, setIsAdminChannel] = useState(false);
    const [modifingChannel, setModifingChannel] = useState<any>(null);
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
        console.log('cancel');
        setIsModalVisibleParams(false);
    };

    const handleUpdateChannel = (
        txtChan: Channel | undefined,
        vocChan: VocalChan | undefined
    ) => {
        axios
            .put(
                `/${vocChan ? 'vocal' : ''}channel/update`,
                vocChan ?? txtChan,
                {
                    headers: {
                        access_token: localStorage.getItem('token') as string,
                    },
                }
            )
            .then((res) => {
                if (res.status === 200) {
                }
            })
            .catch((err) => {
                console.log(err);
            });
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
                    isVocal
                        ? setVocalChannelList([...vocalChannelList, res.data])
                        : setTextChannelList([...textChannelList, res.data]);
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

    const handleModifyChannelText = (chan: Channel) => {
        setModifingChannel(chan);
        setIsModify(chan.id);
    };
    const handleModifyChannelVoc = (chan: Channel) => {
        setModifingChannel(chan);
        setIsModifyVoc(chan.id);
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
        <DropdownMenu
            showModal2={showModal2}
            showModal3={showModal3}
            showModal={showModal}
            deleteServer={deleteServer}
        />
    );

    return (
        <div
            style={{ width: '100%', backgroundColor: '#1F1F1F' }}
            className='site-layout-background'>
            <ServerParams
                isModalVisibleParams={isModalVisibleParams}
                handleOk3={handleOk3}
                handleCancel3={handleCancel3}
                textChannelList={textChannelList}
                isModify={isModify}
                newTextChannelName={newTextChannelName}
                setModifingChannel={setModifingChannel}
                handleUpdateChannel={handleUpdateChannel}
                modifingChannel={modifingChannel}
                setIsModify={setIsModify}
                handleModifyChannelText={handleModifyChannelText}
                vocalChannelList={vocalChannelList}
                isModifyVoc={isModifyVoc}
                setIsModifyVoc={setIsModifyVoc}
                handleModifyChannelVoc={handleModifyChannelVoc}
            />
            <ServerInvit
                isModalVisibleInvitation={isModalVisibleInvitation}
                handleOk2={handleOk2}
                handleCancel2={handleCancel2}
                handleLinkCreation={handleLinkCreation}
            />
            <ServerChannels
                isModalVisible={isModalVisible}
                handleOk={handleOk}
                handleCancel={handleCancel}
                setNewTextChannelName={setNewTextChannelName}
                setIsAdminChannel={setIsAdminChannel}
                handleCreateChannel={handleCreateChannel}
            />

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
                    <ChannelCollapse
                        textChannelList={textChannelList}
                        vocalChannelList={vocalChannelList}
                        onTextChannelClick={onTextChannelClick}
                        onVocalChannelClick={onVocalChannelClick}
                        activeVocalChannel={activeVocalChannel}
                    />
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
