import 'antd/dist/antd.min.css';
import Message from './Message';
import ChatBar from './ChatBar';
import { useAppSelector } from '../redux/hooks';
import PrivateMessageChat from './PrivateMessageChat';

const Chat = () => {
  const isHome = useAppSelector((state) => state.userReducer.home);
  return (
    <div className='chat'>
      <div className='message'>
        {isHome ? <PrivateMessageChat /> : <Message />}
      </div>
      <div className='chatbar'>
        <ChatBar />
      </div>
    </div>
  );
};

export default Chat;
