import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import 'antd/dist/antd.min.css';
import { Input, Form, notification } from 'antd';
import { PeerSocketContext } from '../context/PeerSocket';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import Picker from 'emoji-picker-react';
import { SmileOutlined } from '@ant-design/icons';
import { InputRef } from 'antd';
import { UserMapsContext } from '../context/UserMapsContext';
import { Channel } from '../types/types';
import { setAiMsg } from '../redux/userSlice';
import axios from 'axios';

const ChatBar = (props: { textChannelList: Channel[] }) => {
  const dispatch = useAppDispatch();
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
  const aiMsg = useAppSelector((state) => state.userReducer.aiMsg);
  const activePrivateChat = useAppSelector(
    (state) => state.userReducer.activePrivateChat
  );
  const { Configuration, OpenAIApi } = require('openai');

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
  const show_notification_list_user = () => {
    let listOfAllUsers: Array<any> = [];
    axios
    .get('/role/list_all', {
     headers: {
       access_token: localStorage.getItem('token') as string,
     },
   })
   .then((res) => {
    console.log("getRolesbyServer");
    listOfAllUsers= res.data;
    console.log(listOfAllUsers);

    notification.open({
      message: 'Liste des utilisateur de Discourde :',
      description: listOfAllUsers.map((user) => <li>{user}</li>),
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
   });
  };

  const show_notification_list_server = () => {
    let listOfAllServer: Array<any> = [];
    axios
    .get('/server/list_all', {
     headers: {
       access_token: localStorage.getItem('token') as string,
     },
   })
   .then((res) => {
    console.log("getRolesbyServer");
    listOfAllServer= res.data;
    console.log(listOfAllServer);

    notification.open({
      message: 'Liste des serveurs de Discourde :',
      description: listOfAllServer.map((server, index) => <li key={index}>{server.name}</li>),
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
   });
  }

  const show_notification_list_server_user_per_server_name = (arg: string) => {
    console.log('Start')
    let list_server_user: Array<any> = [];

    console.log('before request')
    axios
    .get(`/server/list/user/${arg}`, {
     headers: {
       access_token: localStorage.getItem('token') as string,
     },
   })
   .then((res) => {
    console.log("getRolesbyServer");
    list_server_user = res.data;
    console.log(list_server_user);

    notification.open({
      message: 'Liste des serveurs de Discourde :',
      description: list_server_user.map((server_user, index) => <li key={index}>{server_user.nickname}</li>),
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
   });
  }

  const show_notification_list_role_per_server_name = (arg: string) =>{
    let list_role: Array<any> = [];

    console.log('before request')
    axios
    .get(`/role/list/${arg}`, {
     headers: {
       access_token: localStorage.getItem('token') as string,
     },
   })
   .then((res) => {
    console.log("getRolesbyServer");
    list_role = res.data;
    console.log(list_role);

    notification.open({
      message: 'Liste des serveurs de Discourde :',
      description: list_role.map((role, index) => <li key={index}>{role.name}</li>),
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
   });
  }


  const onSubmitChatChannelHandler = () => {
    console.log(input)
    console.log(input.slice(0, 6))

    if (activeChannel && activeChannel !== -1) {
      socket.emit('message', {
        content: input,
        channel: activeChannel,
      });
      setInput('');
    } else if (activeChannel === -1) {
      if(input == "!users") {
        console.log("liste des users");
        show_notification_list_user();
      }
      else if(input == "!servers"){
        show_notification_list_server()
      
        
      }else if(input.slice(0, 7) == "!server"){
        console.log('test True')
        let buffer = input.split(' ')
        if(buffer.length == 2){
          const arg = buffer[1]
          if(arg != ""){
            console.log('.Server')
            show_notification_list_server_user_per_server_name(arg)
          }
        }

      }else if(input.slice(0, 5) == "!role"){
        console.log('test True')
        let buffer = input.split(' ')
        if(buffer.length == 2){
          const arg = buffer[1]
          if(arg != ""){
            show_notification_list_role_per_server_name(arg)
          }
        }
      }
      else {
      console.log(aiMsg);

      const configuration = new Configuration({
        apiKey: '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',
      });
      const openai = new OpenAIApi(configuration);

      openai
        .createCompletion({
          model: 'text-davinci-002',
          prompt: 'Répond à cette question : ' + aiMsg + '""Human: ' + input,
          temperature: 0.7,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        })
        .then((response: any) => {
          let tmp = aiMsg;
          dispatch(
            setAiMsg(
              tmp +
                '""Human: ' +
                input +
                '""AI: ' +
                response.data.choices[0].text
            )
          );
          console.log('REPONSE OBJET');
          console.log(response);
          console.log('REPONSE MSG');
          console.log(response.data.choices[0].text);
          console.log(aiMsg + 'aimsg');
        });
      setInput('');
    }
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
              : `dans ${
                  activeChannel !== -1
                    ? activeChannelName
                    : 'le chat de notre inteligence artificielle'
                }`
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
