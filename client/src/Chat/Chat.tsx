import 'antd/dist/antd.min.css';
import Message from './Message';
import ChatBar from './ChatBar';
import { useAppSelector } from '../redux/hooks';
import PrivateMessageChat from './PrivateMessageChat';
import { Channel } from '../types/types';

const Chat = (props: { textChannelList: Channel[] }) => {
  const isHome = useAppSelector((state) => state.userReducer.home);
  const { textChannelList } = props;
  return (
    <div className='chat'>
      <div className='message'>
        {isHome ? <PrivateMessageChat /> : <Message />}
      </div>
      <div className='chatbar'>
        <ChatBar textChannelList={textChannelList} />
      </div>
    </div>
  );
};

export default Chat;
