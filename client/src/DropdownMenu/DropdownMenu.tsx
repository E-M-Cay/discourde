import {
  BellOutlined,
  LogoutOutlined,
  PlusCircleOutlined,
  SettingOutlined,
  TeamOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Badge, Menu, Modal, Tabs } from 'antd';
import { useContext, useState } from 'react';
import { NotificationsComponent } from '../components/NotificationsComponent';
import { NotificationsContext } from '../context/NotificationsContext';
import { useAppSelector } from '../redux/hooks';
const { TabPane } = Tabs;


export const DropdownMenu = (params: {
  showModal2: () => void;
  showServerParamsModal: () => void;
  showModal: () => void;
  deleteServer: () => void;
  handleLeaveServer: () => void;
  showAdminModal: () => void;
}) => {
  const {
    showModal2,
    showServerParamsModal,
    showModal,
    deleteServer,
    handleLeaveServer,
    showAdminModal,
  } = params;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { notifications, clearNotification } = useContext(NotificationsContext);

  const activeServerOwner = useAppSelector(
    (state) => state.userReducer.activeServerOwner
  );
  const me = useAppSelector((state) => state.userReducer.me);

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
              <li
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
                Inviter des gens
                <UserAddOutlined
                  style={{
                    fontSize: '15px',
                  }}
                />
              </li>
            ),
            key: '0',
          },
          activeServerOwner === me?.id
            ? {
                label: (
                  <li
                    style={{
                      fontWeight: '600',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '14px',
                    }}
                    key={1}
                    onClick={() => showAdminModal()}
                  >
                    Gestion des membres
                    <TeamOutlined
                      style={{
                        fontSize: '15px',
                      }}
                    />
                  </li>
                ),
                key: '1',
              }
            : null,
          {
            type: 'divider',
          },
          activeServerOwner === me?.id
            ? {
                label: (
                  <li
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
                  </li>
                ),
                key: '2',
              }
            : null,
          {
            label: (
              <li
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
              </li>
            ),
            key: '3',
          },
          activeServerOwner === me?.id
            ? {
                label: (
                  <li
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
                  </li>
                ),
                key: '4',
              }
            : null,
          {
            type: 'divider',
          },
          {
            label: (
              <li
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
              </li>
            ),
            key: '5',
          },
          activeServerOwner !== me?.id && activeServerOwner !== -1
            ? {
                type: 'divider',
              }
            : null,
          activeServerOwner !== me?.id && activeServerOwner !== -1
            ? {
                label: (
                  <li
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
                  </li>
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
