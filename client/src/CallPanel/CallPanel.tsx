import {
  AudioMutedOutlined,
  BoldOutlined,
  MenuOutlined,
  PhoneOutlined,
  SoundOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Collapse,
  Divider,
  Dropdown,
  Menu,
  Skeleton,
  Space,
  Tabs,
  Tooltip,
  Input,
  Layout,
  Slider,
} from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import React, { useContext, useState } from 'react';
import { UserMapsContext } from '../context/UserMapsContext';
import './CallPanel.css';

const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Search } = Input;

let testUsers: Array<any> = [];
testUsers.push({ id: 1, nickName: 'Nathan' });

export const CallPanel = () => {
  const { serverUserMap } = useContext(UserMapsContext);

  return (
    <Layout className='vocStyle'>
      <header>
        <SoundOutlined /> %Nom du chanel vocal%
      </header>
      <Content style={{textAlign: 'center', lineHeight: '50vh'}}>
        <p>%AFFICHAGE DES PARTICIPANTS AVATAR EN FOND + PSEUDO%</p>
      </Content>
      <footer style={{textAlign: 'center'}}>
      <Tooltip placement='top' title={'Couper le micro'}>
        <button>
          <AudioMutedOutlined id='audio' />
        </button>
        </Tooltip>
        <Tooltip placement='top' title={'Raccrocher'}>
        <button>
          <PhoneOutlined id='phone' />
        </button>
        </Tooltip>
        <Tooltip placement='top' title={<Slider vertical defaultValue={50} className='volSider' />}>
        <button>
          <SoundOutlined id='volume' />
        </button>
        </Tooltip>
      </footer>
    </Layout>
  );
};
