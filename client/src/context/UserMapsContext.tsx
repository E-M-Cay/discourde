import axios from 'axios';
import { createContext, useCallback, useContext, useEffect } from 'react';
import { useMap } from 'usehooks-ts';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setActivePrivateChat, setIsHome } from '../redux/userSlice';
import {
    Friendship,
    ServerUser,
    FriendshipMap,
    ServerUserMap,
    User,
    PrivateChatMap,
} from '../types/types';
import { PeerSocketContext } from './PeerSocket';

interface userMapsContext {
    serverUserMap: ServerUserMap;
    friendMap: FriendshipMap;
    privateChatMap: PrivateChatMap;
    setFriend: (key: number, value: Friendship) => void;
    removeFriend: (key: number) => void;
    openPrivateChat: (user: User) => void;
}

const UserMapsContext = createContext<userMapsContext>({
    friendMap: new Map<number, Friendship>(),
    serverUserMap: new Map<number, ServerUser>(),
    privateChatMap: new Map<number, User>(),
    setFriend: (_any?: any) => {
        throw new Error('setFriend not correctly overriden');
    },
    removeFriend: (_any?: any) => {
        throw new Error('removeFriend not correctly overriden');
    },
    openPrivateChat: (_any?: any) => {
        throw new Error('removeFriend not correctly overriden');
    },
});

interface Props {
    children: React.ReactNode;
}

const UserMapsContextProvider: React.FunctionComponent<Props> = ({
    children,
}) => {
    const dispatch = useAppDispatch();
    const me = useAppSelector((state) => state.userReducer.me);
    const activeServer = useAppSelector(
        (state) => state.userReducer.activeServer
    );
    const { socket } = useContext(PeerSocketContext);

    const [friendMap, friendsActions] = useMap<number, Friendship>([]);
    const {
        set: setFriend,
        setAll: setAllFriends,
        remove: removeFriend,
        reset: resetFriends,
    } = friendsActions;

    const [serverUserMap, serverUserActions] = useMap<number, ServerUser>([]);

    const {
        set: setServerUser,
        setAll: setAllServerUsers,
        remove: removeserverUser,
        reset: resetServerUsers,
    } = serverUserActions;

    const [privateChatMap, privateChatActions] = useMap<number, User>([]);
    const {
        set: setPrivateChat,
        setAll: setAllPrivateChats,
        remove: removePrivateChat,
        reset: resetPrivateChats,
    } = privateChatActions;

    const openPrivateChat = useCallback(
        (user: User) => {
            console.log(privateChatMap);

            if (user.id === me?.id) return;
            if (!privateChatMap.has(user.id)) {
                setPrivateChat(user.id, user);
            }

            dispatch(setActivePrivateChat(user.id));
            dispatch(setIsHome(true));
        },
        [setPrivateChat, me, dispatch, privateChatMap]
    );

    useEffect(() => {
        // console.log(serverUserMap, 'userMapcaralho');
        if (activeServer)
            axios
                .get(`/server/list_user/${activeServer}`, {
                    headers: {
                        access_token: localStorage.getItem('token') as string,
                    },
                })
                .then((res) => {
                    res.data.forEach((user: ServerUser) =>
                        setServerUser(user.user.id, user)
                    );
                });

        return () => {
            resetServerUsers();
        };
    }, [activeServer, setServerUser, resetServerUsers]);

    useEffect(() => {
        axios
            .get('/privatemessage/userlist', {
                headers: {
                    access_token: localStorage.getItem('token') as string,
                },
            })
            .then((res) => {
                console.log(res.data);
                res.data.forEach((u: User) => setPrivateChat(u.id, u));
            });

        axios
            .get('/friends/list', {
                headers: {
                    access_token: localStorage.getItem('token') as string,
                },
            })
            .then((res) =>
                res.data.forEach(
                    (friendshipResponse: {
                        id: number;
                        user1: User;
                        user2: User;
                    }) => {
                        const correctUser =
                            friendshipResponse.user1.id === me?.id
                                ? friendshipResponse.user2
                                : friendshipResponse.user1;

                        setFriend(correctUser.id, {
                            id: friendshipResponse.id,
                            friend: correctUser,
                        });
                    }
                )
            );
    }, []);

    const handleDisconnection = useCallback(
        (id: number) => {
            const user = serverUserMap.get(id) ?? null;
            if (!user) return;
            setServerUser(id, { ...user, user: { ...user.user, status: 0 } });
        },
        [setServerUser, serverUserMap]
    );

    const handleConnection = useCallback(
        (id: number) => {
            const user = serverUserMap.get(id) ?? null;
            if (!user) return;
            setServerUser(id, { ...user, user: { ...user.user, status: 1 } });
        },
        [setServerUser, serverUserMap]
    );

    useEffect(() => {
        socket?.on('userdisconnected', handleDisconnection);
        socket?.on('userconnected', handleConnection);
        return () => {
            socket?.off('userdisconnected', handleDisconnection);
            socket?.off('userconnected', handleConnection);
        };
    }, [socket, handleDisconnection, handleConnection]);

    return (
        <UserMapsContext.Provider
            value={{
                friendMap,
                serverUserMap,
                privateChatMap,
                openPrivateChat,
                setFriend,
                removeFriend,
            }}>
            {children}
        </UserMapsContext.Provider>
    );
};

export default UserMapsContextProvider;

export { UserMapsContext };
