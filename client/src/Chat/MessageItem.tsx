import { CustomImageMess } from '../CustomLi/CustomLi';
import { ServerUser } from '../types/types';
import logo from '../assets/discourde.png';
import { useState } from 'react';
import { getByDisplayValue } from '@testing-library/react';

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

  const today = new Date();

  const testToday = today.toISOString();

  let displayDate = '';

  let sendTime = '';

  if (send_time.split('T').length === 1) {
    sendTime = testToday;
  } else {
    sendTime = send_time;
  }

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
            <span className='time'> {displayDate}</span>
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
