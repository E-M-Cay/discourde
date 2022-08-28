import { CloseOutlined, EditOutlined, RotateLeftOutlined, SettingFilled } from '@ant-design/icons';
import { Modal, Typography, Input, Avatar, Divider, Tabs, Button, Dropdown } from 'antd';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import { Channel, ServerResponse, ServerUser, VocalChan } from '../types/types';
import { UserMapsContext } from '../context/UserMapsContext';
import { CustomImage } from '../CustomLi/CustomLi';

const { TabPane } = Tabs;

let listOfRoles: Array<any> = [];
const PermModal = (props: {
    isModalVisiblePerm: boolean;
setIsPermModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  servers: ServerResponse[];
}) => {
  const {
    isModalVisiblePerm,
    setIsPermModalVisible,
    servers,
  } = props;

  const { me } = useAppSelector((state) => state.userReducer);
  const activeServer = useAppSelector(
    (state) => state.userReducer.activeServer
  );
  const handleRoleOk = () => {
    setIsPermModalVisible(false);
  };

  const handleRoleCancel = () => {
    setIsPermModalVisible(false);
  };
 

  return (
    <Modal title="Gestion des permissions" visible={isModalVisiblePerm} onOk={handleRoleOk} onCancel={handleRoleCancel}>
        <p>oui</p>
      </Modal>
  );
};

export default PermModal;
