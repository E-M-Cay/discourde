import React, { useContext, useEffect, useRef, useState } from 'react';
import 'antd/dist/antd.css';
import { Input, Form } from 'antd';
import { PeerSocketContext } from '../context/PeerSocket';
import { useAppSelector } from '../redux/hooks';

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
                />
            </Form>
        </div>
    );
};

export default ChatBar;
