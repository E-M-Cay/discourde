import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import './App.css';
import { PeerSocketContext } from './context/PeerSocket';
import axios from 'axios';
import { useAppDispatch } from './redux/hooks';
import { Input, Typography } from 'antd';
import { setUsername, setToken, setMe } from './redux/userSlice';
import VocalChannel from './components/VocalChannel';
import { Home } from './Home/Home';
import { Modal } from 'antd';
import UserMapsContextProvider from './context/UserMapsContext';
import NotificationsContextProvider from './context/NotificationsContext';

const { Title, Text } = Typography;

const App = () => {
    const { socket, peer, connectPeer, connectSocket } =
        useContext(PeerSocketContext);

    const dispatch = useAppDispatch();
    const registerUsernameRef = useRef<string>('');
    const registerEmailRef = useRef<string>('');
    const loginEmailRef = useRef<string>('');
    const registerPasswordRef = useRef<string>('');
    const loginPasswordRef = useRef<string>('');
    const isFirst = useRef(true);

    const [isModalVisible, setIsModalVisible] = useState(
        localStorage.getItem('token') ? false : true
    );

    // const showModal = () => {
    //   setIsModalVisible(true);
    // };

    //const verifyAndRefreshToken = (tk: string) => {};

    const onConnection = useCallback(() => {
        console.log('socket con');
        socket?.emit('connected', socket.id);
        connectPeer();
    }, [socket, connectPeer]);

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const updateUsername = useCallback(
        (newUsername: string) => {
            dispatch(setUsername(newUsername));
        },
        [dispatch]
    );

    const openPeer = useCallback(
        (peer_id: string) => {
            console.log('peerid:', peer_id);

            socket?.emit('peerId', { peer_id });
        },
        [socket]
    );

    useEffect(() => {
        peer?.on('open', openPeer);
        return () => {
            peer?.off('open', openPeer);
        };
    }, [peer, openPeer]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && isFirst.current) {
            axios
                .get('/user/token_check', {
                    headers: {
                        access_token: token,
                    },
                })
                .then((res) => {
                    if (res.data.ok) {
                        connectSocket(token);
                        dispatch(setMe(res.data.user));
                    } else {
                        setIsModalVisible(true);
                    }
                });
            // verifyAndRefreshToken(token);

            isFirst.current = false;
        }
    }, [socket, connectSocket]);

    useEffect(() => {
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
                    console.log('res data user', res.data.user);
                    dispatch(setMe(res.data.user));
                    dispatch(setToken(res.data.token));
                    handleOk();
                }
            });
    };

    return (
        <UserMapsContextProvider>
            <NotificationsContextProvider>
            {peer && socket ? (
                <div>
                    <VocalChannel />
                    <Home setTokenMissing={setIsModalVisible} />
                </div>
            ) : (
                <Modal
                    visible={isModalVisible}
                    closable={false}
                    footer={null}
                    // style={{backgroundColor: '#535353'}}
                >
                    <div className='App'>
                        <>
                            <form onSubmit={(e) => onSubmitRegister(e)}>
                                <Title level={3}>Register</Title>
                                <div
                                    style={{
                                        maxWidth: '80%',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        margin: 'auto',
                                    }}>
                                    <Text>email</Text>

                                    <Input
                                        style={{ maxWidth: '50%' }}
                                        placeholder='email'
                                        id='registerEmail'
                                        onChange={(e) =>
                                            onChangeHandler(e, registerEmailRef)
                                        }
                                    />
                                </div>
                                <div
                                    style={{
                                        paddingTop: '10px',
                                        maxWidth: '80%',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        margin: 'auto',
                                    }}>
                                    <Text>password</Text>
                                    <Input.Password
                                        style={{ maxWidth: '50%' }}
                                        placeholder='password'
                                        id='registerPassword'
                                        onChange={(e) =>
                                            onChangeHandler(
                                                e,
                                                registerPasswordRef
                                            )
                                        }
                                    />{' '}
                                </div>
                                <div
                                    style={{
                                        paddingTop: '10px',
                                        maxWidth: '80%',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        margin: 'auto',
                                    }}>
                                    <Text>username</Text>

                                    <Input
                                        placeholder='username'
                                        style={{
                                            paddingTop: '10px',
                                            maxWidth: '50%',
                                        }}
                                        id='registerUsername'
                                        onChange={(e) =>
                                            onChangeHandler(
                                                e,
                                                registerUsernameRef
                                            )
                                        }
                                    />
                                </div>
                                <input type='submit' />
                            </form>
                            <form onSubmit={(e) => onSubmitLogin(e)}>
                                <Title level={3}>Login</Title>

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
                            </form>{' '}
                        </>
                    </div>
                </Modal>
            )}
            </NotificationsContextProvider>
        </UserMapsContextProvider>
    );
};

export default App;
