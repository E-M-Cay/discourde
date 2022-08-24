import { CustomImageMess } from '../CustomLi/CustomLi';
import { ServerUser } from '../types/types';
import logo from '../assets/discourde.png';

type UserMap = Omit<Map<number, ServerUser>, 'delete' | 'set' | 'clear'>;

export const MessageItem = (props: {
  id: number;
  picture?: string;
  username: string;
  content: string;
  send_time: string;
  //décomposer props directement avec username, picture, id
}) => {
  const { picture, username, id, content, send_time } = props;

  return (
    <div className='messageItem'>
      <div className='messageItemAvatar'>
        <CustomImageMess nickname={username} picture={picture ?? logo} />
      </div>
      <div className='messageItemContent'>
        <div className='messageItemContentName'>
          {' '}
          {username}
          <span className='time'> {send_time}</span>
        </div>
        <div
          className='messageItemContentText'
          style={{ maxWidth: '100%', wordBreak: 'break-word' }}
        >
          {content}
        </div>
      </div>
    </div>
  );
};
