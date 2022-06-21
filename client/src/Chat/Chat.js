import React, {useEffect} from "react";
import 'antd/dist/antd.css';
import {Input, List} from 'antd';
import {message} from "antd/es";
import Avatar from "antd/es/avatar/avatar";

const Chat = ({ sendMessage, messageFromChannel, channel }) => {

    useEffect(() => {
        const element = document.getElementById('scrFix');
        const ele2 = document.getElementsByClassName('ant-empty-description');
        ele2[0].outerText = "";
        element.scrollTop = element.scrollHeight;
    }, [])

    return (
        <div className='chat'>
            <div className="messageZone">
                <List
                    className="messageList"
                    itemLayout="horizontal"
                    dataSource={messageFromChannel}
                    id="scrFix"
                    renderItem={item => (
                        <List.Item style={{borderBottom: "none", borderTop: "solid 1px #737373", color: "grey", paddingTop: "20px", paddingBottom: "20px", width: "98%"}} >
                            <List.Item.Meta
                                style={{marginBottom: "5px"}}
                                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                                title={item.user}
                                description={item.createdAt}
                            />
                            {item.message}
                        </List.Item>
                    )}
                />,
            </div>
            <div className="inputChat">
                <Input placeholder="Aa" on="true" onKeyUp={sendMessage}>
                </Input>
            </div>
        </div>
    )
}

export default Chat;