import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import { Collapse, Dropdown, Space } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import './ChanelBar.css';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  setActiveChannel,
  setActiveVocalChannel,
  setAiChat,
} from '../redux/userSlice';
import { PeerSocketContext } from '../context/PeerSocket';
import { Channel, VocalChan } from '../types/types';
import { ServerChannels, ServerInvit } from '../Modals/Modals';
import { DropdownMenu } from '../DropdownMenu/DropdownMenu';
import { ChannelCollapse } from '../ChannelCollapse/ChannelCollapse';
import { NotificationsContext } from '../context/NotificationsContext';
import ServerParamsModal from '../Modals/ServerParamsModal';
import { ProfileCall } from '../components/ProfileCall';
import { VocalChannelContext } from '../components/VocalChannel';

export const ChanelBar = (props: {
  vocalChannelList: VocalChan[];
  textChannelList: Channel[];
  setTextChannelList: React.Dispatch<React.SetStateAction<Channel[]>>;
  setVocalChannelList: React.Dispatch<React.SetStateAction<VocalChan[]>>;
  handleLeaveServer: () => void;
  servers: any;
}) => {
  const {
    handleLeaveServer,
    vocalChannelList,
    textChannelList,
    setTextChannelList,
    setVocalChannelList,
    servers,
  } = props;
  const activeServer = useAppSelector(
    (state) => state.userReducer.activeServer
  );
  const activeServerName = useAppSelector(
    (state) => state.userReducer.activeServerName
  );
  const activeChannel = useAppSelector(
    (state) => state.userReducer.activeChannel
  );
  const isAiChat = useAppSelector((state) => state.userReducer.aiChat);
  const { socket } = useContext(PeerSocketContext);
  const { addNotification } = useContext(NotificationsContext);
  const dispatch = useAppDispatch();
  const serverName: string = activeServerName ?? 'Serveur';
  const { me } = useAppSelector((state) => state.userReducer);
  const { isStreamInitialized } = useContext(VocalChannelContext);

  const activeVocalChannel = useAppSelector(
    (state) => state.userReducer.activeVocalChannel
  );

  const isHome = useAppSelector((state) => state.userReducer.home);

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
          //   //console.log(res.data.text[0]);
          if (res.data.text.length > 0) {
            dispatch(setActiveChannel(res.data.text[0].id));
          }
        });
  }, [activeServer, dispatch, setTextChannelList, setVocalChannelList]);

  const onChange = (key: any) => {};
  const onTextChannelClick = (id: number) => {
    dispatch(setActiveChannel(id));
  };

  const onVocalChannelClick = useCallback(
    async (id: number) => {
      if (activeVocalChannel === id) return;
      dispatch(setActiveVocalChannel(id));
    },
    [activeVocalChannel, dispatch]
  );

  const handleJoinVocal = useCallback(
    (data: { user: number; chan: number }) => {
      const { user, chan } = data;
      if (
        chan === activeVocalChannel &&
        isStreamInitialized &&
        user !== me?.id
      ) {
        new Audio('/task-completed-message-ringtone.mp3').play();
      }

      setVocalChannelList((prevState) => {
        return prevState.map((c) => {
          if (c.id === chan) {
            return { ...c, users: [...c.users, user] };
          }
          return c;
        });
      });
    },
    [activeVocalChannel, me, setVocalChannelList, isStreamInitialized]
  );

  const handleLeftVocal = useCallback(
    (data: { user: number; chan: number }) => {
      const { user, chan } = data;
      // console.log('lol');
      if (chan === activeVocalChannel) {
        new Audio('/abduction-265.mp3').play();
      }
      setVocalChannelList((prevState) => {
        return prevState.map((c) => {
          if (c.id === chan) {
            return { ...c, users: c.users.filter((u) => u !== user) };
          }
          return c;
        });
      });
    },
    [activeVocalChannel, setVocalChannelList]
  );

  useEffect(() => {
    socket.on(`joiningvocal`, handleJoinVocal);
    socket.on(`leftvocal`, handleLeftVocal);
    // socket.on(`leftvocal`, (data: { user: number; chan: number }) => {
    //   console.log(data);
    // });
    return () => {
      socket.off(`joiningvocal`, handleJoinVocal);
      socket.off(`leftvocal`, handleLeftVocal);
    };
  }, [socket, handleJoinVocal, handleLeftVocal]);

  const handleTextChannelCreated = useCallback(
    (chan: Channel) => {
      setTextChannelList((prevState) => [...prevState, chan]);
    },
    [setTextChannelList]
  );

  const handleVocalChannelCreated = useCallback(
    (chan: VocalChan) => {
      //console.log('new voc chan', chan.name);
      setVocalChannelList((prevState) => [...prevState, chan]);
    },
    [setVocalChannelList]
  );

  const handleVocalChannelChange = useCallback(
    (chan: VocalChan) => {
      setVocalChannelList((prevState) =>
        prevState.map((c) => {
          if (c.id === chan.id) {
            return chan;
          }
          return c;
        })
      );
    },
    [setVocalChannelList]
  );

  const handleTextChannelChange = useCallback(
    (chan: Channel) => {
      //console.log(chan);
      setTextChannelList((prevState) =>
        prevState.map((c) => {
          if (c.id === chan.id) {
            return chan;
          }
          return c;
        })
      );
    },
    [setTextChannelList]
  );

  const handleVocalChannelDelete = useCallback(
    (chan: number) => {
      if (chan === activeVocalChannel) {
        dispatch(setActiveVocalChannel(0));
      }
      setVocalChannelList((prevState) =>
        prevState.filter((c) => c.id !== chan)
      );
    },
    [activeVocalChannel, dispatch, setVocalChannelList]
  );

  const handleTextChannelDelete = useCallback(
    (chan: number) => {
      if (chan === activeChannel) {
        if (textChannelList.length <= 1) {
          dispatch(setActiveChannel(0));
        } else {
          const other = textChannelList.find((c) => c.id !== chan);
          if (!other) return;
          dispatch(setActiveChannel(other.id));
        }
      }
      setTextChannelList((prevState) => prevState.filter((c) => c.id !== chan));
    },
    [activeChannel, textChannelList, dispatch, setTextChannelList]
  );

  useEffect(() => {
    socket.on(
      `textchannelcreated:server${activeServer}`,
      handleTextChannelCreated
    );
    socket.on(
      `vocalchannelcreated:server${activeServer}`,
      handleVocalChannelCreated
    );
    socket.on(
      `textchannelchange:server${activeServer}`,
      handleTextChannelChange
    );
    socket.on(
      `vocalchannelchange:server${activeServer}`,
      handleVocalChannelChange
    );
    socket.on(
      `vocalchannelchange:server${activeServer}`,
      handleVocalChannelDelete
    );
    socket.on(`vocalchanneldelete`, handleVocalChannelDelete);
    socket.on(
      `textchanneldelete:server${activeServer}`,
      handleTextChannelDelete
    );

    return () => {
      socket.off(
        `textchannelcreated:server${activeServer}`,
        handleTextChannelCreated
      );
      socket.off(
        `vocalchannelcreated:server${activeServer}`,
        handleVocalChannelCreated
      );
      socket.off(
        `textchannelchange:server${activeServer}`,
        handleTextChannelChange
      );
      socket.off(
        `vocalchannelchange:server${activeServer}`,
        handleVocalChannelChange
      );
      socket.off(`vocalchanneldelete`, handleVocalChannelDelete);
      socket.off(
        `textchanneldelete:server${activeServer}`,
        handleTextChannelDelete
      );
    };
  }, [
    socket,
    activeServer,
    handleVocalChannelDelete,
    handleTextChannelDelete,
    handleTextChannelChange,
    handleTextChannelCreated,
    handleVocalChannelChange,
    handleVocalChannelCreated,
  ]);

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

  const handleCreateChannel = (isVocal: any) => {
    //console.log(isVocal, 'rcvghjbknl', newTextChannelName);
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

  return (
    <div
      style={{ width: '100%', height: '100vh', backgroundColor: '#2F3136' }}
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
        servers={servers}
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
          <ul style={{ cursor: 'pointer' }} onClick={(e) => e.preventDefault()}>
            <Space style={{ paddingLeft: 0 }}>
              <div
                style={{
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '200px',
                  margin: '5px 0 0 0',
                  cursor: 'pointer',
                }}
                className='serverName'
              >
                <div style={{ fontWeight: 'bold' }}>
                  {serverName.charAt(0).toUpperCase() + serverName.slice(1)}
                </div>
                <div onClick={() => setmenuState(!stateMenu)}>
                  {stateMenu ? (
                    <DownOutlined
                      style={{ fontSize: '15px', fontWeight: 'bolder' }}
                    />
                  ) : (
                    <CloseOutlined
                      style={{ fontSize: '15px', fontWeight: 'bolder' }}
                    />
                  )}
                </div>
              </div>
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
          borderTop: '1px solid rgba(26, 26, 26, 0.67)',
        }}
      >
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
      <ProfileCall
        activeServerName={activeServerName}
        vocalChannelList={vocalChannelList}
      />
    </div>
  );
};

export default ChanelBar;
