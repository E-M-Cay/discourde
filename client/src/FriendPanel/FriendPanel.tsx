import {
  CloseCircleOutlined,
  MenuOutlined,
  MessageOutlined,
  CheckCircleFilled,
  PhoneOutlined,
  VideoCameraOutlined,
  UserDeleteOutlined,
  SearchOutlined,
  CloseOutlined,
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
import Sider from 'antd/lib/layout/Sider';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { PeerSocketContext } from '../context/PeerSocket';
import { UserMapsContext } from '../context/UserMapsContext';
import { CustomImageChat, CustomImageMess } from '../CustomLi/CustomLi';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  setActiveChannel,
  setActiveServer,
  setIsHome,
} from '../redux/userSlice';
import {
  ReceivedFriendRequest,
  Friendship,
  User,
  Server,
  ServerResponse,
} from '../types/types';
// import friendsData from '../mockFriends';
import './FriendPanel.css';

const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Search } = Input;

export const FriendPanel = (props: {
  setServers: React.Dispatch<React.SetStateAction<ServerResponse[]>>;
}) => {
  const { setServers } = props;
  const onlineUsers: any[] = [];
  // const me = useAppSelector((state) => state.userReducer.me);
  const {
    friendMap,
    receivedFriendRequestMap,
    sentFriendRequestMap,
    acceptFriendRequest,
    refuseFriendRequest,
    deleteFriendRequest,
  } = useContext(UserMapsContext);
  const { socket } = useContext(PeerSocketContext);
  const dispatch = useAppDispatch();

  interface ServerInvitation {
    id: number;
    sender: User;
    server: Server;
  }

  const [serverRequests, setServerRequests] = useState<ServerInvitation[]>([]);

  // for (let index = 0; index < friendsData.length; index++) {
  //     if (friendsData[index].onRequest) {
  //         const onRequestUser = friendsData[index].nickname;
  //         friendRequests.push(onRequestUser);
  //     } else if (!friendsData[index].onRequest && friendsData[index].onLine) {
  //         const onLineUser = friendsData[index].nickname;
  //         onlineUsers.push(onLineUser);
  //     } else if (!friendsData[index].onRequest) {
  //         const useer = friendsData[index].nickname;
  //         friendships.push(useer);
  //     }
  //     console.log(onlineUsers);
  // }

  useEffect(() => {
    axios
      .get('serverinvitation/getinvitations', {
        headers: {
          access_token: localStorage.getItem('token') as string,
        },
      })
      .then((res) => {
        // console.log(res, 'pépon');
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
    socket?.on('newserverinvitation', handleNewServerInvitation);
    return () => {
      socket?.off('newserverinvitation', handleNewServerInvitation);
    };
  }, [handleNewServerInvitation]);

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
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [stateMenu, setmenuState] = useState(true);

  const onChange = (key: any) => {
    // console.log(key);
  };
  const onClick = (e: any) => {
    // console.log('click ', e);
  };
  const onSearch = (value: any) => console.log(value);

  const menu = (
    <Menu
      className='menu'
      items={[
        {
          label: (
            <li>
              <MessageOutlined style={{ color: 'green', fontSize: 'small' }} />{' '}
              Envoyer un message{' '}
            </li>
          ),
          key: '1',
        },
        {
          type: 'divider',
        },
        {
          label: (
            <li>
              <PhoneOutlined style={{ color: 'green', fontSize: 'small' }} />{' '}
              Démarrer un appel vocal{' '}
            </li>
          ),
          key: '2',
        },
        {
          label: (
            <li>
              <VideoCameraOutlined
                style={{ color: 'green', fontSize: 'small' }}
              />{' '}
              Démarrer un appel vidéo{' '}
            </li>
          ),
          key: '3',
        },
        {
          type: 'divider',
        },
        {
          label: (
            <li>
              <UserDeleteOutlined style={{ color: 'red', fontSize: 'small' }} />{' '}
              Retirer l'ami{' '}
            </li>
          ),
          key: '4',
        },
      ]}
    />
  );

  return (
    <div>
      <Tabs onChange={onChange} style={{ marginLeft: 10 }}>
        <TabPane tab='En ligne' key='1'>
          <p style={{ position: 'fixed', fontSize: 'medium' }}>
            EN LIGNE - {onlineUsers.length}
          </p>
          <br />
          <br />
          <Search
            className='searchBar2'
            placeholder='Rechercher'
            enterButton={<SearchOutlined />}
            size='middle'
            onSearch={onSearch}
          />
          <br />
          <br />
          <li
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
            {onlineUsers.map((nickname) => (
              <div
                onClick={onClick}
                className='panelContent'
                style={{
                  margin: 0,
                  padding: 0,
                  height: '8vh',
                  fontWeight: 'bold',
                }}
              >
                <Divider style={{ margin: 0 }} /> {nickname}
                <div className='iconFriend'>
                  <Dropdown
                    overlay={menu}
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
          </li>
        </TabPane>
        <TabPane tab='Tous' key='2'>
          <p style={{ position: 'fixed', fontSize: 'medium' }}>
            TOUS LES AMIS - {friendMap.size}
          </p>
          <br />
          <br />
          <Search
            className='searchBar2'
            placeholder='Rechercher'
            enterButton={<SearchOutlined />}
            size='middle'
            onSearch={onSearch}
          />
          <br />
          <br />
          <li
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
                onClick={onClick}
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
                  picture={friendship.friend.picture}
                  nickname={friendship.friend.username}
                />
                {friendship.friend.username}
                <div className='iconFriend'>
                  {/*                             <a style={{ color: '#060606'}}><div><Tooltip placement="top" title={"Envoyer un message"}><MessageOutlined /></Tooltip></div></a>
                   */}{' '}
                  <Dropdown
                    overlay={menu}
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
          </li>
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
            onSearch={onSearch}
          />
          <br />
          <br />
          <li
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
                  onClick={onClick}
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
                onClick={onClick}
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
                onClick={onClick}
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
          </li>
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
            onSearch={onSearch}
          />
        </TabPane>
      </Tabs>
    </div>
  );

  // return (
  //   <Tabs onChange={onChange} type='card'>
  //     <TabPane tab='En ligne' key='1'>
  //       <p style={{ position: 'fixed', fontSize: 'large' }}>
  //         En ligne - {onlineUsers.length}
  //       </p>
  //       <br />
  //       <br />
  //       <li
  //         className={'scrollIssue'}
  //         style={{
  //           height: '87vh',
  //           width: '100%',
  //           borderRight: 0,
  //           padding: 0,
  //           flexWrap: 'wrap',
  //           overflowY: 'scroll',
  //         }}
  //       >
  //         {onlineUsers.map((nickname) => (
  //           <div
  //             onClick={onClick}
  //             className='panelContent'
  //             style={{
  //               margin: 0,
  //               padding: 0,
  //               height: '8vh',
  //               fontWeight: 'bold',
  //             }}
  //           >
  //             <Divider style={{ margin: 0 }} /> {nickname}{' '}
  //             <div className='iconFriend'>
  //               {' '}
  //               <a>
  //                 <MessageOutlined />
  //               </a>{' '}
  //               <a>
  //                 <MenuOutlined />
  //               </a>
  //             </div>{' '}
  //           </div>
  //         ))}
  //       </li>
  //     </TabPane>
  //     <TabPane tab='Tous' key='2'>
  //       <p style={{ position: 'fixed', fontSize: 'large' }}>
  //         Tous les amis - {friendMap.size}
  //       </p>
  //       <br />
  //       <br />
  //       <li
  //         className={'scrollIssue'}
  //         style={{
  //           height: '87vh',
  //           width: '100%',
  //           borderRight: 0,
  //           padding: 0,
  //           flexWrap: 'wrap',
  //           overflowY: 'scroll',
  //         }}
  //       >
  //         {Array.from(friendMap.entries()).map(([id, friendship]) => (
  //           <span
  //             key={friendship.id}
  //             onClick={onClick}
  //             className='panelContent'
  //             style={{
  //               margin: 0,
  //               padding: 0,
  //               height: '8vh',
  //               fontWeight: 'bold',
  //             }}
  //           >
  //             <>
  //               <Divider style={{ margin: 0 }} /> {friendship.friend.username}{' '}
  //               <MessageOutlined className='iconFriend' />{' '}
  //               <MenuOutlined className='iconFriend' />
  //             </>
  //           </span>
  //         ))}
  //       </li>
  //     </TabPane>
  //     <TabPane tab='En attente' key='3'>
  //       <p style={{ position: 'fixed', fontSize: 'large' }}>
  //         En attente - {receivedFriendRequestMap.size}
  //       </p>
  //       <br />
  //       <br />
  //       <li
  //         className={'scrollIssue'}
  //         style={{
  //           height: '87vh',
  //           width: '100%',
  //           borderRight: 0,
  //           padding: 0,
  //           flexWrap: 'wrap',
  //           overflowY: 'scroll',
  //         }}
  //       >
  //         <p>Requête d'amis reçues</p>
  //         {Array.from(receivedFriendRequestMap.entries()).map(
  //           ([id, request]) => (
  //             <div
  //               key={id}
  //               onClick={onClick}
  //               className='panelContent'
  //               style={{
  //                 margin: 0,
  //                 padding: 0,
  //                 height: '8vh',
  //                 fontWeight: 'bold',
  //               }}
  //             >
  //               <>
  //                 <Divider style={{ margin: 0 }} /> {request.sender.username}{' '}
  //                 <CloseCircleOutlined
  //                   className='iconFriend'
  //                   onClick={() =>
  //                     refuseFriendRequest(request.id, request.sender.id)
  //                   }
  //                 />{' '}
  //                 <CheckCircleFilled
  //                   className='iconFriend'
  //                   onClick={() =>
  //                     acceptFriendRequest(request.id, request.sender.id)
  //                   }
  //                 />
  //               </>
  //             </div>
  //           )
  //         )}
  //         <p>Requêtes d'amis envoyées</p>
  //         {Array.from(sentFriendRequestMap.entries()).map(([id, request]) => (
  //           <div
  //             key={id}
  //             onClick={onClick}
  //             className='panelContent'
  //             style={{
  //               margin: 0,
  //               padding: 0,
  //               height: '8vh',
  //               fontWeight: 'bold',
  //             }}
  //           >
  //             <>
  //               <Divider style={{ margin: 0 }} /> {request.receiver.username}{' '}
  //               <CloseCircleOutlined
  //                 className='iconFriend'
  //                 onClick={() =>
  //                   deleteFriendRequest(request.id, request.receiver.id)
  //                 }
  //               />{' '}
  //             </>
  //           </div>
  //         ))}
  //         <p>Serveur à rejoindre</p>
  //         {serverRequests.map((request) => (
  //           <div key={request.id}>
  //             <Divider style={{ margin: 0 }} /> {request.server.name}{' '}
  //             {request.sender.username}
  //             <CheckCircleFilled
  //               className='iconFriend'
  //               onClick={() =>
  //                 handleAcceptServerInvitation(request.id, request.server.id)
  //               }
  //             >
  //               accepter
  //             </CheckCircleFilled>
  //           </div>
  //         ))}
  //       </li>
  //     </TabPane>
  //     <TabPane tab='Ajouter un ami' key='4'>
  //       Ajout amis
  //     </TabPane>
  //   </Tabs>
  // );
};
