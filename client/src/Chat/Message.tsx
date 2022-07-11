import React, {useEffect} from "react";
import 'antd/dist/antd.css';
import fake from "../mockMessage";
import { MessageItem } from "./MessageItem";
const Message = () => {

    return (
        <div className='message'>
            {fake.map((fake: any, i: any) => <MessageItem obj={fake} key={i} />)}
        </div>
    )
}

export default Message;