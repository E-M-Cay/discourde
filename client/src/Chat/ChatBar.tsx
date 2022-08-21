import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import 'antd/dist/antd.min.css';
import { Input, Form } from 'antd';
import { PeerSocketContext } from '../context/PeerSocket';
import { useAppSelector } from '../redux/hooks';
import Picker from 'emoji-picker-react';
import { CloseOutlined, SmileOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';

const ChatBar = () => {
  const { socket } = useContext(PeerSocketContext);
  const [input, setInput] = useState<string>('');
  const node = useRef<HTMLDivElement>(null);
  const inputRef = useRef<InputRef>(null);
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

  const [isSmiley, setIsSmiley] = useState(true);

  const onEmojiClick = (event: React.MouseEvent, emojiObject: any) => {
    setInput(input + emojiObject.emoji);
    inputRef.current?.focus();
    setIsSmiley(false);
  };
  const handleOutsideClick = useCallback(
    (e: any) => {
      if (node.current && node.current.contains(e.target)) {
        return;
      }
      console.log('outside click', node);
      setIsSmiley(false);
    },
    [node]
  );
  useEffect(() => {
    if (isSmiley) {
      document.addEventListener('click', handleOutsideClick, false);
    } else {
      document.removeEventListener('click', handleOutsideClick, false);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick, false);
    };
  }, [isSmiley, handleOutsideClick]);

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
        <div ref={node}>
          <Input
            bordered={false}
            className='inputMain'
            placeholder='Envoyer un message dans '
            id='inputReturn'
            onChange={(e) => setInput(e.target.value)}
            value={input}
            ref={inputRef}
          />
          <SmileOutlined
            onClick={() => setIsSmiley(!isSmiley)}
            className='smileyA'
            style={{
              position: 'relative',
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#A1A1A1',
              left: '1290px',
              bottom: '33px',
              padding: '8px',
            }}
          />
        </div>
        {isSmiley && (
          <div
            style={{ position: 'relative', bottom: '394px', right: '-1045px' }}
          >
            <Picker
              disableSearchBar
              disableAutoFocus
              onEmojiClick={onEmojiClick}
              groupNames={{
                smileys_people: 'visages',
                animals_nature: 'animaux et nature',
                food_drink: 'boisson et nourriture',
                travel_places: 'voyage et lieu',
                activities: 'jeux et activité',
                objects: 'objets',
                symbols: 'symboles',
                flags: 'drapeaux',
                recently_used: 'utilisé récemment',
              }}
            />
          </div>
        )}
      </Form>
    </div>
  );
};

export default ChatBar;
