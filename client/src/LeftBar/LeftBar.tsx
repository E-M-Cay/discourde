import Sider from 'antd/lib/layout/Sider';
import axios from 'axios';
import React, { useCallback, useContext } from 'react';
import { CustomLimage } from '../CustomLi/CustomLi';
import fake from '../mock';
import { Image, Typography, Tooltip } from 'antd';

import { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { useAppSelector } from '../redux/hooks';
import { setServers } from 'dns';
import { Server, ServerResponse } from '../types/types';
import { serverPng } from '../profilePng/profilePng';
import { PeerSocketContext } from '../context/PeerSocket';
import { truncate } from 'fs';

export const LeftBar = (props: {
  servers: ServerResponse[];
  setServers: React.Dispatch<React.SetStateAction<ServerResponse[]>>;
}) => {
  const { servers, setServers } = props;
  const { socket } = useContext(PeerSocketContext);

  const [channelName, setChannelName] = useState('');

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
        setIsModalVisible(false);

        props.setServers((prevServerList) => {
          return [...prevServerList, res.data];
        });
        let audio = new Audio('/upset-sound-tone.mp3');
        audio.play();
      });
  };

  const handleServerUpdate = useCallback(
    (server: Server) => {
      setServers((prevState) => {
        return prevState.map((serv) => {
          if (serv.id === server.id) {
            return { ...serv, logo: server.main_img, name: server.name };
          }
          return serv;
        });
      });
    },
    [setServers]
  );

  useEffect(() => {
    socket.on('serverupdated', handleServerUpdate);
    return () => {
      socket.off('serverupdated', handleServerUpdate);
    };
  }, [socket, handleServerUpdate]);

  return (
    <Sider className='site-layout-background'>
      <Modal
        title='Basic Modal'
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <form onSubmit={(e) => createServer(e)}>
          <input
            type='text'
            defaultValue={serverName}
            onChange={(e) => setServerName(e.target.value)}
            placeholder='Enter server name'
          />
          <select
            name='pictures'
            onChange={(e) => setServerLogo(e.target.value)}
            id='pictures'
          >
            {serverPng.map((png, key) => (
              <option key={key} value={png || 'pipi'}>
                {key < 10
                  ? 'men ' + (Number(key) + 1)
                  : 'women ' + (Number(key) + 1)}
              </option>
            ))}
          </select>
          <input type='submit' value='Create' />
        </form>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            joinServer();
          }}
        >
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
          paddingTop: '7px',
          paddingLeft: '7px',
          width: '87px',
          flexWrap: 'wrap',
          overflowY: 'scroll',
          backgroundColor: '#202225',
        }}
      >
        <CustomLimage key={0} />
        {props.servers.map((server: ServerResponse) => (
          <CustomLimage obj={server} key={server.server.id} />
        ))}
        <Tooltip
          mouseLeaveDelay={0.3}
          placement='left'
          style={{ fontSize: '32px' }}
          title={'Créer un serveur'}
        >
          <PlusOutlined
            onMouseEnter={() => setFocus(true)}
            onMouseLeave={() => setFocus(false)}
            onClick={showModal}
            className={'imgS'}
            style={{
              margin: '7px auto',
              width: '60px',
              height: '60px',
              backgroundColor: isFocused ? '#4b4b4b' : '#353535',
              borderRadius: '30px',
              cursor: 'pointer',
              fontSize: '40px',
              padding: '10px',
              color: 'lightgreen',
            }}
          />
        </Tooltip>
      </div>
    </Sider>
  );
};
