import { CustomImageMess } from '../CustomLi/CustomLi';
import { ServerUser } from '../types/types';
import logo from '../assets/discourde.png';
import { Divider } from 'antd';

type UserMap = Omit<Map<number, ServerUser>, 'delete' | 'set' | 'clear'>;

export const MessageItem = (props: {
  id: number;
  picture?: string;
  username: string;
  content: string;
  send_time: string;
  compress: number;
  isLast: boolean;
  isNewDay: boolean;
  fromNormalChat?: boolean;
  //décomposer props directement avec username, picture, id
}) => {
  const {
    picture,
    username,
    id,
    content,
    send_time,
    compress,
    isLast,
    isNewDay,
    fromNormalChat,
  } = props;

  let today = new Date();

  // let incr = fromNormalChat ? 14400000 : 0;

  today = new Date(today.getTime() + 7200000);

  const testToday = today.toISOString();

  let displayDate = '';

  let sendTime = '';
  if (send_time.split('T').length === 1) {
    sendTime = new Date(send_time).toISOString();
  } else {
    sendTime = send_time;
  }

  console.log(testToday, sendTime);
  if (testToday.split('T')[0] === sendTime.split('T')[0]) {
    displayDate =
      "Aujourd'hui à " +
      sendTime.split('T')[1].split(':')[0] +
      ':' +
      sendTime.split('T')[1].split(':')[1];
  } else if (
    testToday.split('T')[0].split('-')[1] ===
      sendTime.split('T')[0].split('-')[1] &&
    Number(testToday.split('T')[0].split('-')[2]) - 1 ===
      Number(sendTime.split('T')[0].split('-')[2])
  ) {
    displayDate =
      'Hier à ' +
      sendTime.split('T')[1].split(':')[0] +
      ':' +
      sendTime.split('T')[1].split(':')[1];
  } else {
    displayDate =
      sendTime.split('T')[0].split('-')[2] +
      '/' +
      sendTime.split('T')[0].split('-')[1] +
      '/' +
      sendTime.split('T')[0].split('-')[0];
  }

  let toLocate = new Date(send_time);

  return (
    <>
      {isNewDay && (
        <div
          className='dateDividerFix'
          style={{
            width: '1340px',
            marginLeft: '15px !important',
            marginBottom: '-10px',
          }}
        >
          <Divider className='dateBorderDivider'>
            {toLocate.toLocaleDateString('fr-FR', { dateStyle: 'long' })}
          </Divider>
        </div>
      )}
      <div
        className='messageItem'
        style={{
          marginTop: compress !== 1 ? '0' : '30px',
          marginBottom: isLast ? '20px' : '0',
          marginLeft: '10px',
        }}
      >
        {compress === 1 && (
          <div className='messageItemAvatar'>
            <CustomImageMess nickname={username} picture={picture ?? logo} />
          </div>
        )}
        <div className='messageItemContent'>
          {compress === 1 && (
            <div className='messageItemContentName'>
              {' '}
              {username}
              <span className='time'> {displayDate}</span>
            </div>
          )}
          <div
            className='messageItemContentText'
            style={{
              maxWidth: '100%',
              wordBreak: 'break-word',
              marginLeft: compress !== 1 ? '72px' : '0',
              marginTop: compress === 3 ? '-8px' : '0px',
            }}
          >
            {content}
          </div>
        </div>
      </div>
    </>
  );
};
