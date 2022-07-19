import { useContext, useEffect, useState } from "react";
import { PeerSocketContext } from "../context/PeerSocket";

interface Message {
    author: string
    message: string
}


const ChatChannel = (name: string) => {
    const [chat, setChat] = useState<Message[]>([])
    const { peer, socket } = useContext(PeerSocketContext);

    const incomingMessage = (incomingMessage: Message)  => {
        setChat((prevChatState) => [...prevChatState, incomingMessage])
    }

    useEffect(() => {
        socket?.on(`chatmessage:${name}`, incomingMessage)
        return(() => {
            socket?.off(`chatmessage:${name}`, incomingMessage)
        })
    })

   return(<></>)
}

export default ChatChannel
