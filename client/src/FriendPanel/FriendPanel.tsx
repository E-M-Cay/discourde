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
      <Tabs style={{ marginLeft: 10 }}>
        <TabPane tab='En ligne' key='1'>
          <p style={{ position: 'fixed', fontSize: 'medium' }}>EN LIGNE</p>
          <br />
          <br />
          <div
            className={'scrollIssue'}
            style={{
              height: '73vh',
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
        </TabPane>
        <TabPane tab='Tous' key='2'>
          <p style={{ position: 'fixed', fontSize: 'medium' }}>
            TOUS LES AMIS - {friendMap.size}
          </p>
          <br />
          <br />
          <div
            className={'scrollIssue'}
            style={{
              height: '73vh',
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
        </TabPane>
        <TabPane tab='En attente' key='3'>
          <p style={{ position: 'fixed', fontSize: 'medium' }}>
            EN ATTENTE - {receivedFriendRequestMap.size}
          </p>
          <br />
          <br />
          <Search
            className='searchBar2'
            placeholder='Rechercher'
            enterButton={<SearchOutlined />}
            size='middle'
            // onSearch={onSearch}
          />
          <br />
          <br />
          <div
            className={'scrollIssue'}
            style={{
              height: '73vh',
              width: '100%',
              borderRight: 0,
              padding: 0,
              flexWrap: 'wrap',
              overflowY: 'scroll',
            }}
          >
            <p>Reçues</p>
            {Array.from(receivedFriendRequestMap.entries()).map(
              ([id, request]) => (
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
              )
            )}

            {/* Array.from(sentFriendRequestMap.entries()).map(([id, request]) */}
            <p>Envoyées</p>
            {Array.from(sentFriendRequestMap.entries()).map(([id, request]) => (
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
                  picture={request.receiver.picture}
                  nickname={request.receiver.username}
                />
                {request.receiver.username}

                <Tooltip title='Annuler la demande'>
                  <Button
                    shape='circle'
                    className='DelFriendBtton'
                    icon={<CloseOutlined />}
                    danger
                    onClick={() =>
                      deleteFriendRequest(request.id, request.receiver.id)
                    }
                  />
                </Tooltip>
              </div>
            ))}
            <p>Serveurs</p>
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
        </TabPane>
        <TabPane tab='Ajouter un ami' key='4'>
          <p style={{ position: 'fixed', fontSize: 'medium' }}>
            AJOUTER UN AMI
          </p>
          <br />
          <br />
          <Search
            className='searchBar'
            placeholder='Entrer un pseudo'
            enterButton='Envoyer demande'
            size='large'
            // onSearch={onSearch}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};
