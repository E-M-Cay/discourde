import 'antd/dist/antd.min.css';
import Message from './Message';
import ChatBar from './ChatBar';
import { UserMap } from '../types/types';

const Chat = (props: { userMap: UserMap }) => {
    const { userMap } = props;
    return (
        <div className='chat'>
            <div className='message'>
                <Message userMap={userMap} />
            </div>
            <div className='chatbar'>
                <ChatBar />
            </div>
        </div>
    );
};

export default Chat;
