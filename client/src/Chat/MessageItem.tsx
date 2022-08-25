import { CustomImageMess } from '../CustomLi/CustomLi';
import { ServerUser } from '../types/types';
import logo from '../assets/discourde.png';
import { useState } from 'react';

type UserMap = Omit<Map<number, ServerUser>, 'delete' | 'set' | 'clear'>;

export const MessageItem = (props: {
  id: number;
  picture?: string;
  username: string;
  content: string;
  send_time: string;
  compress: number;
  isLast: boolean;
  //décomposer props directement avec username, picture, id
}) => {
  const { picture, username, id, content, send_time, compress, isLast } = props;

  return (
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
            <span className='time'> {send_time}</span>
          </div>
        )}
        <div
          className='messageItemContentText'
          style={{
            maxWidth: '100%',
            wordBreak: 'break-word',
            marginLeft: compress !== 1 ? '73px' : '0',
            marginTop: compress === 3 ? '-10px' : '0',
          }}
        >
          {content}
        </div>
      </div>
    </div>
  );
};
