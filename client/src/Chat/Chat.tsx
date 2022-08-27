import 'antd/dist/antd.min.css';
import Message from './Message';
import ChatBar from './ChatBar';
import { useAppSelector } from '../redux/hooks';
import PrivateMessageChat from './PrivateMessageChat';
import { Channel } from '../types/types';
import { Typography } from 'antd';
import { BorderlessTableOutlined, WechatOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { CameraView } from './CameraView';

const Chat = (props: { textChannelList: Channel[] }) => {
  const isHome = useAppSelector((state) => state.userReducer.home);
  const cameraChat = useAppSelector((state) => state.userReducer.cameraChat);
  const { textChannelList } = props;
  const activeChannel = useAppSelector(
    (state) => state.userReducer.activeChannel
  );
  const textChannelName = textChannelList.find(
    (chan) => chan.id === activeChannel
  );
  const [name, setName] = useState('');
  return (
    <div className='chat'>
      <div
        style={{
          height: isHome ? '41px' : '42px',
          width: '100%',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '16.8px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid rgba(26, 26, 26, 0.67)',
          // backgroundColor: '#2F3136',
        }}
      >
        <Typography
          style={{
            color: 'white',
            paddingLeft: '15px',
            fontWeight: 'bold',
            fontSize: '16.8px',
          }}
        >
          {activeChannel === -1 ? (
            <WechatOutlined
              style={{ color: 'darkgrey', marginRight: '10px' }}
            />
          ) : (
            <BorderlessTableOutlined
              style={{ color: 'darkgrey', marginRight: '10px' }}
            />
          )}

          {isHome
            ? name
            : activeChannel === -1
            ? 'Ai Chat'
            : textChannelName?.name ?? 'Private Chats'}
        </Typography>
      </div>
      <div className={cameraChat ? 'messageCam' : 'message'}>
        {isHome ? (
          <PrivateMessageChat name={name} setName={setName} />
        ) : cameraChat ? (
          <CameraView />
        ) : (
          <Message />
        )}
      </div>
      {!cameraChat && (
        <div className='chatbar'>
          <ChatBar textChannelList={textChannelList} />
        </div>
      )}
    </div>
  );
};

export default Chat;
