import { Avatar, Button, Divider, Input, Modal, Typography } from 'antd';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { UserMapsContext } from '../context/UserMapsContext';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { User } from '../types/types';
import logo from '../assets/discourde.png';
import { setIsConnected, setMe } from '../redux/userSlice';
import Success from '../assets/Success';
import { NotificationsContext } from '../context/NotificationsContext';

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
  const { addNotification } = useContext(NotificationsContext);

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
        addNotification({
          title: 'success',
          content: 'Invitation envoyée',
          isTmp: true,
          picture: <Success />,
        });
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
      <div style={{ color: '#2c2c2c' }}>
        {/* <Button onClick={(e) => handleLinkCreation()}>créer lien</Button> */}
        <>
          {Array.from(friendMap.entries()).length !== 0 ? (
            <>
              <Typography.Title style={{ color: '#2c2c2c' }} level={4}>
                Inviter un ami
              </Typography.Title>
              {Array.from(friendMap.entries()).map(([id, friendShip]) => {
                return (
                  <div
                    key={id}
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'end',
                    }}
                  >
                    <Avatar src={friendShip.friend.picture ?? logo} />
                    <span style={{ fontSize: '1.2rem', marginLeft: '10px' }}>
                      {friendShip.friend.username}
                    </span>
                    <button
                      style={{
                        borderRadius: 0,
                        border: 0,
                        padding: '3px 10px',
                        color: 'grey',
                        backgroundColor: '#40444b',
                        // marginTop: '10px',
                        marginLeft: '30px',
                      }}
                      onClick={() => handleInviteUser(id)}
                      // type='primary'
                    >
                      Inviter
                    </button>
                  </div>
                );
              })}
            </>
          ) : (
            <Typography.Title
              style={{ color: '#2c2c2c', textAlign: 'center' }}
              level={4}
            >
              Désolé tu n'as aucun ami n'hésite pas à échanger sur le serveur
              général pour rencontrer des utilisateurs :)
            </Typography.Title>
          )}
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
        style={
          {
            // display: 'flex',
            // justifyContent: 'space-between',
            // alignItems: 'center',
          }
        }
      >
        <Typography.Title
          style={{ textAlign: 'center', color: '#2c2c2c' }}
          level={4}
        >
          Créer channel texte
        </Typography.Title>
        <Input
          placeholder='Add text channel'
          onChange={(e) => setNewTextChannelName(e.target.value)}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          {/* <Checkbox
            
            onChange={(e) => setIsAdminChannel(e.target.checked)}
          >
            
          </Checkbox> */}
          <label
            style={{ marginTop: '10px', color: '#2c2c2c', fontSize: '15px' }}
            htmlFor='scales'
          >
            Channel caché
          </label>
          <input
            style={{
              marginTop: '10px',
              marginLeft: '10px',
              color: '#2c2c2c',
              accentColor: '#40444b',
              backgroundColor: '#40444b',
            }}
            type='checkbox'
            onChange={(e) => setIsAdminChannel(e.target.checked)}
            id='scales'
            name='scales'
          />
          <button
            style={{
              borderRadius: 0,
              border: 0,
              padding: '3px 10px',
              color: 'grey',
              backgroundColor: '#40444b',
              marginTop: '10px',
              marginLeft: '30px',
            }}
            onClick={() => handleCreateChannel(false)}
          >
            Créer
          </button>
        </div>
      </div>
      <Divider style={{ borderTop: '1px solid #2c2c2c', marginTop: '30px' }} />

      <div
      // style={{
      //   display: 'flex',
      //   justifyContent: 'space-between',
      //   alignItems: 'center',
      // }}
      >
        <Typography.Title
          style={{ textAlign: 'center', color: '#2c2c2c', marginTop: '20px' }}
          level={4}
        >
          Créer channel vocal
        </Typography.Title>
        <Input
          onChange={(e) => setNewTextChannelName(e.target.value)}
          placeholder='Add vocal channel'
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          {/* <Checkbox
            
            onChange={(e) => setIsAdminChannel(e.target.checked)}
          >
            
          </Checkbox> */}
          <label
            style={{ marginTop: '10px', color: '#2c2c2c', fontSize: '15px' }}
            htmlFor='scales'
          >
            Channel caché
          </label>
          <input
            style={{
              marginTop: '10px',
              marginLeft: '10px',
              color: '#2c2c2c',
              accentColor: '#40444b',
              backgroundColor: '#40444b',
            }}
            type='checkbox'
            onChange={(e) => setIsAdminChannel(e.target.checked)}
            id='scales'
            name='scales'
          />
          <button
            style={{
              borderRadius: 0,
              border: 0,
              padding: '3px 10px',
              color: 'grey',
              backgroundColor: '#40444b',
              marginTop: '10px',
              marginLeft: '30px',
            }}
            onClick={() => handleCreateChannel(true)}
          >
            Créer
          </button>
        </div>
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
  const {
    sentFriendRequestMap,
    receivedFriendRequestMap,
    acceptFriendRequest,
  } = useContext(UserMapsContext);
  const { friendMap, sendFriendRequest } = useContext(UserMapsContext);
  const isFriend = friendMap.has(user.id);
  // //console.log(user);
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
          //console.log(res);
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
          {user.username.length > 8
            ? `${user.username.substring(0, 8)}...`
            : user.username}
        </Title>
        <div style={{ color: 'darkgrey', width: '30%' }}></div>
      </div>
      <div
        style={{
          marginTop: '10px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'end',
        }}
      >
        {!sentFriendRequestMap.has(user.id) &&
          !receivedFriendRequestMap.has(user.id) &&
          !friendMap.has(user.id) &&
          me?.id !== user.id && (
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
              Ajouter ami
            </button>
          )}
        {receivedFriendRequestMap.has(user.id) && (
          <button
            style={{
              borderRadius: 0,
              border: 0,
              marginTop: '20px',
              padding: '7px 10px',
              color: 'darkgrey',
              backgroundColor: '#40444b',
              width: '200px',
              fontWeight: 'bold',
            }}
            onClick={() =>
              acceptFriendRequest(
                receivedFriendRequestMap.get(user.id)?.id || -1,
                user.id
              )
            }
          >
            Accepter la requête d'amis
          </button>
        )}
        {sentFriendRequestMap.has(user.id) && (
          <Typography
            style={{ marginBottom: '6px', fontSize: '1rem', color: 'darkGrey' }}
          >
            Requête d'amis envoyée
          </Typography>
        )}
        {friendMap.has(user.id) && (
          <Typography
            style={{ marginBottom: '6px', fontSize: '1rem', color: 'darkGrey' }}
          >
            Vous et {user.username} êtes amis.
          </Typography>
        )}
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
      window.location.reload();
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
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        closable={false}
      >
        {/* <h1>MENTIONS LEGALES :</h1> */}

        <p style={{ textAlign: 'justify' }}>
           
          <br />
          Conformément aux dispositions des articles 6-III et 19 de la Loi n°
          2004-575 du 21 juin 2004 pour la Confiance dans l'économie numérique,
          dite L.C.E.N., nous portons à la connaissance des utilisateurs et
          visiteurs du site : discourde.herokuapp.com les informations suivantes
          :
        </p>

        <p style={{ textAlign: 'justify' }}>ÉDITEUR</p>

        <p style={{ textAlign: 'justify' }}>
          Le site discourde.herokuapp.com  est la propriété exclusive de  SAS 
          Discourde , qui l'édite.
        </p>

        <p style={{ textAlign: 'justify' }}>
          Discourde  
          <br />
          SAS au capital de   100000 € Tél  : 0679524638
        </p>

        <p style={{ textAlign: 'justify' }}>
          31 rue de la marine  12303 Vandone
          <br />
          Immatriculée au Registre du Commerce et des Sociétés de   Vandone B
          794 598 813 sous le numéro   01684239547660  
        </p>

        <p style={{ textAlign: 'justify' }}>
          Numéro TVA intracommunautaire : FR14794598813
          <br />
          Adresse de courrier électronique : xx-marcdark-xx@hotmail.fr  <br />
           <br />
          Directeur de la  publication : Alain Darkos
          <br />
          Contactez le responsable de la publication : alain.capone@hotmail.fr
        </p>

        <p style={{ textAlign: 'justify' }}> </p>

        <p style={{ textAlign: 'justify' }}>HÉBERGEMENT</p>

        <p style={{ textAlign: 'justify' }}>
          Le site est hébergé par  heroku heroku.com 13000 marseille
          <br />
        </p>
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
            onClick={() => handleDisconnect()}
          >
            Disconnect
          </button>
        </div>
      </Modal>
    </>
  );
};
