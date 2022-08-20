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
  showModal2: Function;
  showServerParamsModal: () => void;
  showModal: Function;
  deleteServer: Function;
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
                style={{ color: 'white' }}
                key={0}
                onClick={() => showModal2()}
              >
                <UserAddOutlined
                  style={{
                    color: 'darkgrey',
                    fontSize: 'small',
                  }}
                />{' '}
                Inviter des gens{' '}
              </li>
            ),
            key: '0',
          },
          {
            label: (
              <li style={{ color: 'white' }} key={1}>
                <TeamOutlined
                  style={{
                    color: 'darkgrey',
                    fontSize: 'small',
                  }}
                />{' '}
                Gestion des membres{' '}
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
                style={{ color: 'white' }}
                onClick={() => showServerParamsModal()}
                key={2}
              >
                <SettingOutlined
                  style={{
                    color: 'darkgrey',
                    fontSize: 'small',
                  }}
                />{' '}
                Paramètres du serveur{' '}
              </li>
            ),
            key: '2',
          },
          {
            label: (
              <li
                style={{ color: 'white' }}
                key={3}
                onClick={() => showModal()}
              >
                <PlusCircleOutlined
                  style={{
                    color: 'darkgrey',
                    fontSize: 'small',
                  }}
                />{' '}
                Créer un salon{' '}
              </li>
            ),
            key: '3',
          },
          {
            label: (
              <li
                style={{ color: 'white' }}
                key={4}
                onClick={() => deleteServer()}
              >
                <PlusCircleOutlined
                  style={{
                    color: 'darkgrey',
                    fontSize: 'small',
                  }}
                />{' '}
                Supprimer serveur{' '}
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
                style={{ color: 'white' }}
                onClick={() => showNotificationModal()}
                key={5}
              >
                <BellOutlined
                  style={{
                    color: 'darkgrey',
                    fontSize: 'small',
                  }}
                />{' '}
                Notifications <Badge count={notifications.length}></Badge>
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
                style={{ color: 'white' }}
                key={6}
                onClick={() => handleLeaveServer()}
              >
                <LogoutOutlined
                  style={{
                    color: 'red',
                    fontSize: 'small',
                  }}
                />{' '}
                Quitter le serveur{' '}
              </li>
            ),
            key: '6',
          },
        ]}
      />
      <Modal
        title='Notification'
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
