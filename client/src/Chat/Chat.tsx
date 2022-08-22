import 'antd/dist/antd.min.css';
import Message from './Message';
import ChatBar from './ChatBar';
import { useAppSelector } from '../redux/hooks';
import PrivateMessageChat from './PrivateMessageChat';
import { Channel } from '../types/types';
import { Typography } from 'antd';
import { BorderlessTableOutlined } from '@ant-design/icons';
import { useState } from 'react';

const Chat = (props: { textChannelList: Channel[] }) => {
  const isHome = useAppSelector((state) => state.userReducer.home);
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
          height: isHome ? '43px' : '44px',
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
          <BorderlessTableOutlined
            style={{ color: 'darkgrey', marginRight: '10px' }}
          />
          {isHome ? name : textChannelName?.name ?? 'Private Chats'}
        </Typography>
      </div>
      <div className='message'>
        {isHome ? (
          <PrivateMessageChat name={name} setName={setName} />
        ) : (
          <Message />
        )}
      </div>
      <div className='chatbar'>
        <ChatBar textChannelList={textChannelList} />
      </div>
    </div>
  );
};

export default Chat;
