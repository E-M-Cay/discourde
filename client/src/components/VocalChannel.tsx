import { SoundOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu } from 'antd';
import { MediaConnection } from 'peerjs';
import {
  createContext,
  createRef,
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
  setActiveVocalChannel,
  setMute,
  setMuteAudio,
  setUnmute,
  setUnmuteAudio,
} from '../redux/userSlice';
import Meyda from 'meyda';
import { MeydaAnalyzer } from 'meyda/dist/esm/meyda-wa';

interface VocalChannel {
  stream?: MediaStream;
  displayActiveVocalChannel: (chan: VocalChan) => JSX.Element;
  muteSelf: () => void;
  unmuteSelf: () => void;
  muteAudio: () => void;
  unmuteAudio: () => void;
  isStreamInitialized: boolean;
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
  isStreamInitialized: false,
});

interface Props {
  children: React.ReactNode;
}

const AudioContext = window.AudioContext;

const audioContext = new AudioContext();

const VocalChannelContextProvider: React.FunctionComponent<Props> = ({
  children,
}) => {
  const { peer, socket } = useContext(PeerSocketContext);
  const activeVocalChannel = useAppSelector(
    (state) => state.userReducer.activeVocalChannel
  );
  const me = useAppSelector((state) => state.userReducer.me);
  const [audioNodeMap, audioNodeActions] = useMap<number, HTMLAudioElement>([]);
  const [callMap, callMapActions] = useMap<number, MediaConnection>([]);
  const [featureMap, featuresActions] = useMap<number, any>([]);
  const { serverUserMap } = useContext(UserMapsContext);
  const [isStreamInitialized, setIsStreamInitialized] = useState(false);
  const isMute = useAppSelector((state) => state.userReducer.isMute);
  const isMuteAudio = useAppSelector((state) => state.userReducer.isMuteAudio);
  const streamRef = useRef<MediaStream>();
  const dispatch = useAppDispatch();
  const [isLeaving, setIsLeaving] = useState(false);

  const {
    set: setAudioNode,
    remove: removeAudioNode,
    setAll: setAllAudioNodes,
    reset: resetAudioNodes,
  } = audioNodeActions;

  const {
    set: setCall,
    remove: removeCall,
    setAll: setAllCalls,
    reset: resetCalls,
  } = callMapActions;

  const {
    set: setFeature,
    remove: removeFeature,
    setAll: setAllFeatures,
    reset: resetFeatures,
  } = featuresActions;

  const turnOnMicrophone = async () => {
    return navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        streamRef.current = stream;
        setIsStreamInitialized(true);
      })
      .catch((e) => {
        throw new Error();
      });
  };

  const muteUnmuteStream = (mute: boolean) => {
    streamRef.current?.getTracks().forEach((tr) => (tr.enabled = !mute));
  };

  useEffect(() => {
    console.log('fresh');
  });

  const callEvent = useCallback(
    async (call: MediaConnection) => {
      const audioNode = new Audio();
      const source = audioContext.createMediaElementSource(audioNode);
      const analyzer = Meyda.createMeydaAnalyzer({
        audioContext: audioContext,
        source: source,
        bufferSize: 512,
        featureExtractors: ['loudness'],
        callback: (features: any) => {
          // console.log(features.loudness.total);
          setFeature(userId, features);
        },
      });
      analyzer.start();
      console.log('analyzer start');
      const userId = call.metadata.user_id;

      call.answer(streamRef.current as MediaStream);
      setCall(userId, call);

      call.on('stream', (stream) => {
        audioNode.srcObject = stream;

        setAudioNode(userId, audioNode);

        if (!isMuteAudio) {
          audioNode.play();
        }
      });

      call.on('error', () => {
        call.close();
      });

      call.on('close', () => {
        console.log('close');
        audioNode.pause();
        audioNode.remove();
        analyzer.stop();
        removeFeature(userId);
        removeAudioNode(userId);
        removeCall(userId);
      });
      //}
    },
    [
      isMuteAudio,
      setAudioNode,
      setCall,
      removeCall,
      removeAudioNode,
      setFeature,
      removeFeature,
    ]
  );

  const callUser = useCallback(
    async (id: string, userId: number) => {
      //console.log('calling:', id, peer?.id);
      // const audioNode = new Audio();
      //console.log(streamRef.current?.getTracks());
      if (!peer) return;
      if (streamRef.current) {
        const call = peer.call(id, streamRef.current, {
          metadata: {
            user_id: me?.id,
          },
        });
        setCall(userId, call);

        const audioNode = new Audio();
        const source = audioContext.createMediaElementSource(audioNode);
        const analyzer = Meyda.createMeydaAnalyzer({
          audioContext: audioContext,
          source: source,
          bufferSize: 512,
          featureExtractors: ['loudness'],
          callback: (features: any) => {
            setFeature(userId, features);
          },
        });

        call.on('stream', (stream) => {
          audioNode.srcObject = stream;
          analyzer.start();
          console.log('analyzer start');

          //
          setAudioNode(userId, audioNode);

          if (!isMuteAudio) {
            audioNode.play();
          }
        });

        call.on('error', () => {
          call.close();
        });

        call.on('close', () => {
          console.log('close');
          audioNode.pause();
          audioNode.remove();
          analyzer.stop();
          removeFeature(userId);
          removeAudioNode(userId);
          removeCall(userId);
          // setCalls((prevState) => prevState.filter((c) => c !== call));
        });
      }
    },
    [
      peer,
      me,
      isMuteAudio,
      setAudioNode,
      removeAudioNode,
      setCall,
      removeCall,
      setFeature,
      removeFeature,
    ]
  );

  const hello = useCallback(
    async (data: { user_id: number; peer_id: string }) => {
      const { user_id, peer_id } = data;
      //console.log('hello');
      //console.log('peer id:', peer_id, 'user_id', user_id);
      // const {user_id}

      if (!streamRef.current?.active) {
        await turnOnMicrophone();
      }
      callUser(peer_id, user_id);
    },
    [callUser]
  );

  const goodBye = useCallback(
    (user_id: number) => {
      callMap.get(user_id)?.close();
      removeCall(user_id);
    },
    [callMap, removeCall]
  );

  const muteSelf = () => {
    //console.log('mute');
    // streamRef.current?.getAudioTracks().forEach((tr) => (tr.enabled = false));
    muteUnmuteStream(true);
    dispatch(setMute());
  };

  const unmuteSelf = () => {
    console.log('unmute');
    muteUnmuteStream(false);
    dispatch(setUnmute());
  };

  const muteAudio = () => {
    //console.log('mute audio');
    audioNodeMap.forEach((audioNode) => audioNode.pause());
    dispatch(setMuteAudio());
  };

  const unmuteAudio = () => {
    //console.log('unmute audio');
    audioNodeMap.forEach((audioNode) => audioNode.play());
    dispatch(setUnmuteAudio());
  };

  const leaveVocalChannel = useCallback(() => {
    dispatch(setActiveVocalChannel(0));
    setIsStreamInitialized(false);
  }, [dispatch]);

  useEffect(() => {
    streamRef.current
      ?.getAudioTracks()[0]
      ?.addEventListener('ended', leaveVocalChannel);

    return () => {
      streamRef.current
        ?.getAudioTracks()[0]
        ?.removeEventListener('ended', leaveVocalChannel);
    };
  }, [leaveVocalChannel]);

  useEffect(() => {
    if (!isStreamInitialized && activeVocalChannel) {
      turnOnMicrophone().catch(() => {
        dispatch(setActiveVocalChannel(0));
      });
    }
  }, [activeVocalChannel, isStreamInitialized, dispatch]);

  useEffect(() => {
    if (!activeVocalChannel) {
      socket.emit('novocal');
    }
    if (isStreamInitialized && activeVocalChannel) {
      socket.emit('joinvocalchannel', activeVocalChannel);
    }

    return () => {
      if (activeVocalChannel && isStreamInitialized) {
        socket.emit('leftvocalchannel', activeVocalChannel);
        setIsLeaving(true);
      }
    };
  }, [activeVocalChannel, socket, dispatch, isStreamInitialized]);

  useEffect(() => {
    if (isStreamInitialized && isMute) {
      muteUnmuteStream(true);
    }
  }, [isMute, isStreamInitialized]);

  useEffect(() => {
    if (activeVocalChannel && isStreamInitialized) {
      socket.on(`joiningvocalchannel:${activeVocalChannel}`, hello);
      socket.on(`leftvocalchannel:${activeVocalChannel}`, goodBye);
    }
    return () => {
      if (activeVocalChannel) {
        socket?.off(`joiningvocalchannel:${activeVocalChannel}`, hello);
        socket?.off(`leftvocalchannel:${activeVocalChannel}`, goodBye);
      }
    };
  }, [activeVocalChannel, socket, hello, goodBye, isStreamInitialized]);

  useEffect(() => {
    if (isLeaving) {
      callMap.forEach((call) => call.close());
      setIsLeaving(false);
    }
  }, [activeVocalChannel, isLeaving, callMap]);

  useEffect(() => {
    peer.on('call', callEvent);
    peer.on('error', (e) => console.log(e));
    // //console.log('my peer:', peer ? peer.id : 'none');
    return () => {
      peer.off('call', callEvent);
      peer.off('error');
    };
  }, [peer, callEvent]);

  const mutePerson = (userId: number) => {
    const audioNode = audioNodeMap.get(userId);
    // //console.log(audioNode, 'mute exists ?');
    if (audioNode) {
      audioNode.volume = 0;
      setAudioNode(userId, audioNode);
      // //console.log(audioNode.volume, 'audionode mute');
    }
  };

  const unmutePerson = (userId: number) => {
    const audioNode = audioNodeMap.get(userId);
    if (audioNode) {
      audioNode.volume = 1;
      setAudioNode(userId, audioNode);
      // //console.log(audioNode.volume, 'audionode unmute');
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
    const menu = (u: number, me: User) => {
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
        {chan.users.map((u) => {
          // while (u) {
          //   console.log(
          //     analyzerMap.get(u)?.get()?.loudness?.total,
          //     '!!!!!!!!!!!!!!!!!!!!!'
          //   );
          // }

          return (
            <div
              // onClick={() => console.log(serverUserMap.get(u), 'test')}
              key={u}
              style={{ marginTop: '5px' }}
              // className='panelContentRen'
            >
              {/* <div>{featureMap.get(u)?.loudness?.total} TOTAL</div> */}
              {me && (
                <Dropdown
                  overlay={menu(u, me)}
                  trigger={['click']}
                  disabled={u === me?.id}
                >
                  <div className='site-dropdown-context-menu panelContentRen'>
                    <Avatar
                      size={27}
                      style={{
                        marginRight: '5px',
                        // marginBottom: '3px',
                        boxSizing: 'content-box',
                        border:
                          Number(featureMap.get(u)?.loudness?.total) > 9
                            ? '2px solid green'
                            : '2px solid transparent',
                      }}
                      src={serverUserMap.get(u)?.user.picture ?? logo}
                    />{' '}
                    {serverUserMap.get(u)?.nickname || 'Error retrieving user'}
                    {/* {u !== me?.id ? ` ${audioNodeMap.get(u)?.volume ?? ''}` : null} */}
                  </div>
                </Dropdown>
              )}
            </div>
          );
        })}
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
        isStreamInitialized,
      }}
    >
      {children}
    </VocalChannelContext.Provider>
  );
};

export default VocalChannelContextProvider;

export { VocalChannelContext };
