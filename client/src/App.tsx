import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import './App.css';
import { PeerSocketContext } from './context/PeerSocket';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import {
    joinRoomSuccess,
    setUsername,
    setUserId,
    setToken,
} from './redux/userSlice';
import VocalChannel from './components/VocalChannel';
import { Home } from './Home/Home';
import { Modal } from 'antd';

interface UserInfo {
    username: string;
    id: string;
}

const App = () => {
    const { socket, peer, connectPeer, connectSocket } =
        useContext(PeerSocketContext);
    const [micStatus, setMicStatus] = useState<boolean>(false);
    const [message, setMessage] = useState<string>();
    const streamRef = useRef<MediaStream>();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.userReducer);
    const registerUsernameRef = useRef<string>('');
    const registerEmailRef = useRef<string>('');
    const loginEmailRef = useRef<string>('');
    const registerPasswordRef = useRef<string>('');
    const loginPasswordRef = useRef<string>('');

    const [isModalVisible, setIsModalVisible] = useState(
        localStorage.getItem('token') ? false : true
    );

    // const showModal = () => {
    //   setIsModalVisible(true);
    // };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onConnection = useCallback(() => {
        console.log('socket con');
        socket?.emit('connected', socket.id);
        connectPeer();
    }, [socket, connectPeer]);

    const fetchMessage = () => {
        if (!message) {
            console.log('axios');
            axios.get(`/toto`).then((res) => setMessage(res.data));
        }
    };

    const updateUsername = useCallback(
        (newUsername: string) => {
            dispatch(setUsername(newUsername));
        },
        [dispatch]
    );

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !socket) connectSocket(token);
        socket?.on('connect', onConnection);
        socket?.on('username', updateUsername);
        return () => {
            socket?.off('username', updateUsername);
            socket?.off('connect', onConnection);
        };
    }, [socket, onConnection, updateUsername, dispatch]);

    const onChangeHandler = (
        e: React.ChangeEvent<HTMLInputElement>,
        ref: React.MutableRefObject<string>
    ) => {
        ref.current = e.target.value;
    };

    const onSubmitRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post(`/user/register`, {
            email: registerEmailRef.current,
            password: registerPasswordRef.current,
            username: registerUsernameRef.current,
        });
    };

    const onSubmitLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios
            .post(`/user/login`, {
                email: loginEmailRef.current,
                password: loginPasswordRef.current,
            })
            .then((res) => {
                if (res.data.token) {
                    connectSocket(res.data.token);
                    localStorage.setItem('token', res.data.token);
                    dispatch(setUserId(res.data.user_id));
                    dispatch(setToken(res.data.token));
                    handleOk();
                }
            });
    };

    // return (
    //   <div className='App'>
    //     <button onClick={toggleMicrophone}>Open mic</button>
    //     <div>{message}</div>
    //     <div>Mic status: {micStatus ? 'open' : 'closed'}</div>
    //     <div>{displayUserList()}</div>
    //     <button onClick={fetchMessage}>Fetch message</button>
    //     <audio id='audio' />
    //     {user != '' && (
    //       <>
    //         <div>{user}</div>
    //         <form onSubmit={(e) => onSubmitHandler(e)}>
    //           <input
    //             type='text'
    //             id='usernameInput'
    //             onChange={(e) => onChangeHandler(e)}
    //             defaultValue={user}
    //           />
    //           <input type='submit' />
    //         </form>
    //       </>
    //     )}
    //   </div>
    // );
    return (
        <>
            <Modal
                title='Basic Modal'
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}>
                <div className='App'>
                    <div>{message}</div>
                    <div>Mic status: {micStatus ? 'open' : 'closed'}</div>
                    <button onClick={fetchMessage}>Fetch message</button>
                    <VocalChannel channelName='toto' />
                    <>
                        <form onSubmit={(e) => onSubmitRegister(e)}>
                            <div>Register</div>
                            <label>
                                email
                                <input
                                    type='text'
                                    id='registerEmail'
                                    onChange={(e) =>
                                        onChangeHandler(e, registerEmailRef)
                                    }
                                />
                            </label>
                            <label>
                                password
                                <input
                                    type='password'
                                    id='registerPassword'
                                    onChange={(e) =>
                                        onChangeHandler(e, registerPasswordRef)
                                    }
                                />
                            </label>
                            <label>
                                username
                                <input
                                    type='text'
                                    id='registerUsername'
                                    onChange={(e) =>
                                        onChangeHandler(e, registerUsernameRef)
                                    }
                                />
                            </label>
                            <input type='submit' />
                        </form>
                        <form onSubmit={(e) => onSubmitLogin(e)}>
                            <div>Login</div>
                            <label>
                                email
                                <input
                                    type='text'
                                    id='loginPassword'
                                    onChange={(e) =>
                                        onChangeHandler(e, loginEmailRef)
                                    }
                                />
                            </label>
                            <label>
                                password
                                <input
                                    type='password'
                                    id='loginPassword'
                                    onChange={(e) =>
                                        onChangeHandler(e, loginPasswordRef)
                                    }></input>
                            </label>
                            <input type='submit' />
                        </form>
                    </>
                </div>
            </Modal>
            <Home />
        </>
    );
};

export default App;
