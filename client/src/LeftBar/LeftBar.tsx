import Sider from 'antd/lib/layout/Sider';
import axios from 'axios';
import React, { useCallback, useContext } from 'react';
import { CustomLimage } from '../CustomLi/CustomLi';
import { Tooltip, Avatar, Input } from 'antd';

import { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { Server, ServerResponse } from '../types/types';
import { serverPng } from '../profilePng/profilePng';
import { PeerSocketContext } from '../context/PeerSocket';

export const LeftBar = (props: {
  servers: ServerResponse[];
  setServers: React.Dispatch<React.SetStateAction<ServerResponse[]>>;
}) => {
  const { setServers } = props;
  const { socket } = useContext(PeerSocketContext);

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
  const [serverLogo, setServerLogo] = useState('/profile-pictures/crane1.png');
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
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <form onSubmit={(e) => createServer(e)}>
          <br />
          <div
            style={{
              paddingTop: '10px',
              maxWidth: '80%',
              display: 'flex',
              justifyContent: 'space-between',
              margin: 'auto',
            }}
          >
            <label htmlFor='registerUsername'>Server name</label>

            <Input
              placeholder='Enter server name'
              style={{
                maxWidth: '50%',
              }}
              id='registerUsername'
              onChange={(e) => setServerName(e.target.value)}
            />
          </div>
          {/* <select
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
          </select> */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '20px',
              alignItems: 'center',
            }}
          >
            {serverPng.map((png, key) => (
              <>
                <Avatar
                  style={{
                    margin: '5px',
                    boxSizing: 'border-box',
                    border: png === serverLogo ? '4px solid green' : '',
                  }}
                  onClick={() => setServerLogo(png)}
                  size={50}
                  src={png}
                />
                {key === 4 && <br />}
              </>
            ))}
          </div>
          <br />
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              paddingBottom: '20px',
            }}
          >
            <input
              style={{
                borderRadius: 0,
                border: 0,
                padding: '3px 10px',
                color: 'grey',
                fontSize: '1.1rem',
                backgroundColor: '#40444b',
              }}
              type='submit'
              value='Create'
            />
          </div>
        </form>
        {/* <form
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
        </form> */}
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
