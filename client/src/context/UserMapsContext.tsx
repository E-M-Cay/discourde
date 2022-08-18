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
  ReceivedFriendRequestMap,
  SentFriendRequestMap,
  ReceivedFriendRequest,
  SentFriendRequest,
} from '../types/types';
import { PeerSocketContext } from './PeerSocket';

interface userMapsContext {
  serverUserMap: ServerUserMap;
  friendMap: FriendshipMap;
  privateChatMap: PrivateChatMap;
  receivedFriendRequestMap: ReceivedFriendRequestMap;
  sentFriendRequestMap: SentFriendRequestMap;
  setFriend: (key: number, value: Friendship) => void;
  removeFriend: (key: number) => void;
  openPrivateChat: (user: User) => void;
  sendFriendRequest: (user: User) => void;
  acceptFriendRequest: (id: number, senderId: number) => void;
  refuseFriendRequest: (id: number, senderId: number) => void;
  deleteFriendRequest: (id: number, receiverId: number) => void;
}

const UserMapsContext = createContext<userMapsContext>({
  friendMap: new Map<number, Friendship>(),
  serverUserMap: new Map<number, ServerUser>(),
  privateChatMap: new Map<number, User>(),
  receivedFriendRequestMap: new Map<number, ReceivedFriendRequest>(),
  sentFriendRequestMap: new Map<number, SentFriendRequest>(),
  setFriend: (_any?: any) => {
    throw new Error('setFriend not correctly overriden');
  },
  removeFriend: (_any?: any) => {
    throw new Error('removeFriend not correctly overriden');
  },
  openPrivateChat: (_any?: any) => {
    throw new Error('removeFriend not correctly overriden');
  },
  sendFriendRequest: (_any?: any) => {
    throw new Error('acceptFriendRequest not correctly overriden');
  },
  acceptFriendRequest: (_any?: any) => {
    throw new Error('acceptFriendRequest not correctly overriden');
  },
  refuseFriendRequest: (_any?: any) => {
    throw new Error('refuseFriendRequest not correctly overriden');
  },
  deleteFriendRequest: (_any?: any) => {
    throw new Error('deleteFriendRequest not correctly overriden');
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
    setAll: _setAllFriends,
    remove: removeFriend,
    reset: _resetFriends,
  } = friendsActions;

  const [serverUserMap, serverUserActions] = useMap<number, ServerUser>([]);

  const {
    set: setServerUser,
    setAll: _setAllServerUsers,
    remove: removeServerUser,
    reset: resetServerUsers,
  } = serverUserActions;

  const [privateChatMap, privateChatActions] = useMap<number, User>([]);
  const {
    set: setPrivateChat,
    setAll: _setAllPrivateChats,
    remove: _removePrivateChat,
    reset: _resetPrivateChats,
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

  const [receivedFriendRequestMap, receivedFriendRequestActions] = useMap<
    number,
    ReceivedFriendRequest
  >([]);
  const {
    set: setReceivedFriendRequest,
    setAll: _setAllReceivedFriendRequests,
    remove: removeReceivedFriendRequest,
    reset: resetReceivedFriendRequests,
  } = receivedFriendRequestActions;

  const [sentFriendRequestMap, sentFriendRequestActions] = useMap<
    number,
    SentFriendRequest
  >();
  const {
    set: setSentFriendRequest,
    setAll: _setAllSentFriendRequests,
    remove: removeSentFriendRequest,
    reset: resetSentFriendRequests,
  } = sentFriendRequestActions;

  const sendFriendRequest = (user: User) => {
    axios
      .post(
        `/friends/send_request`,
        {
          user: user.id,
        },
        {
          headers: {
            access_token: localStorage.getItem('token') as string,
          },
        }
      )
      .then((res) => {
        if (res.status === 201) {
          const requestId = res.data.newRequest;
          setSentFriendRequest(user.id, {
            receiver: user,
            id: requestId,
          });
        }
      });
  };

  const acceptFriendRequest = (id: number, senderId: number) => {
    // console.log('accept req', id);
    axios
      .post(
        '/friends/create',
        {
          request: id,
        },
        {
          headers: {
            access_token: localStorage.getItem('token') as string,
          },
        }
      )
      .then((res) => {
        if (res.status === 201) {
          const receivedRequest = receivedFriendRequestMap.get(senderId);
          if (!receivedRequest) return;
          removeReceivedFriendRequest(senderId);
          setFriend(senderId, {
            id: senderId,
            friend: receivedRequest.sender,
          });
        }
      });
  };

  const refuseFriendRequest = (id: number, senderId: number) => {
    axios
      .delete(`friends/request/received/${id}`, {
        headers: {
          access_token: localStorage.getItem('token') as string,
        },
      })
      .then((res) => {
        if (res.status === 204) {
          console.log(receivedFriendRequestMap.get(senderId), 'delete ?');
          removeReceivedFriendRequest(senderId);
        }
      });
  };

  const deleteFriendRequest = (id: number, receiverId: number) => {
    axios
      .delete(`friends/request/sent/${id}`, {
        headers: {
          access_token: localStorage.getItem('token') as string,
        },
      })
      .then((res) => {
        if (res.status === 204) {
          removeSentFriendRequest(receiverId);
        }
      });
  };

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
          console.log(res.data, 'user server');
          res.data.forEach((user: ServerUser) =>
            setServerUser(user.user.id, user)
          );
        });

    return () => {
      resetServerUsers();
    };
  }, [activeServer, setServerUser, resetServerUsers]);

  useEffect(() => {
    if (!me) return;
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
      .then((res) => {
        res.data.forEach(
          (friendshipResponse: { id: number; user1: User; user2: User }) => {
            const correctUser =
              friendshipResponse.user1.id === me?.id
                ? friendshipResponse.user2
                : friendshipResponse.user1;

            setFriend(correctUser.id, {
              id: friendshipResponse.id,
              friend: correctUser,
            });
          }
        );
      });
  }, [me, setFriend, setPrivateChat]);

  useEffect(() => {
    axios
      .get('/friends/requests/received', {
        headers: {
          access_token: localStorage.getItem('token') as string,
        },
      })
      .then((res) => {
        console.log('Friendship', res.data);
        res.data.forEach((fr: ReceivedFriendRequest) => {
          setReceivedFriendRequest(fr.sender.id, fr);
        });
      });
    return () => {
      resetReceivedFriendRequests();
    };
  }, [setReceivedFriendRequest, resetReceivedFriendRequests]);

  useEffect(() => {
    axios
      .get('/friends/requests/sent', {
        headers: {
          access_token: localStorage.getItem('token') as string,
        },
      })
      .then((res) => {
        console.log('Friendship', res.data);
        res.data.forEach((fr: SentFriendRequest) => {
          setSentFriendRequest(fr.receiver.id, fr);
        });
      });
    return () => {
      resetSentFriendRequests();
    };
  }, [setSentFriendRequest, resetSentFriendRequests]);

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

  const handleNewFriendRequest = useCallback(
    (friendRequest: ReceivedFriendRequest) => {
      setReceivedFriendRequest(friendRequest.sender.id, friendRequest);
    },
    [setReceivedFriendRequest]
  );

  const handleNewFriendship = useCallback(
    (friendship: Friendship) => {
      removeSentFriendRequest(friendship.friend.id);
      setFriend(friendship.friend.id, friendship);
    },
    [removeSentFriendRequest, setFriend]
  );

  const handleFriendshipRefused = useCallback(
    (id: number) => {
      removeSentFriendRequest(id);
    },
    [removeSentFriendRequest]
  );

  const handleFriendRequestCanceled = useCallback(
    (id: number) => {
      removeReceivedFriendRequest(id);
    },
    [removeReceivedFriendRequest]
  );

  const handleUserLeftServer = useCallback(
    (id: number) => {
      console.log(id);
      console.table(serverUserMap);
      console.log(serverUserMap.has(id));
      removeServerUser(id);
    },
    [removeServerUser, serverUserMap]
  );

  useEffect(() => {
    console.table(serverUserMap);
  }, [serverUserMap]);

  useEffect(() => {
    socket?.on('friendrequestrefused', handleFriendshipRefused);
    socket?.on('friendrequestaccepted', handleNewFriendship);
    socket?.on('friendrequestcanceled', handleFriendRequestCanceled);
    socket?.on('newfriendrequest', handleNewFriendRequest);
    socket?.on('userdisconnected', handleDisconnection);
    socket?.on('userconnected', handleConnection);
    socket?.on('userleftserver', handleUserLeftServer);
    return () => {
      socket?.off('friendrequestrefused', handleFriendshipRefused);
      socket?.off('friendRequestAccepted', handleNewFriendship);
      socket?.off('userdisconnected', handleDisconnection);
      socket?.off('userconnected', handleConnection);
      socket?.off('newfriendrequest', handleNewFriendRequest);
      socket?.off('userleftserver', handleUserLeftServer);
    };
  }, [
    socket,
    handleDisconnection,
    handleConnection,
    handleNewFriendRequest,
    handleNewFriendship,
    handleFriendRequestCanceled,
    handleFriendshipRefused,
    handleUserLeftServer,
  ]);

  return (
    <UserMapsContext.Provider
      value={{
        receivedFriendRequestMap,
        sentFriendRequestMap,
        friendMap,
        serverUserMap,
        privateChatMap,
        openPrivateChat,
        setFriend,
        removeFriend,
        sendFriendRequest,
        acceptFriendRequest,
        refuseFriendRequest,
        deleteFriendRequest,
      }}
    >
      {children}
    </UserMapsContext.Provider>
  );
};

export default UserMapsContextProvider;

export { UserMapsContext };
