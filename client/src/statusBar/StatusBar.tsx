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
  const [selectedUser, setSelectedUser] = useState<User>();

  const me = useAppSelector((state) => state.userReducer.me);

  const showModal = (user: User) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  //antd menu for dropdown

  const menu = (user: User) => {
    return (
      <Menu
        items={[
          (me?.id !== user.id && {
            key: '1',
            label: (
              <a
                target='_blank'
                rel='noopener noreferrer'
                onClick={() => openPrivateChat(user)}
              >
                message
              </a>
            ),
          }) ||
            null,
          {
            key: '3',
            label: (
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://www.luohanacademy.com'
              >
                role
              </a>
            ),
          },
          (me?.id !== user.id && {
            key: '4',
            label: (
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://www.luohanacademy.com'
              >
                exclure
              </a>
            ),
          }) ||
            null,
          {
            key: '5',
            label: (
              <>
                <div onClick={() => showModal(user)}>Profil</div>
                <Modal
                  title='profil'
                  visible={isModalVisible}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  footer={null}
                >
                  {user.id === me?.id ? (
                    <UserProfileSettings />
                  ) : (
                    <UserProfileModal
                      openPrivateChat={openPrivateChat}
                      user={selectedUser ?? user}
                    />
                  )}
                </Modal>
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
        items={[
          (me?.id !== user.id && {
            key: '1',
            label: <p onClick={() => openPrivateChat(user)}>message</p>,
          }) ||
            null,
          {
            key: '3',
            label: (
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://www.luohanacademy.com'
              >
                role
              </a>
            ),
          },
          (me?.id !== user.id && {
            key: '4',
            label: (
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://www.luohanacademy.com'
              >
                exclure
              </a>
            ),
          }) ||
            null,
          {
            key: '5',
            label: (
              <>
                <div onClick={() => showModal(user)}>Profil</div>
                <Modal
                  title='profil'
                  visible={isModalVisible}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  footer={null}
                >
                  {user.id === me?.id ? (
                    <UserProfileSettings />
                  ) : (
                    <UserProfileModal
                      openPrivateChat={openPrivateChat}
                      user={selectedUser ?? user}
                    />
                  )}
                </Modal>
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
      <Collapse defaultActiveKey={['1', '2']} ghost>
        <Panel key='1' header='en ligne' style={{ margin: '0 !important' }}>
          {Array.from(serverUserMap.entries()).map(([id, user]) =>
            user.user.status ? (
              <Dropdown
                key={id}
                overlay={menu(user.user)}
                placement='bottomLeft'
                trigger={['click']}
                arrow
              >
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
                  <CustomImage obj={user} key={id} />{' '}
                  <Typography
                    style={{
                      width: '100%',
                      paddingLeft: '30px',
                      fontWeight: 'bold',
                      color: '#A1A1A1',
                    }}
                  >
                    {user.nickname}
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
                arrow
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
                  <CustomImage obj={user} key={id} />{' '}
                  <Typography
                    style={{
                      width: '100%',
                      height: '100%',
                      paddingLeft: '30px',
                      fontWeight: 'bold',
                      color: '#A1A1A1',
                    }}
                  >
                    {user.nickname}
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
