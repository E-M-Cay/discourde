import { Form, Input } from 'antd';
import { useContext, useState } from 'react';
import { PeerSocketContext } from '../context/PeerSocket';
import { UserMapsContext } from '../context/UserMapsContext';
import { useAppSelector } from '../redux/hooks';

const PrivateChatInput = () => {
  const [input, setInput] = useState<string>('');
  const { socket } = useContext(PeerSocketContext);
  const { privateChatMap } = useContext(UserMapsContext);
  const activePrivateChat = useAppSelector(
    (state) => state.userReducer.activePrivateChat
  );

  const onSubmitHandler = () => {
    socket?.emit('privatemessage', {
      content: input,
      to: activePrivateChat,
    });

    setInput('');
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
          placeholder={`Envoyer un message à ${
            privateChatMap.get(activePrivateChat as number)?.username ?? null
          }`}
          onChange={(e) => setInput(e.target.value)}
          value={input}
        />
      </Form>
    </div>
  );
};

export default PrivateChatInput;
