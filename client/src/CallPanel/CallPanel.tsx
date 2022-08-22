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
  Image,
} from 'antd';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import React, { useContext, useState } from 'react';
import { UserMapsContext } from '../context/UserMapsContext';
import './CallPanel.css';
import fakeUsers from '../mockVocUsers';

const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Search } = Input;
let src: string = "";
let width: number = 200;
let chanName: string = "testVocalChanel";
let marginTopPP: string = '30vh';
export const CallPanel = () => {
  const { serverUserMap } = useContext(UserMapsContext);
  if(fakeUsers.length > 4){
    width = 150;
    marginTopPP = "20vh";
  } else {marginTopPP = '40vh'}
  const onClick = (e: number) => {
    return (event: React.MouseEvent) => {
      console.log('id User : ', e);
      event.preventDefault();
    }
    
  };
  return (
    <Layout className='vocStyle'>
      <Header>
        <SoundOutlined /> {chanName}
      </Header>
      <Content style={{textAlign: 'center', marginTop: marginTopPP}}>
        {/* <p>{testUsers.map(user => {
          return user;
        })}</p> */}
         {fakeUsers.map(user => {
          src = user.avatar;
          return <div  className='ProfilPic'><img onClick={onClick(user.id)} src={src} width={width}/><h1>{user.nickName}</h1></div>
        })}
      </Content>
      <Footer style={{textAlign: 'center'}}>
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
      </Footer>
    </Layout>
  );
};
