import React, {useContext, useEffect, useState} from "react";
import 'antd/dist/antd.css';
import { Input } from "antd";
import { useAppSelector } from "../redux/hooks";
import { PeerSocketContext } from "../context/PeerSocket";


const ChatBar = () => {

    // const user = useAppSelector((state) => state.userReducer);

    const { peer, socket } = useContext(PeerSocketContext);


    const [message, setMessage] = useState<string>();


    function handleKeyDown(e: any) {
        if (e.key === 'Enter') {
            console.log(message);
            setMessage('')
          socket?.emit('message', {message: message, username: 'toto', channel: 'toto'});
          
        }
    }

    return (
        <div className='chatbar'>
            <Input bordered={false} value={message} onChange={(event)  => setMessage(event.target.value)} onKeyDown={handleKeyDown} className="inputMain" placeholder="Envoyer un message dans "  />
        </div>
    )
}

export default ChatBar;