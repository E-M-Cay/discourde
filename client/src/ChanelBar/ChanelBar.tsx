import {
  AudioMutedOutlined,
  AudioOutlined,
  CloseOutlined,
  CustomerServiceOutlined,
  DownOutlined,
  PhoneOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Card,
  Collapse,
  Dropdown,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import './ChanelBar.css';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setActiveChannel, setActiveVocalChannel } from '../redux/userSlice';
import { PeerSocketContext } from '../context/PeerSocket';
import { Channel, VocalChan } from '../types/types';
import { CustomImage } from '../CustomLi/CustomLi';
import { ServerChannels, ServerInvit } from '../Modals/Modals';
import { DropdownMenu } from '../DropdownMenu/DropdownMenu';
import { ChannelCollapse } from '../ChannelCollapse/ChannelCollapse';
import { openNotification } from '../notificationHandler/notificationHandler';
import { NotificationsContext } from '../context/NotificationsContext';
import ServerParamsModal from '../Modals/ServerParamsModal';

const { Panel } = Collapse;

export const ChanelBar = (props: { handleLeaveServer: () => void }) => {
  const { handleLeaveServer } = props;
  const activeServer = useAppSelector(
    (state) => state.userReducer.activeServer
  );
  const activeServerName = useAppSelector(
    (state) => state.userReducer.activeServerName
  );
  const { socket } = useContext(PeerSocketContext);
  const { notifications, addNotification } = useContext(NotificationsContext);
  const dispatch = useAppDispatch();
  const headerTxt: string = 'SALONS TEXTUELS';
  const headerVoc: string = 'SALONS VOCAUX';
  const serverName: string = activeServerName ?? 'Serveur';
  const [vocalChannelList, setVocalChannelList] = useState<VocalChan[]>([]);
  const [textChannelList, setTextChannelList] = useState<Channel[]>([]);
  const activeVocalChannel = useAppSelector(
    (state) => state.userReducer.activeVocalChannel
  );

  const isHome = useAppSelector((state) => state.userReducer.home);

  const { Panel } = Collapse;

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
          //   console.log(res.data.text[0]);
          if (res.data.text.length > 0) {
            dispatch(setActiveChannel(res.data.text[0].id));
          }
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
    },
    [activeVocalChannel, dispatch]
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

  const handleTextChannelCreated = (chan: Channel) => {
    setTextChannelList((prevState) => [...prevState, chan]);
  };

  const handleVocalChannelCreated = (chan: VocalChan) => {
    console.log('new voc chan', chan.name);
    setVocalChannelList((prevState) => [...prevState, chan]);
  };
  const handleVocalChannelChange = (chan: VocalChan) => {
    setVocalChannelList((prevState) =>
      prevState.map((c) => {
        if (c.id === chan.id) {
          return chan;
        }
        return c;
      })
    );
  };

  const handleTextChannelChange = (chan: Channel) => {
    console.log(chan);
    setTextChannelList((prevState) =>
      prevState.map((c) => {
        if (c.id === chan.id) {
          return chan;
        }
        return c;
      })
    );
  };

  const handleVocalChannelDelete = useCallback(
    (chan: number) => {
      if (chan === activeVocalChannel) {
        dispatch(setActiveVocalChannel(0));
      }
      setVocalChannelList((prevState) =>
        prevState.filter((c) => c.id !== chan)
      );
    },
    [activeVocalChannel, dispatch]
  );

  const handleTextChannelDelete = useCallback(
    (chan: number) => {
      if (chan === activeVocalChannel) {
      }
      setTextChannelList((prevState) => prevState.filter((c) => c.id !== chan));
    },
    [activeVocalChannel, dispatch]
  );

  useEffect(() => {
    socket?.on(
      `textchannelcreated:server${activeServer}`,
      handleTextChannelCreated
    );
    socket?.on(
      `vocalchannelcreated:server${activeServer}`,
      handleVocalChannelCreated
    );
    socket?.on(
      `textchannelchange:server${activeServer}`,
      handleTextChannelChange
    );
    socket?.on(
      `vocalchannelchange:server${activeServer}`,
      handleVocalChannelChange
    );
    socket?.on(
      `vocalchannelchange:server${activeServer}`,
      handleVocalChannelDelete
    );
    socket?.on(`vocalchanneldelete`, handleVocalChannelDelete);
    socket?.on(
      `textchanneldelete:server${activeServer}`,
      handleTextChannelDelete
    );

    return () => {
      socket?.off(
        `textchannelcreated:server${activeServer}`,
        handleTextChannelCreated
      );
      socket?.off(
        `vocalchannelcreated:server${activeServer}`,
        handleVocalChannelCreated
      );
      socket?.off(
        `textchannelchange:server${activeServer}`,
        handleTextChannelChange
      );
      socket?.off(
        `vocalchannelchange:server${activeServer}`,
        handleVocalChannelChange
      );
      socket?.off(`vocalchanneldelete`, handleVocalChannelDelete);
      socket?.off(
        `textchanneldelete:server${activeServer}`,
        handleTextChannelDelete
      );
    };
  }, [socket, activeServer, handleVocalChannelDelete]);

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
  const showServerParamsModal = () => {
    setIsModalVisibleParams(true);
  };

  const handleOk3 = () => {
    setIsModalVisibleParams(false);
  };

  const handleCancel3 = () => {
    console.log('cancel');
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
            server: activeServer,
            hidden: isAdminChannel,
          },
          {
            headers: {
              access_token: localStorage.getItem('token') as string,
            },
          }
        )
        .then((res) => {
          if ((res.status = 204)) {
            setNewTextChannelName('');
            addNotification({
              type: 'success',
              title: 'success',
              content: 'Channel created',
              isTmp: true,
            });
          }
          let audio = new Audio('/upset-sound-tone.mp3');
          audio.play();
          // setNotifications(...notifications);
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

  const deleteServer = useCallback(() => {
    axios.delete(`/server/delete_server/${activeServer}`, {
      headers: {
        access_token: localStorage.getItem('token') as string,
      },
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
      showServerParamsModal={showServerParamsModal}
      showModal={showModal}
      deleteServer={deleteServer}
      handleLeaveServer={handleLeaveServer}
    />
  );

  const me = useAppSelector((state) => state.userReducer.me);

  return (
    <div
      style={{ width: '100%', backgroundColor: '#1F1F1F' }}
      className='site-layout-background'
    >
      <ServerParamsModal
        isModalVisibleParams={isModalVisibleParams}
        textChannelList={textChannelList}
        isModify={isModify}
        setModifingChannel={setModifingChannel}
        modifingChannel={modifingChannel}
        setIsModify={setIsModify}
        handleModifyChannelText={handleModifyChannelText}
        vocalChannelList={vocalChannelList}
        isModifyVoc={isModifyVoc}
        setIsModifyVoc={setIsModifyVoc}
        handleModifyChannelVoc={handleModifyChannelVoc}
        setTextChannelList={setTextChannelList}
        setVocalChannelList={setVocalChannelList}
        setIsModalVisibleParams={setIsModalVisibleParams}
      />
      <ServerInvit
        isModalVisibleInvitation={isModalVisibleInvitation}
        handleOk2={handleOk2}
        handleCancel2={handleCancel2}
        handleLinkCreation={handleLinkCreation}
        serverId={activeServer || -1}
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
              <p style={{ color: 'white' }} className='serverName'>
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
        }}
      >
        {!isHome && (
          <ChannelCollapse
            textChannelList={textChannelList}
            vocalChannelList={vocalChannelList}
            onTextChannelClick={onTextChannelClick}
            onVocalChannelClick={onVocalChannelClick}
            activeVocalChannel={activeVocalChannel || null}
          />
        )}
      </div>
      <div style={{ backgroundColor: '#353535' }}>
        <Card
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Avatar
                size={30}
                src={
                  me?.picture ||
                  'https://randomuser.me/api/portraits/women/1.jpg'
                }
              />
              <Typography>{me?.username || 'random'}</Typography>
              <div></div>
            </div>
          }
          extra={
            <a href='#'>
              <Tooltip placement='top' title={'Paramètres utilisateur'}>
                <SettingOutlined
                  style={{
                    color: 'darkgrey',
                    fontSize: 'large',
                  }}
                />
              </Tooltip>
            </a>
          }
          style={{ backgroundColor: '#353535', border: 0 }}
        >
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
          {activeVocalChannel ? (
            <Tooltip placement='top' className='microOff' title={'raccrochage'}>
              <PhoneOutlined
                onClick={() => dispatch(setActiveVocalChannel(0))}
              />
            </Tooltip>
          ) : (
            ''
          )}
        </Card>
      </div>
    </div>
  );
};

export default ChanelBar;
