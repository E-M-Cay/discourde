import {
  CloseOutlined,
  MenuOutlined,
  MessageOutlined,
  CheckCircleFilled,
  PhoneOutlined,
  VideoCameraOutlined,
  UserDeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Collapse,
  Divider,
  Tabs,
  Input,
  Menu,
  Dropdown,
  Space,
  Tooltip,
  Button,
  Avatar,
  Typography,
} from 'antd';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { PeerSocketContext } from '../context/PeerSocket';
import { UserMapsContext } from '../context/UserMapsContext';
import { CustomImage, CustomImageMess } from '../CustomLi/CustomLi';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setActiveServer, setIsHome } from '../redux/userSlice';
import { User, Server, ServerResponse } from '../types/types';
import { Friendship } from '../types/types';
import './FriendPanel.css';

const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Search } = Input;

export const FriendPanel = (props: {
  setServers: React.Dispatch<React.SetStateAction<ServerResponse[]>>;
}) => {
  const { Title } = Typography;
  const { setServers } = props;
  // const me = useAppSelector((state) => state.userReducer.me);
  const {
    friendMap,
    receivedFriendRequestMap,
    sentFriendRequestMap,
    acceptFriendRequest,
    refuseFriendRequest,
    deleteFriendRequest,
    deleteFriendship,
    openPrivateChat,
  } = useContext(UserMapsContext);
  const { socket } = useContext(PeerSocketContext);
  const dispatch = useAppDispatch();

  interface ServerInvitation {
    id: number;
    sender: User;
    server: Server;
  }

  const [serverRequests, setServerRequests] = useState<ServerInvitation[]>([]);

  useEffect(() => {
    axios
      .get('serverinvitation/getinvitations', {
        headers: {
          access_token: localStorage.getItem('token') as string,
        },
      })
      .then((res) => {
        // //console.log(res, 'pépon');
        setServerRequests(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleNewServerInvitation = (newInvit: ServerInvitation) => {
    setServerRequests((prevState) => [...prevState, newInvit]);
  };

  useEffect(() => {
    socket.on('newserverinvitation', handleNewServerInvitation);
    return () => {
      socket.off('newserverinvitation', handleNewServerInvitation);
    };
  }, [handleNewServerInvitation, socket]);

  const handleAcceptServerInvitation = (
    invitationId: number,
    serverId: number
  ) => {
    axios
      .post(
        'serverinvitation/acceptInvitation',
        {
          serverInvitationId: invitationId,
          serverId: serverId,
        },
        {
          headers: {
            access_token: localStorage.getItem('token') as string,
          },
        }
      )
      .then((res) => {
        setServers((prevState) => [...prevState, res.data]);
        dispatch(setActiveServer(res.data.server.id));
        dispatch(setIsHome(false));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRefuseServerInvitation = (invitationId: number) => {
    axios
      .post(
        'serverinvitation/declineinvitation',
        {
          serverInvitationId: invitationId,
        },
        {
          headers: {
            access_token: localStorage.getItem('token') as string,
          },
        }
      )
      .then((res) => {
        // delete server invitation in the state
        setServerRequests(
          serverRequests.filter((invitation) => {
            return invitation.id !== invitationId;
          })
        );
        //console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [stateMenu, setmenuState] = useState(true);

  // const onSearch = (value: any) => //console.log(value);

  const menu = (friendship: Friendship) => {
    return (
      <Menu
        className='menuf'
        items={[
          {
            label: (
              <div onClick={() => openPrivateChat(friendship.friend)}>
                <MessageOutlined
                  style={{ color: 'green', fontSize: 'small' }}
                />{' '}
                Envoyer un message{' '}
              </div>
            ),
            key: '1',
          },
          {
            type: 'divider',
          },
          {
            label: (
              <div>
                <PhoneOutlined style={{ color: 'green', fontSize: 'small' }} />{' '}
                Démarrer un appel vocal{' '}
              </div>
            ),
            key: '2',
          },
          {
            label: (
              <div>
                <VideoCameraOutlined
                  style={{ color: 'green', fontSize: 'small' }}
                />{' '}
                Démarrer un appel vidéo{' '}
              </div>
            ),
            key: '3',
          },
          {
            type: 'divider',
          },
          {
            label: (
              <div onClick={() => deleteFriendship(friendship)}>
                <UserDeleteOutlined
                  style={{ color: 'red', fontSize: 'small' }}
                />{' '}
                Retirer l'ami{' '}
              </div>
            ),
            key: '4',
          },
        ]}
      />
    );
  };

  return (
    <div style={{ backgroundColor: '#2F3136', height: '100vh' }}>
      <Title level={4} style={{ textAlign: 'center', color: '#99a6a0' }}>
        Amis
      </Title>
      {Array.from(friendMap.entries()).find(
        ([id, friendship]) => friendship.friend.status
      ) && (
        <Title level={5} style={{ textAlign: 'center', color: '#99a6a0' }}>
          En ligne
        </Title>
      )}

      <div
        className={'scrollIssue'}
        style={{
          width: '100%',
          borderRight: 0,
          padding: 0,
          flexWrap: 'wrap',
          overflowY: 'scroll',
        }}
      >
        {Array.from(friendMap.entries()).map(([id, friendship]) =>
          friendship.friend.status ? (
            <div
              key={id}
              className='panelContent'
              style={{
                margin: 0,
                padding: 0,
                height: '8vh',
                fontWeight: 'bold',
              }}
            >
              <Divider style={{ margin: 0 }} />
              <CustomImage
                picture={friendship.friend.picture}
                username={friendship.friend.username}
                status={friendship.friend.status}
              />
              {friendship.friend.username}
              <div className='iconFriend'>
                {/*                             <a style={{ color: '#060606'}}><div><Tooltip placement="top" title={"Envoyer un message"}><MessageOutlined /></Tooltip></div></a>
                 */}{' '}
                <Dropdown
                  overlay={menu(friendship)}
                  trigger={['click']}
                  placement='bottomLeft'
                  className='DropDownFriend'
                >
                  <ul onClick={(e) => e.preventDefault()}>
                    <Space>
                      <p>
                        <a style={{ color: '#060606' }}>
                          <Tooltip placement='top' title={'Actions'}>
                            {' '}
                            <MenuOutlined />{' '}
                          </Tooltip>
                        </a>
                        <a onClick={() => setmenuState(!stateMenu)}></a>
                      </p>
                    </Space>
                  </ul>
                </Dropdown>
              </div>
            </div>
          ) : null
        )}
      </div>
      <p style={{ position: 'fixed', fontSize: 'medium' }}></p>
      {friendMap.size ? (
        <Title level={5} style={{ textAlign: 'center', color: '#99a6a0' }}>
          Tous les amis - {friendMap.size}
        </Title>
      ) : (
        <Typography
          style={{ textAlign: 'center', color: '#99a6a0', fontSize: '15px' }}
        >
          Vous n'avez aucun ami pour le moment mais l'équipe de discourde pense
          beaucoup à vous !!
        </Typography>
      )}

      <div
        className={'scrollIssue'}
        style={{
          width: '100%',
          borderRight: 0,
          padding: 0,
          flexWrap: 'wrap',
          overflowY: 'scroll',
        }}
      >
        {Array.from(friendMap.entries()).map(([id, friendship]) => (
          <div
            key={id}
            className='panelContent'
            style={{
              margin: 0,
              padding: 0,
              height: '8vh',
              fontWeight: 'bold',
            }}
          >
            <Divider style={{ margin: 0 }} />
            <CustomImage
              picture={friendship.friend.picture}
              username={friendship.friend.username}
              status={friendship.friend.status}
            />
            {friendship.friend.username}
            <div className='iconFriend'>
              {/*                             <a style={{ color: '#060606'}}><div><Tooltip placement="top" title={"Envoyer un message"}><MessageOutlined /></Tooltip></div></a>
               */}{' '}
              <Dropdown
                overlay={menu(friendship)}
                trigger={['click']}
                placement='bottomLeft'
                className='DropDownFriend'
              >
                <ul onClick={(e) => e.preventDefault()}>
                  <Space>
                    <p>
                      <a style={{ color: '#060606' }}>
                        <Tooltip placement='top' title={'Actions'}>
                          {' '}
                          <MenuOutlined />{' '}
                        </Tooltip>
                      </a>
                      <a onClick={() => setmenuState(!stateMenu)}></a>
                    </p>
                  </Space>
                </ul>
              </Dropdown>
            </div>
          </div>
        ))}
      </div>
      <Title
        level={4}
        style={{ textAlign: 'center', color: '#99a6a0', marginTop: '10px' }}
      >
        Invitations
      </Title>
      {/* <Title level={5} style={{ textAlign: 'center', color: '#99a6a0' }}>
        En attente - {receivedFriendRequestMap.size}
      </Title>
      <br />
      <br /> */}
      <div
        className={'scrollIssue'}
        style={{
          width: '100%',
          borderRight: 0,
          padding: 0,
          flexWrap: 'wrap',
          overflowY: 'scroll',
        }}
      >
        {Array.from(receivedFriendRequestMap.entries()).length ? (
          <Title level={5} style={{ textAlign: 'center', color: '#99a6a0' }}>
            Reçues
          </Title>
        ) : null}

        {Array.from(receivedFriendRequestMap.entries()).map(([id, request]) => (
          <div
            key={id}
            className='panelContent'
            style={{
              margin: 0,
              padding: 0,
              height: '8vh',
              fontWeight: 'bold',
            }}
          >
            <Divider style={{ margin: 0 }} />
            <CustomImageMess
              picture={request.sender.picture}
              nickname={request.sender.username}
            />
            {request.sender.username}
            <Tooltip title='Accepter la demande'>
              <Button
                shape='circle'
                className='AccFriendBtton'
                icon={<CheckCircleFilled />}
                danger
                onClick={() =>
                  acceptFriendRequest(request.id, request.sender.id)
                }
              />
            </Tooltip>
            <Tooltip title='Annuler la demande'>
              <Button
                shape='circle'
                className='DelFriendBtton'
                icon={<CloseOutlined />}
                danger
                onClick={() =>
                  refuseFriendRequest(request.id, request.sender.id)
                }
              />
            </Tooltip>
          </div>
        ))}

        {/* Array.from(sentFriendRequestMap.entries()).map(([id, request]) */}
        {Array.from(sentFriendRequestMap.entries()).length > 0 ? (
          <Title level={5} style={{ textAlign: 'center', color: '#99a6a0' }}>
            Envoyées
          </Title>
        ) : null}

        {Array.from(sentFriendRequestMap.entries()).map(([id, request]) => (
          <div
            key={id}
            style={{
              margin: 0,
              padding: 0,
              height: '8vh',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'end',
              color: '#b2b2b2',
            }}
          >
            {/* <Divider style={{ margin: 0 }} /> */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {' '}
              <Avatar
                src={request.receiver.picture}
                style={{ marginLeft: '20px', marginRight: '20px' }}
                size={35}
              />
              <div>
                {request.receiver.username.length > 8
                  ? request.receiver.username.substring(0, 7) + '...'
                  : request.receiver.username}
              </div>
            </div>
            <button
              onClick={() =>
                deleteFriendRequest(request.id, request.receiver.id)
              }
              style={{
                borderRadius: 0,
                border: 0,
                padding: '3px 10px',
                color: 'grey',
                backgroundColor: '#40444b',
                fontSize: '12px',
                // marginTop: '10px',
                marginLeft: '10px',
              }}
            >
              Annuler
            </button>
          </div>
        ))}
        {serverRequests.length > 0 ? (
          <Title level={5} style={{ textAlign: 'center', color: '#99a6a0' }}>
            Serveurs
          </Title>
        ) : null}
        {serverRequests.map((invitation) => (
          <div
            key={invitation.id}
            className='panelContent'
            style={{
              margin: 0,
              padding: 0,
              height: '8vh',
              fontWeight: 'bold',
            }}
          >
            <Divider style={{ margin: 0 }} />
            <CustomImageMess
              picture={invitation.sender.picture}
              nickname={invitation.sender.username}
            />
            {invitation.sender.username} vous a invité à rejoindre{' '}
            {invitation.server.name}
            <Tooltip title='Accepter la demande'>
              <Button
                shape='circle'
                className='AccFriendBtton'
                icon={<CheckCircleFilled />}
                danger
                onClick={() =>
                  handleAcceptServerInvitation(
                    invitation.id,
                    invitation.server.id
                  )
                }
              />
            </Tooltip>
            <Tooltip title='Annuler la demande'>
              <Button
                shape='circle'
                className='DelFriendBtton'
                icon={<CloseOutlined />}
                danger
                onClick={() => handleRefuseServerInvitation(invitation.id)}
              />
            </Tooltip>
          </div>
        ))}
      </div>
      {/* <p style={{ position: 'fixed', fontSize: 'medium' }}>AJOUTER UN AMI</p> */}
      {/* <br />
      <br />
      <Search
        className='searchBar'
        placeholder='Entrer un pseudo'
        enterButton='Envoyer demande'
        size='large'
        // onSearch={onSearch}
      /> */}
    </div>
  );
};
