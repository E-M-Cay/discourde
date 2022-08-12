import Sider from 'antd/lib/layout/Sider';
import axios from 'axios';
import React from 'react';
import { CustomLimage } from '../CustomLi/CustomLi';
import fake from '../mock';
import { Image, Typography, Tooltip } from 'antd';

import { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { useAppSelector } from '../redux/hooks';
import { setServers } from 'dns';
import { ServerResponse } from '../types/types';

export const LeftBar = (props: {
    servers: ServerResponse[];
    setServers: React.Dispatch<React.SetStateAction<ServerResponse[]>>;
}) => {
    // useEffect(() => {
    //    fake.map((prop: any, i: any) => {
    //             axios.post("server/create_server", {name: prop.first_name, main_img: prop.img as string}, { headers: { access_token:  localStorage.getItem("token") as string },  } ).then((res) => {
    //                 console.log(res, "gdhdhdhdg");
    //             });
    //             return ""
    //             })
    // }, []);

    const { servers, setServers } = props;

    const [channelName, setChannelName] = useState('');
    const userId = useAppSelector((state) => state.userReducer.user_id);

    const joinServer = () => {
        axios
            .post(
                '/server/add_user',
                { server_id: serverId },
                {
                    headers: {
                        access_token: localStorage.getItem('token') as string,
                    },
                }
            )
            .then((res) => {
                if (res.data.server) {
                    setServers((prevState) => [...prevState, res.data.server]);
                }
            });
    };

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [serverId, setServerId] = useState(0);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const [isFocused, setFocus] = useState(false);
    const [serverName, setServerName] = useState('');
    const [serverLogo, setServerLogo] = useState('');
    const createServer = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios
            .post(
                'server/create_server',
                { name: serverName, main_img: serverLogo },
                {
                    headers: {
                        access_token: localStorage.getItem('token') as string,
                    },
                }
            )
            .then((res) => {
                console.log(res, 'gdhdhdhdg');
                setIsModalVisible(false);

                props.setServers((prevServerList) => {
                    return [...prevServerList, res.data];
                });
            });
    };

    return (
        <Sider className='site-layout-background'>
            <Modal
                title='Basic Modal'
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}>
                <form onSubmit={(e) => createServer(e)}>
                    <input
                        type='text'
                        defaultValue={serverName}
                        onChange={(e) => setServerName(e.target.value)}
                        placeholder='Enter server name'
                    />
                    <input
                        type='text'
                        defaultValue={serverLogo}
                        onChange={(e) => setServerLogo(e.target.value)}
                        placeholder='Enter server logo'
                    />
                    <input type='submit' value='Create' />
                </form>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        joinServer();
                    }}>
                    <input
                        type='number'
                        defaultValue={channelName}
                        onChange={(e) => setServerId(+e.target.value)}
                        placeholder='Enter server id'
                    />
                    <input type='submit' value='Create' />
                </form>
            </Modal>
            <div
                className={'scrollIssue'}
                style={{
                    height: '100vh',
                    borderRight: 0,
                    padding: 0,
                    width: '70px',
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    overflowY: 'scroll',
                }}>
                <CustomLimage key={0} />
                {props.servers.map((object: ServerResponse, i: number) => (
                    <CustomLimage obj={object} key={object.server.id} />
                ))}
                <Tooltip
                    mouseLeaveDelay={0.3}
                    placement='left'
                    style={{ fontSize: '32px' }}
                    title={'add a server'}>
                    <PlusOutlined
                        onMouseEnter={() => setFocus(true)}
                        onMouseLeave={() => setFocus(false)}
                        onClick={showModal}
                        className={'imgS'}
                        style={{
                            margin: '5px auto',
                            width: '100%',
                            height: '40px',
                            backgroundColor: isFocused ? '#4b4b4b' : '#353535',
                            borderRadius: '30px',
                            cursor: 'pointer',
                        }}
                    />
                </Tooltip>
            </div>
        </Sider>
    );
};
