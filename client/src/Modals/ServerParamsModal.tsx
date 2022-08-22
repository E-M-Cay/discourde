import { CloseOutlined } from '@ant-design/icons';
import { Modal, Typography, Input, Button, Tooltip, Avatar } from 'antd';
import axios from 'axios';
import { useContext, useState } from 'react';
import { NotificationsContext } from '../context/NotificationsContext';
import { useAppSelector } from '../redux/hooks';
import { Channel, VocalChan } from '../types/types';
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
  servers: any;
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
  let tmp = servers.find((server: any) => server.server.id === activeServer);
  const activeServerObject = tmp.server;
  console.log(activeServerObject, 'activeServerObject');
  const { addNotification } = useContext(NotificationsContext);
  const [newTextChannelName, setNewTextChannelName] = useState('');
  const [pictureLink, setPictureLink] = useState(activeServerObject.main_img);
  const [serverName, setServerName] = useState(activeServerObject.name);

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
            type: 'success',
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
        console.log(res);
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

  return (
    <Modal
      visible={isModalVisibleParams}
      onOk={() => handleOk()}
      onCancel={() => handleCancel()}
      closable={false}
      footer={null}
    >
      <Typography.Title level={4}>Paramètres du serveur</Typography.Title>
      <Typography.Title level={5}>Channel Textuel</Typography.Title>
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
            <Button
              type='primary'
              onClick={() => handleUpdateChannel(modifingChannel, false)}
            >
              Modifier
            </Button>
            <Button type='primary' onClick={() => setIsModify(0)}>
              Annuler
            </Button>
            <Tooltip title='Supprimer le serveur'>
              <Button
                shape='circle'
                className='DelFriendBtton'
                icon={<CloseOutlined />}
                danger
                onClick={() => handleDeleteChannel(Number(channel.id), false)}
              />
            </Tooltip>
          </div>
        ) : (
          <div
            key={channel.id}
            onClick={() => handleModifyChannelText(channel)}
          >
            <div>
              <span>{channel.name}</span>
              <span>{channel.hidden ? 'Caché' : 'Public'}</span>
            </div>
            <div></div>
          </div>
        )
      )}
      <Typography.Title level={5}>Channel Audio</Typography.Title>
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
            <Button
              type='primary'
              onClick={() => handleUpdateChannel(modifingChannel, true)}
            >
              Modifier
            </Button>
            <Button type='primary' onClick={() => setIsModifyVoc(0)}>
              Annuler
            </Button>
            <Tooltip title='Supprimer le canal'>
              <Button
                shape='circle'
                className='DelFriendBtton'
                icon={<CloseOutlined />}
                danger
                onClick={() => handleDeleteChannel(Number(channel.id), true)}
              />
            </Tooltip>
          </div>
        ) : (
          <div key={channel.id} onClick={() => handleModifyChannelVoc(channel)}>
            <div>
              <span>{channel.name}</span>
              <span>{channel.hidden ? 'Caché' : 'Public'}</span>
            </div>
            <div></div>
          </div>
        )
      )}
      <div>
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
            onChange={(e) => setServerName(e.target.value)}
          />
        </div>
        <div style={{ marginTop: '30px', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {serverPng.map((png, key) => (
              <>
                <Avatar
                  style={{
                    margin: '5px',
                    border: png === pictureLink ? '4px solid green' : '',
                  }}
                  onClick={() => setPictureLink(png)}
                  size={png === pictureLink ? 60 : 50}
                  src={png}
                />
                {key === 4 && <br />}
              </>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ServerParamsModal;
