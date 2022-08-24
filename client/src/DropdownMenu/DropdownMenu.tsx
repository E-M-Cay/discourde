import {
  BellOutlined,
  LogoutOutlined,
  PlusCircleOutlined,
  SettingOutlined,
  TeamOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Menu, Modal } from 'antd';
import axios from 'axios';
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
  const activeServer = useAppSelector(
    (state) => state.userReducer.activeServer
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
                key={1}
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
          },
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
          },
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
          },
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
