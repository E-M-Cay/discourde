import { CustomImageMess } from '../CustomLi/CustomLi';
import { ServerUser } from '../types/types';
import logo from '../assets/discourde.png';
import { Divider } from 'antd';
import { useSelector } from 'react-redux';

type UserMap = Omit<Map<number, ServerUser>, 'delete' | 'set' | 'clear'>;

export const AiMessageItem = (props: {
  username: string;
  content: string;
  send_time: string;

  //décomposer props directement avec username, picture, id
}) => {
  const { username, content, send_time } = props;
  const me = useSelector((state: any) => state.userReducer.me);
  console.log(content === '', username, 'gdgdhdhjdgdghdh');
  return (
    <>
      <div
        className='messageItem'
        style={{
          marginBottom: '30px',
          marginLeft: '10px',
        }}
      >
        <div className='messageItemAvatar'>
          <CustomImageMess
            nickname={username}
            picture={
              username !== 'Inteligence Artificielle' ? me.picture : logo
            }
          />
        </div>
        <div className='messageItemContent'>
          <div className='messageItemContentName'>
            {' '}
            {username}
            <span className='time'>le 1er janvier 1970 à 00 h</span>
          </div>
          <div
            className='messageItemContentText'
            style={{
              maxWidth: '100%',
              wordBreak: 'break-word',
              marginLeft: '0',
            }}
          >
            {content}
          </div>
        </div>
      </div>
    </>
  );
};
