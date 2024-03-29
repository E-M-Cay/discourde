import {
  BellOutlined,
  LogoutOutlined,
  PlusCircleOutlined,
  SettingOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Badge, Menu, Modal } from 'antd';
import { useContext, useState } from 'react';
import { NotificationsComponent } from '../components/NotificationsComponent';
import { NotificationsContext } from '../context/NotificationsContext';
import { useAppSelector } from '../redux/hooks';

export const DropdownMenu = (params: {
  showModal2: () => void;
  showServerParamsModal: () => void;
  showModal: () => void;
  deleteServer: () => void;
  handleLeaveServer: () => void;
}) => {
  const {
    showModal2,
    showServerParamsModal,
    showModal,
    deleteServer,
    handleLeaveServer,
  } = params;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { notifications, clearNotification } = useContext(NotificationsContext);

  const activeServerOwner = useAppSelector(
    (state) => state.userReducer.activeServerOwner
  );
  const me = useAppSelector((state) => state.userReducer.me);
  var idUser = -2;
  if (me) idUser = me.id;

  const showNotificationModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    clearNotification();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    clearNotification();
  };

  return (
    <>
      <Menu
        className='menu'
        items={[
          {
            label: (
              <div
                style={{
                  fontWeight: '600',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '14px',
                }}
                className='purple-item menu-hover'
                key={0}
                onClick={() => showModal2()}
              >
                Inviter des amis
                <UserAddOutlined
                  style={{
                    fontSize: '15px',
                  }}
                />
              </div>
            ),
            key: '0',
          },
          // activeServerOwner ===  idUser
          //   ? {
          //       label: (
          //         <div
          //           style={{
          //             fontWeight: '600',
          //             width: '100%',
          //             display: 'flex',
          //             justifyContent: 'space-between',
          //             alignItems: 'center',
          //             fontSize: '14px',
          //           }}
          //           key={1}
          //         >
          //           Gestion des membres
          //           <TeamOutlined
          //             style={{
          //               fontSize: '15px',
          //             }}
          //           />
          //         </div>
          //       ),
          //       key: '1',
          //     }
          //   : null,

          activeServerOwner === idUser
            ? {
                label: (
                  <div
                    style={{
                      fontWeight: '600',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '14px',
                    }}
                    onClick={() => showServerParamsModal()}
                    key={2}
                  >
                    Paramètres du serveur
                    <SettingOutlined
                      style={{
                        fontSize: '15px',
                      }}
                    />
                  </div>
                ),
                key: '2',
              }
            : null,
          activeServerOwner === idUser
            ? {
                type: 'divider',
              }
            : null,
          activeServerOwner === idUser
            ? {
                label: (
                  <div
                    style={{
                      fontWeight: '600',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '14px',
                    }}
                    key={3}
                    onClick={() => showModal()}
                  >
                    Créer un salon
                    <PlusCircleOutlined
                      style={{
                        fontSize: '15px',
                      }}
                    />
                  </div>
                ),
                key: '3',
              }
            : null,
          activeServerOwner === idUser
            ? {
                label: (
                  <div
                    style={{
                      fontWeight: '600',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '14px',
                    }}
                    key={4}
                    onClick={() => deleteServer()}
                  >
                    Supprimer serveur
                    <PlusCircleOutlined
                      style={{
                        fontSize: '15px',
                      }}
                    />
                  </div>
                ),
                key: '4',
              }
            : null,
          {
            type: 'divider',
          },
          {
            label: (
              <div
                style={{
                  fontWeight: '600',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '14px',
                }}
                onClick={() => showNotificationModal()}
                key={5}
              >
                <span>
                  Notifications{' '}
                  <Badge
                    count={notifications.length}
                    style={{ marginBottom: '10px' }}
                    size='small'
                  ></Badge>
                </span>{' '}
                <BellOutlined
                  style={{
                    fontSize: '15px',
                  }}
                />
              </div>
            ),
            key: '5',
          },
          activeServerOwner !== idUser && activeServerOwner !== -1
            ? {
                type: 'divider',
              }
            : null,
          activeServerOwner !== idUser && activeServerOwner !== -1
            ? {
                label: (
                  <div
                    style={{
                      fontWeight: '600',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '14px',
                    }}
                    className='red-item menu-hover'
                    key={6}
                    onClick={() => handleLeaveServer()}
                  >
                    Quitter le serveur
                    <LogoutOutlined
                      style={{
                        fontSize: '15px',
                      }}
                    />
                  </div>
                ),
                key: '6',
              }
            : null,
        ]}
      />
      <Modal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        footer={null}
      >
        <NotificationsComponent />
      </Modal>
    </>
  );
};
