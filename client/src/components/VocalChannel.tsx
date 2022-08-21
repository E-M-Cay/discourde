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
import { useAppSelector } from '../redux/hooks';

interface VocalChannel {
  stream?: MediaStream;
  callMap: Omit<Map<number, MediaConnection>, 'delete' | 'set' | 'clear'>;
}

const VocalChannelContext = createContext<VocalChannel>({
  callMap: new Map<number, MediaConnection>(),
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
  const [callMap, callActions] = useMap<number, MediaConnection>();

  const {
    set: setCall,
    remove: removeCall,
    setAll: setAllCalls,
    reset: resetCalls,
  } = callActions;

  const toggleMicrophone = async () => {
    const toto = navigator.mediaDevices;
    console.log(await toto.enumerateDevices(), 'enumerate');

    if (!streamRef.current?.active) {
      await navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          stream.getAudioTracks().forEach((track) => {
            console.log(streamRef.current);
          });
          streamRef.current = stream;
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      try {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const callEvent = useCallback(async (call: MediaConnection) => {
    const audioNode = new Audio();
    // const userId = call.metadata.user_id;

    if (!streamRef.current?.active) {
      await toggleMicrophone();
    }
    call.answer(streamRef.current as MediaStream);

    call.on('stream', (stream) => {
      audioNode.srcObject = stream;
      console.log('receiving stream 2');
      console.log(stream);
      audioNode.play();
      // setCall(userId, call);
    });

    call.on('close', () => {
      audioNode.remove();
      // removeCall(userId);
    });
    //}
  }, []);

  const callUser = useCallback(
    async (id: string, userId: number) => {
      console.log('calling:', id, peer?.id);
      const audioNode = new Audio();
      console.log(streamRef.current?.getTracks());
      const call = peer?.call(id, streamRef.current as MediaStream, {
        // metadata: {
        //   user_id: me?.id,
        // },
      });

      call?.on('stream', (stream) => {
        setCall(userId, call);
        audioNode.srcObject = stream;
        console.log('receiving stream 1');
        console.log(stream);
        audioNode.play();
        stream.getAudioTracks().forEach((tr) => {});
      });

      // streamRef.current
      //     ?.getAudioTracks()
      //     .forEach((tr) => streamRef.current?.removeTrack(tr));

      call?.on('close', () => {
        audioNode.remove();
        removeCall(userId);
      });
    },
    [peer, me]
  );

  const hello = useCallback(
    async (data: { user_id: number; peer_id: string }) => {
      const { user_id, peer_id } = data;
      console.log('hello');
      console.log('peer id:', peer_id);
      // const {user_id}

      if (!streamRef.current?.active) {
        await toggleMicrophone();
      }
      callUser(peer_id, user_id);
    },
    [callUser]
  );

  const goodBye = useCallback(
    (user_id: number) => {
      console.log('goodbye', user_id);
      callMap.get(user_id)?.close();
      removeCall(user_id);
    },
    [callMap]
  );

  const muteSelf = () => {
    streamRef.current?.getAudioTracks().forEach((tr) => (tr.enabled = false));
  };

  const unmuteSelf = () => {
    streamRef.current?.getAudioTracks().forEach((tr) => (tr.enabled = true));
  };

  useEffect(() => {
    if (activeVocalChannel) {
      socket?.emit('joinvocalchannel', activeVocalChannel);
      socket?.on(`joiningvocalchannel:${activeVocalChannel}`, hello);
      socket?.on(`leftvocalchannel:${activeVocalChannel}`, goodBye);
    }
    return () => {
      if (activeVocalChannel) {
        socket?.off(`joiningvocalchannel:${activeVocalChannel}`, hello);
        socket?.off(`leftvocalchannel:${activeVocalChannel}`, goodBye);
        socket?.emit('leftvocalchannel', activeVocalChannel);
      }
    };
  }, [activeVocalChannel, socket, hello, goodBye]);

  // useEffect(() => {
  //   setActiveCalls((prevState) => {
  //     prevState.forEach((call) => {
  //       call.close();
  //     });
  //     return [];
  //   });
  // }, [activeVocalChannel]);

  useEffect(() => {
    peer?.on('call', callEvent);
    peer?.on('error', (e) => console.log(e));
    // console.log('my peer:', peer ? peer.id : 'none');
    return () => {
      peer?.off('call', callEvent);
      peer?.off('error');
    };
  }, [peer, callEvent, hello]);

  return (
    <VocalChannelContext.Provider
      value={{ stream: streamRef.current, callMap }}
    >
      {children}
    </VocalChannelContext.Provider>
  );
};

export default VocalChannelContextProvider;

export { VocalChannelContext };
