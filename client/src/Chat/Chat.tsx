import React, {useEffect} from "react";
import 'antd/dist/antd.css';
import Message from "./Message";
import ChatBar from "./ChatBar";

const Chat = () => {

    return (
        <div className='chat'>
            <div className="message" >
            <Message />
            </div>
            <div className="chatbar">
            <ChatBar  />
            </div>
        </div>
    )
}

export default Chat;