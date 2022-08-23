import { SoundOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu } from 'antd';
import { MediaConnection } from 'peerjs';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useMap } from 'usehooks-ts';
import { PeerSocketContext } from '../context/PeerSocket';
import { UserMapsContext } from '../context/UserMapsContext';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { User, VocalChan } from '../types/types';
import logo from '../assets/discourde.png';
import {
  setMute,
  setMuteAudio,
  setUnmute,
  setUnmuteAudio,
} from '../redux/userSlice';

interface VocalChannel {
  stream?: MediaStream;
  displayActiveVocalChannel: (chan: VocalChan) => JSX.Element;
  muteSelf: () => void;
  unmuteSelf: () => void;
  muteAudio: () => void;
  unmuteAudio: () => void;
}

const VocalChannelContext = createContext<VocalChannel>({
  muteSelf: (_any?: any) => {
    throw new Error('muteSelf not correctly overridden');
  },
  unmuteSelf: (_any?: any) => {
    throw new Error('unmuteSelf not correctly overridden');
  },
  muteAudio: (_any?: any) => {
    throw new Error('muteAudio not correctly overridden');
  },
  unmuteAudio: (_any?: any) => {
    throw new Error('unmuteAudio not correctly overridden');
  },
  displayActiveVocalChannel: (_any?: any) => {
    throw new Error('displayActiveVocalChannel not correctly overridden');
  },
});

interface Props {
  children: React.ReactNode;
}

const VocalChannelContextProvider: React.FunctionComponent<Props> = ({
  children,
}) => {
  const { peer, socket } = useContext(PeerSocketContext);
  const activeVocalChannel = useAppSelector(
    (state) => state.userReducer.activeVocalChannel
  );
  const me = useAppSelector((state) => state.userReducer.me);
  const streamRef = useRef<MediaStream>();
  const [calls, setCalls] = useState<MediaConnection[]>([]);
  const [audioNodeMap, audioNodeActions] = useMap<number, HTMLAudioElement>([]);
  const { serverUserMap } = useContext(UserMapsContext);
  const isMute = useAppSelector((state) => state.userReducer.isMute);
  const isMuteAudio = useAppSelector((state) => state.userReducer.isMuteAudio);
  const dispatch = useAppDispatch();

  const {
    set: setAudioNode,
    remove: removeAudioNode,
    setAll: setAllAudioNodes,
    reset: resetAudioNodes,
  } = audioNodeActions;

  const turnOnMicrophone = useCallback(async () => {
    const toto = navigator.mediaDevices;
    // console.log(await toto.enumerateDevices(), 'enumerate');

    await navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        if (isMute) {
          stream.getAudioTracks().forEach((tr) => (tr.enabled = false));
        }
        streamRef.current = stream;
      })
      .catch((e) => {
        console.log(e);
      });
  }, [streamRef, isMute]);

  const callEvent = useCallback(
    async (call: MediaConnection) => {
      const audioNode = new Audio();
      const userId = call.metadata.user_id;

      if (!streamRef.current?.active) {
        await turnOnMicrophone();
      }
      call.answer(streamRef.current as MediaStream);
      setCalls((prevstate) => [...prevstate, call]);

      call.on('stream', (stream) => {
        audioNode.srcObject = stream;
        console.log('receiving stream 2');
        console.log(stream);
        setAudioNode(userId, audioNode);
        if (!isMuteAudio) {
          audioNode.play();
        }
      });

      call.on('close', () => {
        audioNode.remove();
        removeAudioNode(userId);
        setCalls((prevState) => prevState.filter((c) => c !== call));
      });
      //}
    },
    [streamRef, isMuteAudio, setAudioNode, removeAudioNode, turnOnMicrophone]
  );

  const callUser = useCallback(
    async (id: string, userId: number) => {
      console.log('calling:', id, peer.id);
      const audioNode = new Audio();
      console.log(streamRef.current?.getTracks());
      if (!peer) return;
      const call = peer.call(id, streamRef.current as MediaStream, {
        metadata: {
          user_id: me?.id,
        },
      });
      setCalls((prevstate) => [...prevstate, call]);

      call?.on('stream', (stream) => {
        audioNode.srcObject = stream;
        console.log('receiving stream 1');
        console.log(stream);
        setAudioNode(userId, audioNode);
        if (!isMuteAudio) {
          audioNode.play();
        }

        stream.getAudioTracks().forEach((tr) => {});
      });

      // streamRef.current
      //     ?.getAudioTracks()
      //     .forEach((tr) => streamRef.current?.removeTrack(tr));

      call?.on('close', () => {
        audioNode.remove();
        removeAudioNode(userId);
        setCalls((prevState) => prevState.filter((c) => c !== call));
      });
    },
    [peer, me, isMuteAudio, setAudioNode, removeAudioNode]
  );

  // const toto = (truc: HTMLAudioElement) => {
  //   return <>{truc}</>;
  // };

  const hello = useCallback(
    async (data: { user_id: number; peer_id: string }) => {
      const { user_id, peer_id } = data;
      console.log('hello');
      console.log('peer id:', peer_id, 'user_id', user_id);
      // const {user_id}

      if (!streamRef.current?.active) {
        await turnOnMicrophone();
      }
      callUser(peer_id, user_id);
    },
    [callUser, turnOnMicrophone]
  );

  const goodBye = useCallback((user_id: number) => {
    console.log('goodbye', user_id);
    // console.log(callMap.has(user_id));
    // callMap.get(user_id)?.close();
    // removeCall(user_id);
  }, []);

  const muteSelf = () => {
    console.log('mute');
    streamRef.current?.getAudioTracks().forEach((tr) => (tr.enabled = false));
    dispatch(setMute());
  };

  const unmuteSelf = () => {
    console.log('unmute');
    streamRef.current?.getAudioTracks().forEach((tr) => (tr.enabled = true));
    dispatch(setUnmute());
  };

  const muteAudio = () => {
    console.log('mute audio');
    audioNodeMap.forEach((audioNode) => audioNode.pause());
    dispatch(setMuteAudio());
  };

  const unmuteAudio = () => {
    console.log('unmute audio');
    audioNodeMap.forEach((audioNode) => audioNode.play());
    dispatch(setUnmuteAudio());
  };

  useEffect(() => {
    if (activeVocalChannel) {
      socket.emit('joinvocalchannel', activeVocalChannel);
    }
    return () => {
      if (activeVocalChannel) {
        socket.emit('leftvocalchannel', activeVocalChannel);
      }
    };
  }, [activeVocalChannel, socket]);

  useEffect(() => {
    if (activeVocalChannel) {
      // if (!streamRef.current?.active) {
      //   await turnOnMicrophone();
      // }
      socket.on(`joiningvocalchannel:${activeVocalChannel}`, hello);
      socket.on(`leftvocalchannel:${activeVocalChannel}`, goodBye);
    }
    return () => {
      if (activeVocalChannel) {
        socket.off(`joiningvocalchannel:${activeVocalChannel}`, hello);
        socket.off(`leftvocalchannel:${activeVocalChannel}`, goodBye);
      }
    };
  }, [activeVocalChannel, socket, hello, goodBye]);

  useEffect(() => {
    setCalls((prevState) => {
      prevState.forEach((call) => {
        call.close();
      });
      return [];
    });
  }, [activeVocalChannel]);

  useEffect(() => {
    peer.on('call', callEvent);
    peer.on('error', (e) => console.log(e));
    // console.log('my peer:', peer ? peer.id : 'none');
    return () => {
      peer.off('call', callEvent);
      peer.off('error');
    };
  }, [peer, callEvent, hello]);

  const mutePerson = (userId: number) => {
    const audioNode = audioNodeMap.get(userId);
    // console.log(audioNode, 'mute exists ?');
    if (audioNode) {
      audioNode.volume = 0;
      setAudioNode(userId, audioNode);
      // console.log(audioNode.volume, 'audionode mute');
    }
  };

  const unmutePerson = (userId: number) => {
    const audioNode = audioNodeMap.get(userId);
    if (audioNode) {
      audioNode.volume = 1;
      setAudioNode(userId, audioNode);
      // console.log(audioNode.volume, 'audionode unmute');
    }
  };

  const handleChangeVolume = (
    e: React.ChangeEvent<HTMLInputElement>,
    audioNode: HTMLAudioElement
  ) => {
    audioNode.volume = Number(e.target.value);
    setAllAudioNodes(new Map(audioNodeMap));
  };

  const displayActiveVocalChannel = (chan: VocalChan) => {
    const menu = (u: number, me?: User) => {
      return (
        <Menu
          className='menu'
          style={{ minWidth: '200px' }}
          items={[
            {
              key: '1',
              label: (
                <div>
                  {u !== me?.id ? (
                    <input
                      type='range'
                      id='volume'
                      name='volume'
                      min='0'
                      max='1'
                      step={0.01}
                      value={audioNodeMap.get(u)?.volume}
                      onChange={(e) =>
                        handleChangeVolume(
                          e,
                          audioNodeMap.get(u) as HTMLAudioElement
                        )
                      }
                    />
                  ) : null}
                </div>
              ),
            },
            {
              key: '2',
              label:
                u !== me?.id ? (
                  <div
                    style={{ width: '100%', height: '100%' }}
                    onClick={() =>
                      audioNodeMap.get(u)?.volume !== 0
                        ? mutePerson(u)
                        : unmutePerson(u)
                    }
                  >
                    {audioNodeMap.get(u)?.volume !== 0 ? 'mute' : 'unmute'}
                  </div>
                ) : null,
            },
          ]}
        />
      );
    };
    return (
      <li
        key={chan.id}
        // onClick={() => onVocalChannelClick(chan.id)}
      >
        {' '}
        <div className='panelContent'>
          <SoundOutlined />{' '}
          <span
            style={{ color: activeVocalChannel === chan.id ? 'white' : '' }}
          >
            {chan.name}
          </span>
        </div>
        {/* {activeVocalChannel === chan.id && (
      <>
        {' '}
        <BorderlessTableOutlined className='activeChannel' />
      </>
    )} */}
        {chan.users.map((u) => (
          <div
            onClick={() => console.log(serverUserMap.get(u), 'test')}
            key={u}
            style={{ marginTop: '5px' }}
            className='panelContent'
          >
            <Dropdown
              overlay={menu(u, me)}
              trigger={['contextMenu']}
              disabled={u === me?.id}
            >
              <div className='site-dropdown-context-menu'>
                <Avatar
                  size={20}
                  style={{ margin: '0px 5px 0px 20px' }}
                  src={serverUserMap.get(u)?.user.picture ?? logo}
                />{' '}
                {serverUserMap.get(u)?.nickname || 'Error retrieving user'}
                {u !== me?.id ? ` ${audioNodeMap.get(u)?.volume ?? ''}` : null}
              </div>
            </Dropdown>
          </div>
        ))}
      </li>
    );
  };

  return (
    <VocalChannelContext.Provider
      value={{
        stream: streamRef.current,
        muteSelf,
        unmuteSelf,
        muteAudio,
        unmuteAudio,
        displayActiveVocalChannel,
      }}
    >
      {children}
    </VocalChannelContext.Provider>
  );
};

export default VocalChannelContextProvider;

export { VocalChannelContext };
