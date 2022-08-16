import { Typography } from 'antd';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { UserMapsContext } from '../context/UserMapsContext';
import { CustomImageChat } from '../CustomLi/CustomLi';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { setActivePrivateChat } from '../redux/userSlice';
import { PrivateChatMap } from '../types/types';

const PrivateChatBar = () => {
    const dispatch = useAppDispatch();
    const { privateChatMap } = useContext(UserMapsContext);

    const onClickHandler = (id: number) => {
        dispatch(setActivePrivateChat(id));
    };

    return (
        <div>
            {Array.from(privateChatMap.entries()).map(([id, user]) => (
                <div
                    key={id}
                    className='hoStat'
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        maxWidth: '300px',
                    }}>
                    <CustomImageChat
                        key={id}
                        id={id}
                        picture={user.picture}
                        nickname={user.username}
                        onClickHandler={onClickHandler}
                    />{' '}
                    <Typography
                        style={{
                            width: '100%',
                            height: '100%',
                            paddingLeft: '30px',
                            fontWeight: 'bold',
                            color: '#A1A1A1',
                        }}>
                        {user.username}
                    </Typography>{' '}
                </div>
            ))}
        </div>
    );
};

export default PrivateChatBar;
