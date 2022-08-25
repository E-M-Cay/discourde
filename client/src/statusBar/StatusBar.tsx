import { Button, Collapse, Dropdown, Menu, Modal, Typography } from 'antd';
import axios from 'axios';
import { useContext, useState } from 'react';
import { UserMapsContext } from '../context/UserMapsContext';
import { CustomImage } from '../CustomLi/CustomLi';
import { UserProfileModal } from '../Modals/Modals';
import UserProfileSettings from '../Modals/UserProfileSettings';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { PrivateChatMap, User, ServerUserMap } from '../types/types';

//const { Title } = Typography;
const { Panel } = Collapse;

export const StatusBar = () => {
  const { openPrivateChat, serverUserMap } = useContext(UserMapsContext);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  // const [selectedUser, setSelectedUser] = useState<User>();

  const me = useAppSelector((state) => state.userReducer.me);

  const showModal = (user: User) => {
    // setSelectedUser(user);
    setIsModalVisible(user.id === me?.id);
    setIsModalVisible2(user.id !== me?.id);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setIsModalVisible2(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsModalVisible2(false);
  };

  //antd menu for dropdown

  const menu = (user: User) => {
    return (
      <Menu
        className='menu'
        items={[
          (me?.id !== user.id && {
            key: '1',
            label: (
              <span
                style={{
                  fontWeight: '600',
                  width: '100%',
                  fontSize: '14px',
                }}
                onClick={() => openPrivateChat(user)}
              >
                message
              </span>
            ),
          }) ||
            null,
          {
            key: '3',
            label: (
              <span
                style={{
                  fontWeight: '600',
                  width: '100%',
                  fontSize: '14px',
                }}
              >
                role
              </span>
            ),
          },
          (me?.id !== user.id && {
            key: '4',
            label: (
              <span
                style={{
                  fontWeight: '600',
                  width: '100%',
                  fontSize: '14px',
                }}
              >
                exclure
              </span>
            ),
          }) ||
            null,
          {
            key: '5',
            label: (
              <>
                <div
                  style={{
                    fontWeight: '600',
                    width: '100%',
                    fontSize: '14px',
                  }}
                  onClick={() => showModal(user)}
                >
                  Profil
                </div>

                {user.id === me?.id ? (
                  <Modal
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={null}
                  >
                    <UserProfileSettings />
                  </Modal>
                ) : (
                  <Modal
                    visible={isModalVisible2}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={null}
                  >
                    <UserProfileModal
                      openPrivateChat={openPrivateChat}
                      user={user}
                    />
                  </Modal>
                )}
              </>
            ),
          },
        ]}
      />
    );
  };

  const menu2 = (user: User) => {
    return (
      <Menu
        className='menu'
        items={[
          (me?.id !== user.id && {
            key: '1',
            label: (
              <span
                style={{
                  fontWeight: '600',
                  width: '100%',
                  fontSize: '14px',
                }}
                onClick={() => openPrivateChat(user)}
              >
                message
              </span>
            ),
          }) ||
            null,
          {
            key: '3',
            label: (
              <span
                style={{
                  fontWeight: '600',
                  width: '100%',
                  fontSize: '14px',
                }}
              >
                role
              </span>
            ),
          },
          (me?.id !== user.id && {
            key: '4',
            label: (
              <span
                style={{
                  fontWeight: '600',
                  width: '100%',
                  fontSize: '14px',
                }}
              >
                exclure
              </span>
            ),
          }) ||
            null,
          {
            key: '5',
            label: (
              <>
                <div
                  style={{
                    fontWeight: '600',
                    width: '100%',
                    fontSize: '14px',
                  }}
                  onClick={() => showModal(user)}
                >
                  Profil
                </div>

                {user.id === me?.id ? (
                  <Modal
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={null}
                  >
                    <UserProfileSettings />
                  </Modal>
                ) : (
                  <Modal
                    visible={isModalVisible2}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={null}
                  >
                    <UserProfileModal
                      openPrivateChat={openPrivateChat}
                      user={user}
                    />
                  </Modal>
                )}
              </>
            ),
          },
        ]}
      />
    );
  };

  return (
    <div
      className={'scrollIssue'}
      style={{
        height: '100vh',
        borderRight: 0,
        padding: 0,
        overflowY: 'scroll',
        backgroundColor: '#2F3136',
      }}
    >
      <div
        style={{
          height: '42px',
          width: '600px',
          borderBottom: '1px solid rgba(26, 26, 26, 0.67)',
          backgroundColor: '#36393f',
        }}
      ></div>
      <Collapse defaultActiveKey={['1', '2']} ghost>
        <Panel key='1' header='en ligne' style={{ margin: '0 !important' }}>
          {Array.from(serverUserMap.entries()).map(([id, user]) =>
            user.user.status ? (
              <Dropdown key={id} overlay={menu(user.user)} trigger={['click']}>
                <div
                  key={id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    maxWidth: '300px',
                  }}
                  className='hoStat'
                >
                  {' '}
                  <CustomImage
                    username={user.nickname}
                    status={user.user.status}
                    picture={user.user.picture}
                    key={id}
                  />{' '}
                  <Typography
                    style={{
                      width: '100%',
                      paddingLeft: '10px',
                      fontWeight: '700',
                      letterSpacing: '0.5px',
                      fontSize: '1rem',
                      color: '#A1A1A1',
                    }}
                  >
                    {user.nickname.length > 14
                      ? user.nickname.slice(0, 14) + '...'
                      : user.nickname}
                  </Typography>{' '}
                </div>
              </Dropdown>
            ) : null
          )}
        </Panel>
        <Panel key='2' header='hors ligne' style={{ margin: '0 !important' }}>
          {Array.from(serverUserMap.entries()).map(([id, user]) =>
            !user.user.status ? (
              <Dropdown
                key={id}
                overlay={menu2(user.user)}
                placement='bottomLeft'
                trigger={['click']}
              >
                <div
                  key={id}
                  className='hoStat'
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: '300px',
                  }}
                >
                  <CustomImage
                    username={user.nickname}
                    status={user.user.status}
                    picture={user.user.picture}
                    key={id}
                  />{' '}
                  <Typography
                    style={{
                      width: '100%',
                      height: '100%',
                      paddingLeft: '10px',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      color: '#A1A1A1',
                    }}
                  >
                    {user.nickname.length > 14
                      ? user.nickname.slice(0, 14) + '...'
                      : user.nickname}
                  </Typography>{' '}
                </div>
              </Dropdown>
            ) : (
              ''
            )
          )}
        </Panel>
      </Collapse>
    </div>
  );
};
