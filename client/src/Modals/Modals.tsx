import {
  Alert,
  Avatar,
  Button,
  Checkbox,
  Input,
  Modal,
  Tooltip,
  Typography,
} from 'antd';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { UserMapsContext } from '../context/UserMapsContext';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { Channel, User, VocalChan } from '../types/types';
import logo from '../assets/discourde.png';
import { CloseOutlined } from '@ant-design/icons';
import { setIsConnected, setMe } from '../redux/userSlice';
import { PeerSocketContext } from '../context/PeerSocket';

export const ServerInvit = (props: {
  isModalVisibleInvitation: boolean;
  handleOk2: Function;
  handleCancel2: Function;
  handleLinkCreation: Function;
  serverId: number;
}) => {
  const {
    isModalVisibleInvitation,
    handleOk2,
    handleCancel2,
    handleLinkCreation,
    serverId,
  } = props;
  const { friendMap } = useContext(UserMapsContext);
  const handleInviteUser = (hisId: number) => {
    axios
      .post(
        'serverinvitation/createInvitation',
        {
          invitedUserId: hisId,
          server: serverId,
        },
        {
          headers: {
            access_token: localStorage.getItem('token') as string,
          },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Modal
      visible={isModalVisibleInvitation}
      onOk={() => handleOk2()}
      onCancel={() => handleCancel2()}
      closable={false}
      footer={null}
    >
      <div style={{ minHeight: '500px' }}>
        <Button onClick={(e) => handleLinkCreation()}>créer lien</Button>
        <>
          <Typography.Title level={4}>Inviter un ami</Typography.Title>
          {Array.from(friendMap.entries()).map(([id, friendShip]) => {
            return (
              <div key={id}>
                <Avatar src={friendShip.friend.picture ?? logo} />
                <span>{friendShip.friend.username}</span>
                <Button onClick={() => handleInviteUser(id)} type='primary'>
                  Inviter
                </Button>
              </div>
            );
          })}
        </>
      </div>
    </Modal>
  );
};
export const ServerChannels = (props: {
  isModalVisible: boolean;
  handleOk: Function;
  handleCancel: Function;
  setNewTextChannelName: Function;
  setIsAdminChannel: Function;
  handleCreateChannel: Function;
}) => {
  const {
    isModalVisible,
    handleOk,
    handleCancel,
    setNewTextChannelName,
    setIsAdminChannel,
    handleCreateChannel,
  } = props;
  return (
    <Modal
      visible={isModalVisible}
      onOk={() => handleOk()}
      onCancel={() => handleCancel()}
      style={{ backgroundColor: '#1F1F1F' }}
      closable={false}
      footer={null}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Input
          placeholder='Add text channel'
          onChange={(e) => setNewTextChannelName(e.target.value)}
        />
        <Checkbox onChange={(e) => setIsAdminChannel(e.target.checked)}>
          isAdmin
        </Checkbox>
        <Button type='primary' onClick={() => handleCreateChannel(false)}>
          Create
        </Button>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Input
          onChange={(e) => setNewTextChannelName(e.target.value)}
          placeholder='Add vocal channel'
        />
        <Checkbox onChange={(e) => setIsAdminChannel(e.target.checked)}>
          isAdmin
        </Checkbox>{' '}
        <Button type='primary' onClick={() => handleCreateChannel(true)}>
          Create
        </Button>
      </div>
    </Modal>
  );
};

export const UserProfileModal = (props: {
  openPrivateChat: Function;
  user: User;
}) => {
  const { openPrivateChat, user } = props;
  const { Title } = Typography;
  const activeServer = useAppSelector(
    (state) => state.userReducer.activeServer
  );
  const me = useAppSelector((state) => state.userReducer.me);
  const dispatch = useAppDispatch();
  const [userTmp, setUserTmp] = useState(me);
  const [serverNickname, setServerNickname] = useState<string>('');
  const { friendMap, sendFriendRequest } = useContext(UserMapsContext);
  const isFriend = friendMap.has(user.id);
  // console.log(user);
  const handleProfileChange = () => {
    if (userTmp?.username || userTmp?.picture) {
      axios
        .post(
          'user/update',
          {
            picture: userTmp.picture,
            username: userTmp.username,
          },
          {
            headers: {
              access_token: localStorage.getItem('token') as string,
            },
          }
        )
        .then((res) => {
          dispatch(setMe(res.data));
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (serverNickname.length > 0) {
      axios
        .post(
          'server/updatenickname',
          {
            idserver: activeServer,
            nickname: serverNickname,
          },
          {
            headers: {
              access_token: localStorage.getItem('token') as string,
            },
          }
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setServerNickname('');
        });
    }
  };
  return (
    <div style={{ height: '120px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '39%' }}>
          <Avatar size={64} src={user.picture ?? logo} />
        </div>
        <Title style={{ color: 'darkgrey', width: '30%' }} level={2}>
          {user.username}
        </Title>
        <div style={{ color: 'darkgrey', width: '30%' }}></div>
      </div>
      <div
        style={{
          marginTop: '10px',
          display: 'flex',
          justifyContent: 'space-around',
        }}
      >
        {isFriend === false && me?.id !== user.id ? (
          <button
            style={{
              borderRadius: 0,
              border: 0,
              marginTop: '20px',
              padding: '7px 10px',
              color: 'darkgrey',
              backgroundColor: '#40444b',
              width: '150px',
              fontWeight: 'bold',
            }}
            onClick={() => sendFriendRequest(user)}
          >
            Add as friend
          </button>
        ) : me?.id !== user.id ? (
          <Typography>You are friends</Typography>
        ) : null}
        {me?.id !== user.id && (
          <button
            style={{
              borderRadius: 0,
              border: 0,
              marginTop: '20px',
              padding: '7px 10px',
              color: 'darkgrey',
              backgroundColor: '#40444b',
              width: '150px',
              fontWeight: 'bold',
            }}
            onClick={() => openPrivateChat(user)}
          >
            Message
          </button>
        )}
        {me?.id === user.id && (
          <>
            <Input
              type={'text'}
              defaultValue={user.username}
              onChange={(e) => {
                setUserTmp({
                  ...user,
                  username: e.target.value,
                });
              }}
              placeholder={'Change your username'}
            />

            <Input
              type={'text'}
              defaultValue={user.picture}
              onChange={(e) => {
                setUserTmp({
                  ...user,
                  picture: e.target.value,
                });
              }}
              placeholder={'Change your picture'}
            />

            <Input
              type={'text'}
              onChange={(e) => {
                setServerNickname(e.target.value);
              }}
              placeholder={'Change your server nickname'}
            />

            <Button onClick={() => handleProfileChange()}>Change</Button>
          </>
        )}
      </div>
    </div>
  );
};

export const GeneralSettings = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useAppDispatch();

  const handleDisconnect = () => {
    let audio = new Audio('/engine-391.mp3');
    audio.play();
    // wait 2 seconds
    localStorage.removeItem('token');
    setTimeout(() => {
      dispatch(setIsConnected(false));
    }, 1700);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    window.onkeyup = (e) => {
      if (e.code === 'Escape') {
        showModal();
      }
    };
  }, [dispatch]);

  return (
    <>
      <Modal
        title='General Settings'
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Button onClick={() => handleDisconnect()}>Disconnect</Button>
      </Modal>
    </>
  );
};
