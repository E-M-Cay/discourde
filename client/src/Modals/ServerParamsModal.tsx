import { EditOutlined } from '@ant-design/icons';
import { Modal, Typography, Input, Avatar, Divider } from 'antd';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { NotificationsContext } from '../context/NotificationsContext';
import { useAppSelector } from '../redux/hooks';
import { Channel, ServerResponse, VocalChan } from '../types/types';
import { serverPng } from '../profilePng/profilePng';

const ServerParamsModal = (props: {
  isModalVisibleParams: boolean;
  textChannelList: Channel[];
  vocalChannelList: VocalChan[];
  isModify: number;
  setModifingChannel: Function;
  modifingChannel: any;
  setIsModify: Function;
  handleModifyChannelText: Function;
  isModifyVoc: number;
  setIsModifyVoc: Function;
  handleModifyChannelVoc: Function;
  setIsModalVisibleParams: React.Dispatch<React.SetStateAction<boolean>>;
  setTextChannelList: React.Dispatch<React.SetStateAction<Channel[]>>;
  setVocalChannelList: React.Dispatch<React.SetStateAction<VocalChan[]>>;
  servers: ServerResponse[];
}) => {
  const {
    isModalVisibleParams,
    textChannelList,
    isModify,
    setModifingChannel,
    modifingChannel,
    setIsModify,
    handleModifyChannelText,
    vocalChannelList,
    isModifyVoc,
    setIsModifyVoc,
    handleModifyChannelVoc,
    setIsModalVisibleParams,
    setVocalChannelList,
    setTextChannelList,
    servers,
  } = props;

  const activeServer = useAppSelector(
    (state) => state.userReducer.activeServer
  );
  let tmp = servers.find((server) => server.server.id === activeServer);
  const activeServerObject = tmp?.server;
  // //console.log(activeServerObject, 'activeServerObject');
  const { addNotification } = useContext(NotificationsContext);
  const [newTextChannelName, setNewTextChannelName] = useState('');
  const [pictureLink, setPictureLink] = useState(
    activeServerObject ? activeServerObject.main_img : ''
  );
  const [serverName, setServerName] = useState(
    activeServerObject ? activeServerObject.name : ''
  );

  // console.log(activeServerObject, pictureLink, 'activeServerObject');

  const handleOk = () => {
    setIsModalVisibleParams(false);
  };

  const handleCancel = () => {
    setIsModalVisibleParams(false);
  };

  const handleUpdateChannel = (chan: Channel | VocalChan, isVocal: boolean) => {
    axios
      .put(
        `/channel/${isVocal ? 'vocal' : 'text'}/${
          chan.id
        }/server/${activeServer}`,
        chan,
        {
          headers: {
            access_token: localStorage.getItem('token') as string,
          },
        }
      )
      .then((res) => {
        if (res.status === 204) {
          setIsModify(0);

          addNotification({
            title: 'success',
            content: 'Channel updated',
          });
          setNewTextChannelName('');
          setIsModalVisibleParams(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteChannel = (channelId: number, isVocal: boolean) => {
    axios
      .delete(
        `/channel/${
          isVocal ? 'vocal' : 'text'
        }/${channelId}/server/${activeServer}`,
        {
          headers: {
            access_token: localStorage.getItem('token') as string,
          },
        }
      )
      .then((res) => {
        //console.log(res);
        if (res.status === 200) {
          if (!isVocal) {
            setTextChannelList(
              textChannelList.filter((channel) => channel.id !== channelId)
            );
          } else {
            setVocalChannelList(
              vocalChannelList.filter((channel) => channel.id !== channelId)
            );
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdateServer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post(
        `/server/update`,
        {
          name: serverName,
          main_img: pictureLink,
          id: activeServer,
        },
        {
          headers: {
            access_token: localStorage.getItem('token') as string,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          addNotification({
            title: 'success',
            content: 'Server updated',
          });
          setIsModalVisibleParams(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Modal
      visible={isModalVisibleParams}
      onOk={() => handleOk()}
      onCancel={() => handleCancel()}
      closable={false}
      footer={null}
    >
      <Typography.Title
        style={{ textAlign: 'center', color: '#2c2c2c' }}
        level={3}
      >
        Paramètres des channels
      </Typography.Title>
      <Typography.Title style={{ color: '#2c2c2c' }} level={4}>
        Channel Textuel
      </Typography.Title>
      {textChannelList.map((channel) =>
        isModify === channel.id ? (
          <div key={channel.id}>
            <Input
              placeholder='Nom du salon'
              defaultValue={newTextChannelName}
              onChange={(e) =>
                setModifingChannel((prev: any) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                style={{
                  borderRadius: 0,
                  border: 0,
                  padding: '3px 10px',
                  color: 'grey',
                  backgroundColor: '#40444b',
                  marginTop: '10px',
                  marginRight: '10px',
                }}
                onClick={() => handleUpdateChannel(modifingChannel, false)}
              >
                Modifier
              </button>

              <button
                style={{
                  borderRadius: 0,
                  border: 0,
                  padding: '3px 10px',
                  color: 'grey',
                  backgroundColor: '#40444b',
                  marginTop: '10px',
                }}
                onClick={() => handleDeleteChannel(Number(channel.id), false)}
              >
                Supprimer
              </button>
              <button
                style={{
                  borderRadius: 0,
                  border: 0,
                  padding: '3px 10px',
                  color: 'grey',
                  backgroundColor: '#40444b',
                  marginTop: '10px',
                  marginLeft: '10px',
                }}
                onClick={() => setIsModify(0)}
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <div
            key={channel.id}
            onClick={() => handleModifyChannelText(channel)}
          >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {/* <span>
                {channel.hidden ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </span> */}
              <span
                style={{
                  fontSize: '1.2rem',
                  color: '#2c2c2c',
                  cursor: 'pointer',
                }}
              >
                {channel.name}
              </span>
              <div
                style={{
                  paddingLeft: '5px',
                  marginBottom: '5px',
                  color: '#2c2c2c',
                  cursor: 'pointer',
                }}
              >
                <EditOutlined />
              </div>
            </div>
            <div></div>
          </div>
        )
      )}
      <Typography.Title style={{ color: '#2c2c2c' }} level={4}>
        Channel Audio
      </Typography.Title>

      {vocalChannelList.map((channel: VocalChan) =>
        isModifyVoc === channel.id ? (
          <div key={channel.id}>
            <Input
              placeholder='Nom du salon'
              defaultValue={channel.name}
              onChange={(e) =>
                setModifingChannel((prev: any) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                style={{
                  borderRadius: 0,
                  border: 0,
                  padding: '3px 10px',
                  color: 'grey',
                  backgroundColor: '#40444b',
                  marginTop: '10px',
                  marginRight: '10px',
                }}
                onClick={() => handleUpdateChannel(modifingChannel, true)}
              >
                Modifier
              </button>

              <button
                style={{
                  borderRadius: 0,
                  border: 0,
                  padding: '3px 10px',
                  color: 'grey',
                  backgroundColor: '#40444b',
                  marginTop: '10px',
                }}
                onClick={() => handleDeleteChannel(Number(channel.id), true)}
              >
                Supprimer
              </button>
              <button
                style={{
                  borderRadius: 0,
                  border: 0,
                  padding: '3px 10px',
                  color: 'grey',
                  backgroundColor: '#40444b',
                  marginTop: '10px',
                  marginLeft: '10px',
                }}
                onClick={() => setIsModifyVoc(0)}
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          // <div key={channel.id} onClick={() => handleModifyChannelVoc(channel)}>
          //   <div>
          //     <span>{channel.name}</span>
          //     {/* <span>{channel.hidden ? 'Caché' : 'Public'}</span> */}
          //     <EditOutlined style={{ paddingLeft: '5px' }} />
          //   </div>
          //   <div></div>
          // </div>
          <div
            key={channel.id}
            onClick={() => handleModifyChannelVoc(channel)}
            style={{}}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {/* <span>
              {channel.hidden ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </span> */}

              <span
                style={{
                  fontSize: '1.2rem',
                  color: '#2c2c2c',
                  cursor: 'pointer',
                }}
              >
                {channel.name}
              </span>
              <div
                style={{
                  paddingLeft: '5px',
                  marginBottom: '5px',
                  color: '#2c2c2c',
                  cursor: 'pointer',
                }}
              >
                <EditOutlined />
              </div>
            </div>
            <div></div>
          </div>
        )
      )}
      <Divider style={{ borderTop: '1px solid #2c2c2c' }} />
      <Typography.Title
        style={{ textAlign: 'center', color: '#2c2c2c' }}
        level={3}
      >
        Paramètres du serveur
      </Typography.Title>
      <br />
      <form onSubmit={(e) => handleUpdateServer(e)}>
        <div
          style={{
            maxWidth: '80%',
            display: 'flex',
            justifyContent: 'space-between',
            margin: 'auto',
          }}
        >
          <label htmlFor='serverName'>Server name</label>

          <Input
            style={{ maxWidth: '50%' }}
            placeholder='Server name'
            id='serverName'
            defaultValue={serverName}
            onChange={(e) => setServerName(e.target.value)}
          />
        </div>
        <div style={{ marginTop: '20px', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {serverPng.map((png, key) => (
              <React.Fragment key={key}>
                <Avatar
                  style={{
                    margin: '5px',
                    boxSizing: 'border-box',
                    border:
                      png === pictureLink
                        ? '3px solid lightgreen'
                        : '3px solid transparent',
                  }}
                  onClick={() => setPictureLink(png)}
                  size={55}
                  src={png}
                />
                {key === 4 && <br />}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <input
            style={{
              borderRadius: 0,
              border: 0,
              padding: '3px 10px',
              color: 'grey',
              backgroundColor: '#40444b',
              marginTop: '30px',
            }}
            type='submit'
            value='Modifier'
          />
        </div>
      </form>
    </Modal>
  );
};

export default ServerParamsModal;
