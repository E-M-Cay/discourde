import React, { useContext, useState } from 'react';
import 'antd/dist/antd.min.css';
import { Input, Form } from 'antd';
import { PeerSocketContext } from '../context/PeerSocket';
import { useAppSelector } from '../redux/hooks';
import Picker from 'emoji-picker-react';
import { CloseOutlined, SmileOutlined } from '@ant-design/icons';

const ChatBar = () => {
  const { socket } = useContext(PeerSocketContext);
  const [input, setInput] = useState<string>('');
  const activeChannel = useAppSelector(
    (state) => state.userReducer.activeChannel
  );

  const onSubmitHandler = () => {
    socket?.emit('message', {
      content: input,
      channel: activeChannel,
    });

    setInput('');
  };

  const [isSmiley, setIsSmiley] = useState(false);

  const onEmojiClick = (event: React.MouseEvent, emojiObject: any) => {
    setInput(input + emojiObject.emoji);
  };

  // const user = useAppSelector((state) => state.userReducer);

  // const { peer, socket } = useContext(PeerSocketContext);

  // function handleKeyDown(e: any) {
  //     if (e.key === 'Enter') {
  //         console.log(message);
  //         setMessage('')
  //       socket?.emit('message', {message: message, username: 'toto', channel: 'toto'});

  //     }
  // }

  return (
    <div className='chatbar'>
      <Form style={{ width: '100%' }} onSubmitCapture={onSubmitHandler}>
        <Input
          bordered={false}
          className='inputMain'
          placeholder='Envoyer un message dans '
          onChange={(e) => setInput(e.target.value)}
          value={input}
          addonAfter={
            <SmileOutlined
              onClick={() => setIsSmiley(!isSmiley)}
              style={{ fontSize: '15px', color: '#A1A1A1' }}
            />
          }
        />
        {isSmiley && (
          <div
            style={{ position: 'relative', bottom: '355px', right: '-1045px' }}
          >
            <Picker
              disableSearchBar
              disableAutoFocus={true}
              onEmojiClick={onEmojiClick}
            />
            <CloseOutlined
              style={{
                position: 'relative',
                bottom: '322px',
                left: '2px',
                cursor: 'pointer',
              }}
              onClick={() => setIsSmiley(!isSmiley)}
            />
          </div>
        )}
      </Form>
    </div>
  );
};

export default ChatBar;
