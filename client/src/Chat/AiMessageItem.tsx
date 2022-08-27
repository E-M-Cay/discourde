import { CustomImageMess } from '../CustomLi/CustomLi';
import { ServerUser } from '../types/types';
import logo from '../assets/discourde.png';
import { Divider } from 'antd';
import { useAppSelector } from '../redux/hooks';

type UserMap = Omit<Map<number, ServerUser>, 'delete' | 'set' | 'clear'>;

export const AiMessageItem = (props: {
  username: string;
  content: string;
  send_time: string;

  //décomposer props directement avec username, picture, id
}) => {
  const { username, content, send_time } = props;
  
  const aiMsg = useAppSelector((state) => state.userReducer.aiMsg);
  console.log("ICI" + aiMsg)
  return (
    <>
      <div
        className='messageItem'
        style={{
          marginTop: '30px',
          marginLeft: '10px',
        }}
      >
        <div className='messageItemAvatar'>
          <CustomImageMess nickname={username} picture={logo} />
        </div>
        <div className='messageItemContent'>
          <div className='messageItemContentName'>
            {' '}
            {username}
            <span className='time'> {send_time}</span>
          </div>
          <div
            className='messageItemContentText'
            style={{
              maxWidth: '100%',
              wordBreak: 'break-word',
              marginLeft: '0',
            }}
          >
            {aiMsg}
          </div>
        </div>
      </div>
    </>
  );
};
