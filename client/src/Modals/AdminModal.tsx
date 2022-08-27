import { EditOutlined, SettingFilled } from '@ant-design/icons';
import { Modal, Typography, Input, Avatar, Divider, Tabs, Button, Dropdown } from 'antd';
import axios from 'axios';
import { useContext, useState } from 'react';
import { NotificationsContext } from '../context/NotificationsContext';
import { useAppSelector } from '../redux/hooks';
import { Channel, ServerResponse, ServerUser, VocalChan } from '../types/types';
import { serverPng } from '../profilePng/profilePng';
import { User } from '../types/types';
import { UserMapsContext } from '../context/UserMapsContext';
import { CustomImage } from '../CustomLi/CustomLi';

const { TabPane } = Tabs;

const AdminModal = (props: {
    isModalVisibleAdmin: boolean;
setIsAdminModalVisible: React.Dispatch<React.SetStateAction<boolean>>;

  servers: ServerResponse[];
}) => {
  const {
    isModalVisibleAdmin,
    setIsAdminModalVisible,
    servers,
  } = props;

  const { serverUserMap } = useContext(UserMapsContext);

  const activeServer = useAppSelector(
    (state) => state.userReducer.activeServer
  );

  const showAdminModal = () => {
    setIsAdminModalVisible(true);
  };

  const handleAdminOk = () => {
    setIsAdminModalVisible(false);
  };

  const handleAdminCancel = () => {
    setIsAdminModalVisible(false);
  };
  const onChange = (key: any) => {
    console.log(key);
  };
  
  const onClickUserList = (user : ServerUser) => {
    console.log("UUSSSER")
    console.log(user)
  }
  
  

  return (
    <Modal title="Gestion des membres" visible={isModalVisibleAdmin} onOk={handleAdminOk} onCancel={handleAdminCancel}>
        <Tabs onChange={onChange}>
          <TabPane tab='Liste des membres' key="1">
            <div>
                {Array.from(serverUserMap.entries()).map(([id, user]) => 
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
                <SettingFilled style={{fontSize: 'large'}} onClick={() => onClickUserList(user)}/>
              </div>
              )}
            </div>
            </TabPane>
            <TabPane tab='Liste des roles' key="2">
            LISTE DES ROLES
            </TabPane>
          </Tabs>
      </Modal>
  );
};

export default AdminModal;
