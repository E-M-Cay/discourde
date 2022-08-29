import 'antd/dist/antd.min.css';
import Message from './Message';
import ChatBar from './ChatBar';
import { useAppSelector } from '../redux/hooks';
import PrivateMessageChat from './PrivateMessageChat';
import { Channel, VocalChan } from '../types/types';
import { Typography } from 'antd';
import { BorderlessTableOutlined, WechatOutlined } from '@ant-design/icons';
import { useContext, useState } from 'react';
import { VocalChannelContext } from '../components/VocalChannel';

const Chat = (props: {
  textChannelList: Channel[];
  vocalChannelList: VocalChan[];
}) => {
  const isHome = useAppSelector((state) => state.userReducer.home);
  const { cameraChat, activeVocalChannel } = useAppSelector(
    (state) => state.userReducer
  );
  const { textChannelList, vocalChannelList } = props;
  const activeChannel = useAppSelector(
    (state) => state.userReducer.activeChannel
  );
  const textChannelName = textChannelList.find(
    (chan) => chan.id === activeChannel
  );
  const currentVocalChannel = vocalChannelList.find(
    (c) => c.id === activeVocalChannel
  );
  const { displayCameraView } = useContext(VocalChannelContext);
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
            ? name || 'Home'
            : activeChannel === -1
            ? 'Ai Chat'
            : textChannelName?.name ?? 'Private Chats'}
        </Typography>
      </div>
      <div className={cameraChat ? 'messageCam' : 'message'}>
        {isHome ? (
          <PrivateMessageChat name={name} setName={setName} />
        ) : cameraChat && currentVocalChannel ? (
          displayCameraView(currentVocalChannel)
        ) : (
          <Message />
        )}
      </div>
      {(!cameraChat || isHome) && (
        <div className='chatbar'>
          <ChatBar textChannelList={textChannelList} />
        </div>
      )}
    </div>
  );
};

export default Chat;
