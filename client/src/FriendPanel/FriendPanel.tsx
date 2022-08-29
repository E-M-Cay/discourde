import {
  CloseOutlined,
  MenuOutlined,
  MessageOutlined,
  CheckCircleFilled,
  PhoneOutlined,
  VideoCameraOutlined,
  UserDeleteOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CheckOutlined,
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
  Badge,
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
        className='menu'
        style={{ width: '180px' }}
        items={[
          {
            label: (
              <div onClick={() => openPrivateChat(friendship.friend)}>
                <MessageOutlined /> Envoyer un message{' '}
              </div>
            ),
            key: '1',
          },
          {
            label: (
              <div onClick={() => deleteFriendship(friendship)}>
                <UserDeleteOutlined /> Retirer l'ami{' '}
              </div>
            ),
            key: '4',
          },
        ]}
      />
    );
  };
  const returnColor = (status: number) => {
    console.log(status);
    switch (status) {
      case 0:
        return 'grey';
      case 1:
        return 'green';
      case 2:
        return 'yellow';
      case 3:
        return 'red';
      default:
      //console.log('could not read status');
    }
  };

  return (
    <div style={{ backgroundColor: '#2F3136', height: '100vh' }}>
      <Title level={4} style={{ textAlign: 'center', color: '#99a6a0' }}>
        Amis
      </Title>
      {Array.from(friendMap.entries()).find(
        ([id, friendship]) => friendship.friend.status
      ) && (
        <Title
          level={5}
          style={{ textAlign: 'left', color: '#99a6a0', marginLeft: '10px' }}
        >
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
              // className='panelContent'
              style={{
                padding: 0,
                fontWeight: 'bold',
                marginLeft: '16px !important',
              }}
            >
              {/*                             <a style={{ color: '#060606'}}><div><Tooltip placement="top" title={"Envoyer un message"}><MessageOutlined /></Tooltip></div></a>
               */}
              <Dropdown
                overlay={menu(friendship)}
                trigger={['click']}
                className='dropdownHandlerStp'
                // placement='bottomLeft'
                // className='DropDownFriend'
              >
                <div
                  style={{
                    margin: '10px 0 10px 16px',

                    padding: '5px 0',
                    borderRadius: '3px',
                    // height: '8vh',
                    fontWeight: 'bold',
                    color: '#b2b2b2',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '14px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ marginLeft: '-4px', marginTop: '-8px' }}>
                      <Badge
                        className='fixStatus badgination'
                        dot
                        style={{
                          backgroundColor: returnColor(
                            Number(friendship.friend.status)
                          ),
                          border: '0 !important',

                          // left: '0px',
                        }}
                      >
                        <Avatar
                          src={friendship.friend.picture}
                          size={33}
                          // style={{ border: '0 !important' }}
                          // username={friendship.friend.username}
                          // status={friendship.friend.status}
                        />
                      </Badge>
                    </div>
                    <div style={{ marginLeft: '20px' }}>
                      {friendship.friend.username}
                    </div>
                  </div>
                  <div style={{ marginRight: '5px' }}>
                    <MenuOutlined />
                  </div>
                </div>
                {/* <a style={{ color: '#060606' }}> */}
                {/* <Tooltip placement='top' title={'Actions'}>
                    {' '}
                    <MenuOutlined />{' '}
                  </Tooltip> */}
                {/* </a> */}
                {/* <a onClick={() => setmenuState(!stateMenu)}></a> */}
              </Dropdown>
            </div>
          ) : null
        )}
      </div>
      <p style={{ position: 'fixed', fontSize: 'medium' }}></p>
      {Array.from(friendMap.entries()).filter(
        ([id, friendship]) => friendship.friend.status
      ).length === friendMap.size && friendMap.size ? null : friendMap.size ? (
        <Title
          level={5}
          style={{ textAlign: 'left', color: '#99a6a0', marginLeft: '10px' }}
        >
          Tous les amis - {friendMap.size}
        </Title>
      ) : (
        <Typography
          style={{
            textAlign: 'center',
            color: '#99a6a0',
            fontSize: '15px',
            margin: 'auto',
            maxWidth: '90%',
          }}
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
        {Array.from(friendMap.entries()).filter(
          ([id, friendship]) => friendship.friend.status
        ).length === friendMap.size
          ? null
          : Array.from(friendMap.entries()).map(([id, friendship]) => (
              <div
                key={id}
                // className='panelContent'
                style={{
                  padding: 0,
                  fontWeight: 'bold',
                  marginLeft: '16px !important',
                }}
              >
                {/*                             <a style={{ color: '#060606'}}><div><Tooltip placement="top" title={"Envoyer un message"}><MessageOutlined /></Tooltip></div></a>
                 */}
                <Dropdown
                  overlay={menu(friendship)}
                  trigger={['click']}
                  className='dropdownHandlerStp'
                  // placement='bottomLeft'
                  // className='DropDownFriend'
                >
                  <div
                    style={{
                      margin: '10px 0 10px 16px',

                      padding: '5px 0',
                      borderRadius: '3px',
                      // height: '8vh',
                      fontWeight: 'bold',
                      color: '#b2b2b2',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ marginLeft: '-4px', marginTop: '-8px' }}>
                        <Badge
                          className='fixStatus badgination'
                          dot
                          style={{
                            backgroundColor: returnColor(
                              Number(friendship.friend.status)
                            ),
                            border: '0 !important',

                            // left: '0px',
                          }}
                        >
                          <Avatar
                            src={friendship.friend.picture}
                            size={33}
                            // style={{ border: '0 !important' }}
                            // username={friendship.friend.username}
                            // status={friendship.friend.status}
                          />
                        </Badge>
                      </div>
                      <div style={{ marginLeft: '20px' }}>
                        {friendship.friend.username}
                      </div>
                    </div>
                    <div style={{ marginRight: '5px' }}>
                      <MenuOutlined />
                    </div>
                  </div>
                  {/* <a style={{ color: '#060606' }}> */}
                  {/* <Tooltip placement='top' title={'Actions'}>
                  {' '}
                  <MenuOutlined />{' '}
                </Tooltip> */}
                  {/* </a> */}
                  {/* <a onClick={() => setmenuState(!stateMenu)}></a> */}
                </Dropdown>
              </div>
            ))}
      </div>
      <Title
        level={4}
        style={{
          textAlign: 'center',
          color: '#99a6a0',
          marginTop: '10px',
          width: '100%',
        }}
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
          <Title
            level={5}
            style={{
              textAlign: 'left',
              color: '#99a6a0',
              width: '100%',
              marginLeft: '10px',
            }}
          >
            Reçues
          </Title>
        ) : null}

        {Array.from(receivedFriendRequestMap.entries()).map(([id, request]) => (
          <div
            key={id}
            // className='panelContent'
            style={{
              margin: '10px 0',
              padding: 0,
              // height: '8vh',
              fontWeight: 'bold',
              color: '#b2b2b2',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* <CustomImageMess
              picture={request.sender.picture}
              nickname={request.sender.username}
            /> */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                src={request.sender.picture}
                size={33}
                style={{ marginLeft: '21px', marginRight: '20px' }}
              />
              <div>
                {/* {request.sender.username} */}

                {request.sender.username.length > 8
                  ? request.sender.username.substring(0, 7) + '...'
                  : request.sender.username}
              </div>
            </div>
            <div>
              <button
                // shape='circle'
                // className='AccFriendBtton'

                // danger
                style={{
                  borderRadius: 0,
                  border: 0,
                  padding: '0 8.5px',
                  color: 'grey',
                  backgroundColor: '#40444b',

                  // marginTop: '10px',
                  // marginLeft: '5px',
                }}
                onClick={() =>
                  acceptFriendRequest(request.id, request.sender.id)
                }
              >
                <CheckOutlined
                // style={{
                //   padding: '0px',
                // }}
                />
              </button>
              {/* <Tooltip title='Annuler la demande'> */}
              <button
                // shape='circle'
                // className='DelFriendBtton'
                // icon={}
                // danger
                style={{
                  borderRadius: 0,
                  border: 0,
                  padding: '0 8.5px',
                  marginLeft: '0',
                  color: 'grey',
                  backgroundColor: '#40444b',
                  // marginTop: '10px',
                  // marginLeft: '30px',
                }}
                onClick={() =>
                  refuseFriendRequest(request.id, request.sender.id)
                }
              >
                <CloseOutlined />
              </button>
            </div>
            {/* </Tooltip> */}
          </div>
        ))}

        {/* Array.from(sentFriendRequestMap.entries()).map(([id, request]) */}
        {Array.from(sentFriendRequestMap.entries()).length > 0 ? (
          <Title
            level={5}
            style={{
              textAlign: 'left',
              color: '#99a6a0',
              width: '100%',
              marginLeft: '10px',
            }}
          >
            Envoyées
          </Title>
        ) : null}

        {Array.from(sentFriendRequestMap.entries()).map(([id, request]) => (
          <div
            key={id}
            style={{
              margin: ' 10px 0',
              padding: 0,
              // height: '8vh',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#b2b2b2',
            }}
          >
            {/* <Divider style={{ margin: 0 }} /> */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* {' '} */}
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
                padding: '2px 10px',
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
          <Title
            level={5}
            style={{ textAlign: 'left', color: '#99a6a0', marginLeft: '10px' }}
          >
            Serveurs
          </Title>
        ) : null}
        {serverRequests.map((invitation) => (
          <div
            key={invitation.id}
            // className='panelContent'
            style={{
              margin: ' 10px 0',
              padding: 0,
              // height: '8vh',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#b2b2b2',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                src={invitation.sender.picture}
                size={34}
                style={{ marginLeft: '21px', marginRight: '20px' }}
              />
              <div>
                {/* {invitation.sender.username} vous a invité à rejoindre{' '} */}
                {invitation.server.name}
              </div>
            </div>
            <div>
              <button
                // shape='circle'
                // className='AccFriendBtton'

                // danger
                style={{
                  borderRadius: 0,
                  border: 0,
                  padding: '0 8.5px',
                  color: 'grey',
                  backgroundColor: '#40444b',

                  // marginTop: '10px',
                  // marginLeft: '5px',
                }}
                onClick={() =>
                  handleAcceptServerInvitation(
                    invitation.id,
                    invitation.server.id
                  )
                }
              >
                <CheckOutlined
                // style={{
                //   padding: '0px',
                // }}
                />
              </button>
              {/* <Tooltip title='Annuler la demande'> */}
              <button
                // shape='circle'
                // className='DelFriendBtton'
                // icon={}
                // danger
                style={{
                  borderRadius: 0,
                  border: 0,
                  padding: '0 8.5px',
                  marginLeft: '0',
                  color: 'grey',
                  backgroundColor: '#40444b',
                  // marginTop: '10px',
                  // marginLeft: '30px',
                }}
                onClick={() => handleRefuseServerInvitation(invitation.id)}
              >
                <CloseOutlined />
              </button>
            </div>
            {/* <Tooltip title='Accepter la demande'>
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
            </Tooltip> */}
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
