import { Image, Typography, Tooltip } from 'antd';
import logo from '../assets/discourde.png';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setActiveServer, setIsHome } from '../redux/userSlice';
import {
    PrivateChatMap,
    ServerResponse,
    ServerUser,
    User,
} from '../types/types';

export const CustomLimage = (props: { obj?: ServerResponse }) => {
    const { obj } = props;
    const [isFocused, setFocus] = useState(false);
    const dispatch = useAppDispatch();

    const onClickServer = () => {
        if (obj) {
            dispatch(setActiveServer(obj.server.id));
            dispatch(setIsHome(false));
        } else {
            dispatch(setIsHome(true));
            dispatch(setActiveServer(0));
        }
    };

    return (
        <Tooltip
            mouseLeaveDelay={0.3}
            placement='left'
            style={{ fontSize: '32px' }}
            title={obj?.server.name || 'Home'}>
            <img
                onMouseEnter={() => setFocus(true)}
                alt={obj?.server.name || 'Home'}
                onMouseLeave={() => setFocus(false)}
                onClick={onClickServer}
                className={'imgS'}
                style={{
                    margin: '5px auto',
                    width: 'auto',
                    maxWidth: '50px',
                    backgroundColor: isFocused ? '#4b4b4b' : '#353535',
                    borderRadius: '30px',
                    cursor: 'pointer',
                    height: '50px',
                }}
                src={
                    obj?.server.main_img
                        ? obj?.server.main_img[0] === 'h'
                            ? obj?.server.main_img
                            : logo
                        : logo
                }
            />
        </Tooltip>
    );
};

export const CustomImage = (props: {
    obj: ServerUser;
    privateChatMap: PrivateChatMap;
    addPrivateChat: (user: User) => void;
}) => {
    const { obj, addPrivateChat } = props;
    const [isFocused, setFocus] = useState(false);

    return (
        <img
            alt={obj.user.username}
            onMouseEnter={() => setFocus(true)}
            onMouseLeave={() => setFocus(false)}
            onClick={() => addPrivateChat(obj.user)}
            className={'imgS2'}
            style={{
                margin: '5px auto',
                width: 'auto',
                backgroundColor: '#4b4b4b',
                borderRadius: '30px',
                cursor: 'pointer',
            }}
            src={obj.user.picture ?? logo}
        />
    );
};

export const CustomImageMess = (props: {
    picture: string;
    nickname: string;
}) => {
    const [isFocused, setFocus] = useState(false);
    const { nickname, picture } = props;
    return (
        <img
            alt={nickname}
            onMouseEnter={() => setFocus(true)}
            onMouseLeave={() => setFocus(false)}
            style={{
                backgroundColor: '#535353',
                margin: '5px auto',
                width: 'auto',
                borderRadius: '22px',
                cursor: 'pointer',
                height: '45px',
                marginRight: '17px',
                marginLeft: '10px',
            }}
            src={picture ?? logo}
        />
    );
};
