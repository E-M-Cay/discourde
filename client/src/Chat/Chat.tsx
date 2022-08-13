import 'antd/dist/antd.min.css';
import Message from './Message';
import ChatBar from './ChatBar';
import { PrivateChatMap, UserMap } from '../types/types';
import { useAppSelector } from '../redux/hooks';
import PrivateMessageChat from './PrivateMessageChat';
import PrivateChatInput from './PrivateChatInput';

const Chat = (props: { userMap: UserMap; privateChatMap: PrivateChatMap }) => {
    const { userMap, privateChatMap } = props;
    const isHome = useAppSelector((state) => state.userReducer.home);
    return (
        <div className='chat'>
            <div className='message'>
                {isHome ? (
                    <PrivateMessageChat privateChatMap={privateChatMap} />
                ) : (
                    <Message userMap={userMap} />
                )}
            </div>
            <div className='chatbar'>
                {isHome ? <PrivateChatInput /> : <ChatBar />}
            </div>
        </div>
    );
};

export default Chat;
