import React, {useEffect} from "react";
import 'antd/dist/antd.css';
import { Input } from "antd";

const ChatBar = () => {

    return (
        <div className='chatbar'>
            <Input bordered={false} className="inputMain" placeholder="Envoyer un message dans "  />
        </div>
    )
}

export default ChatBar;