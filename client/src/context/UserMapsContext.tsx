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
  deleteFriendship: (friendship: Friendship) => void;
  setPrivateChat: (id: number, user: User) => void;
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
  setPrivateChat: (_any?: any) => {
    throw new Error('deleteFriendRequest not correctly overriden');
  },
  deleteFriendship: (_any?: any) => {
    throw new Error('deleteFriendship not correctly overriden');
  },
});

interface Props {
  children: React.ReactNode;
}

const UserMapsContextProvider = ({ children }: Props) => {
  const dispatch = useAppDispatch();
  const { me, token } = useAppSelector((state) => state.userReducer);
  const activeServer = useAppSelector(
    (state) => state.userReducer.activeServer
  );
  const { socket } = useContext(PeerSocketContext);

  const [friendMap, friendsActions] = useMap<number, Friendship>([]);
  const {
    set: setFriend,
    setAll: _setAllFriends,
    remove: removeFriend,
    reset: resetFriends,
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
    reset: resetPrivateChats,
  } = privateChatActions;

  const openPrivateChat = useCallback(
    (user: User) => {
      //console.log(privateChatMap);

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

  const deleteFriendship = (friendship: Friendship) => {
    console.log(friendship);
    axios
      .delete(`/friends/delete/${friendship.id}/${friendship.friend.id}`, {
        headers: {
          access_token: token ?? '',
        },
      })
      .then((res) => {
        if (res.status === 204) {
          removeFriend(friendship.friend.id);
        }
      });
  };

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
    // //console.log('accept req', id);
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
          //console.log(receivedFriendRequestMap.get(senderId), 'delete ?');
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
    // //console.log(serverUserMap, 'userMapcaralho');
    if (activeServer)
      axios
        .get(`/server/list_user/${activeServer}`, {
          headers: {
            access_token: localStorage.getItem('token') as string,
          },
        })
        .then((res) => {
          //console.log(res.data, 'user server');
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
        //console.log(res.data);
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
    return () => {
      resetFriends();
      resetPrivateChats();
    };
  }, [me, setFriend, setPrivateChat, resetFriends, resetPrivateChats]);

  useEffect(() => {
    axios
      .get('/friends/requests/received', {
        headers: {
          access_token: localStorage.getItem('token') as string,
        },
      })
      .then((res) => {
        // //console.log('Friendship', res.data);
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
        // //console.log('Friendship', res.data);
        res.data.forEach((fr: SentFriendRequest) => {
          setSentFriendRequest(fr.receiver.id, fr);
        });
      });
    return () => {
      resetSentFriendRequests();
    };
  }, [setSentFriendRequest, resetSentFriendRequests]);

  const handleStatusChange = useCallback(
    (status: number, id: number) => {
      //console.log('connection', id);
      const user = serverUserMap.get(id);
      if (user) {
        setServerUser(id, { ...user, user: { ...user.user, status } });
      }

      const friendship = friendMap.get(id);
      if (friendship) {
        setFriend(id, {
          ...friendship,
          friend: { ...friendship.friend, status },
        });
      }

      const privateChat = privateChatMap.get(id);
      if (privateChat) {
        setPrivateChat(id, {
          ...privateChat,
          status,
        });
      }
    },
    [
      setServerUser,
      serverUserMap,
      setFriend,
      friendMap,
      setPrivateChat,
      privateChatMap,
    ]
  );

  const handleDisconnection = useCallback(
    (id: number) => {
      handleStatusChange(0, id);
    },
    [handleStatusChange]
  );

  const handleConnection = useCallback(
    (id: number) => {
      handleStatusChange(1, id);
    },
    [handleStatusChange]
  );

  const handleAway = useCallback(
    (id: number) => {
      handleStatusChange(2, id);
    },
    [handleStatusChange]
  );

  const handleDnd = useCallback(
    (id: number) => {
      handleStatusChange(3, id);
    },
    [handleStatusChange]
  );

  const handleNewFriendRequest = useCallback(
    (friendRequest: ReceivedFriendRequest) => {
      let audio = new Audio('/direct-545.mp3');
      audio.play();
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
      removeServerUser(id);
    },
    [removeServerUser]
  );

  const handeUserJoinedServer = useCallback(
    (serverUser: ServerUser) => {
      setServerUser(serverUser.user.id, serverUser);
    },
    [setServerUser]
  );

  const handleFriendshipRemoved = useCallback(
    (id: number) => {
      removeFriend(id);
    },
    [removeFriend]
  );

  const handleUserProfileChange = useCallback(
    (user: User) => {
      //console.log(user, 'user change', serverUserMap);
      const serverUser = serverUserMap.get(user.id);
      if (serverUser) {
        setServerUser(user.id, { ...serverUser, user });
      }

      const friendship = friendMap.get(user.id);
      if (friendship) {
        setFriend(user.id, { ...friendship, friend: user });
      }

      const privateChat = privateChatMap.get(user.id);
      if (privateChat) {
        setPrivateChat(user.id, user);
      }

      const receivedRequest = receivedFriendRequestMap.get(user.id);
      if (receivedRequest) {
        setReceivedFriendRequest(user.id, { ...receivedRequest, sender: user });
      }

      const sentRequest = sentFriendRequestMap.get(user.id);
      if (sentRequest) {
        setSentFriendRequest(user.id, { ...sentRequest, receiver: user });
      }
    },
    [
      serverUserMap,
      friendMap,
      privateChatMap,
      receivedFriendRequestMap,
      sentFriendRequestMap,
      setServerUser,
      setFriend,
      setPrivateChat,
      setReceivedFriendRequest,
      setSentFriendRequest,
    ]
  );

  useEffect(() => {
    socket.on('userchanged', handleUserProfileChange);
    socket.on('friendrequestrefused', handleFriendshipRefused);
    socket.on('friendrequestaccepted', handleNewFriendship);
    socket.on('friendrequestcanceled', handleFriendRequestCanceled);
    socket.on('friendshipremoved', handleFriendshipRemoved);
    socket.on('newfriendrequest', handleNewFriendRequest);
    socket.on('userdisconnected', handleDisconnection);
    socket.on('userconnected', handleConnection);
    socket.on('userleftserver', handleUserLeftServer);
    socket.on('userjoinedserver', handeUserJoinedServer);
    socket.on('userdnd', handleDnd);
    socket.on('useraway', handleAway);
    return () => {
      socket.off('userchanged', handleUserProfileChange);
      socket.off('friendrequestrefused', handleFriendshipRefused);
      socket.off('friendRequestAccepted', handleNewFriendship);
      socket.off('friendrequestcanceled', handleFriendRequestCanceled);
      socket.off('friendshipremoved', handleFriendshipRemoved);
      socket.off('newfriendrequest', handleNewFriendRequest);
      socket.off('userdisconnected', handleDisconnection);
      socket.off('userconnected', handleConnection);
      socket.off('userleftserver', handleUserLeftServer);
      socket.off('userjoinedserver', handeUserJoinedServer);
      socket.off('userdnd', handleDnd);
      socket.off('useraway', handleAway);
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
    handeUserJoinedServer,
    handleUserProfileChange,
    handleFriendshipRemoved,
    handleAway,
    handleDnd,
  ]);

  return (
    <UserMapsContext.Provider
      value={{
        receivedFriendRequestMap,
        sentFriendRequestMap,
        friendMap,
        serverUserMap,
        privateChatMap,
        setPrivateChat,
        openPrivateChat,
        setFriend,
        removeFriend,
        sendFriendRequest,
        acceptFriendRequest,
        refuseFriendRequest,
        deleteFriendRequest,
        deleteFriendship,
      }}
    >
      {children}
    </UserMapsContext.Provider>
  );
};

export default UserMapsContextProvider;

export { UserMapsContext };
