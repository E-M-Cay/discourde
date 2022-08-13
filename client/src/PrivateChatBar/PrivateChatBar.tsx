import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import { setActivePrivateChat } from '../redux/userSlice';
import { PrivateChatMap, TextMessage, User } from '../types/types';

const PrivateChatBar = (props: { privateChatMap: PrivateChatMap }) => {
    const { privateChatMap } = props;

    // useEffect(() => {
    //     console.log(privateChatMap, 'from bar');
    //     console.table(Array.from(privateChatMap.entries()));
    // }, [privateChatMap]);

    return (
        <div>
            {Array.from(privateChatMap.entries()).map(([id, user]) => (
                <div key={Number(id)} onClick={() => {}}>
                    {user.username}
                </div>
            ))}
        </div>
    );
};

export default PrivateChatBar;
