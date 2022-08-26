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
import { SmileOutlined } from '@ant-design/icons';
import { InputRef } from 'antd';
import { UserMapsContext } from '../context/UserMapsContext';
import { Channel } from '../types/types';

const ChatBar = (props: { textChannelList: Channel[] }) => {
  const { textChannelList } = props;
  const { socket } = useContext(PeerSocketContext);
  const { privateChatMap } = useContext(UserMapsContext);
  const [input, setInput] = useState<string>('');
  const node = useRef<HTMLDivElement>(null);
  const inputRef = useRef<InputRef>(null);
  const [isSmiley, setIsSmiley] = useState(false);
  const activeChannel = useAppSelector(
    (state) => state.userReducer.activeChannel
  );
  const activePrivateChat = useAppSelector(
    (state) => state.userReducer.activePrivateChat
  );
  const isHome = useAppSelector((state) => state.userReducer.home);
  const activeChannelName = textChannelList.find(
    (c) => c.id === activeChannel
  )?.name;

  const onEmojiClick = (event: React.MouseEvent, emojiObject: any) => {
    setInput(input + emojiObject.emoji);
    inputRef.current?.focus();
    setIsSmiley(false);
  };
  const handleOutsideClick = useCallback(
    (e: any) => {
      if (node.current && !node.current.contains(e.target)) {
        setIsSmiley(false);
      }
    },
    [node]
  );

  const onSubmitChatChannelHandler = () => {
    if (activeChannel) {
      socket.emit('message', {
        content: input,
        channel: activeChannel,
      });
      setInput('');
    }
  };

  const onSubmitPrivateChatHandler = () => {
    if (activePrivateChat) {
      socket.emit('privatemessage', {
        content: input,
        to: activePrivateChat,
      });
      setInput('');
    }
  };

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

  return (
    <div className='chatbar'>
      <Form
        style={{ width: '100%' }}
        onSubmitCapture={
          isHome ? onSubmitPrivateChatHandler : onSubmitChatChannelHandler
        }
      >
        <Input
          bordered={false}
          className='inputMain'
          placeholder={`Envoyer un message ${
            isHome
              ? `à ${privateChatMap.get(activePrivateChat ?? 0)?.username}`
              : `dans ${activeChannelName}`
          }`}
          id='inputReturn'
          onChange={(e) => setInput(e.target.value)}
          value={input}
          ref={inputRef}
        />
        <SmileOutlined
          ref={node}
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

        {isSmiley && (
          <div
            style={{ position: 'relative', bottom: '394px', right: '-1045px' }}
          >
            <Picker
              disableSearchBar
              disableAutoFocus
              onEmojiClick={onEmojiClick}
              preload={false}
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
