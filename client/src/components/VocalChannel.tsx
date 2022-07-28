import { MediaConnection } from 'peerjs';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { PeerSocketContext } from '../context/PeerSocket';
import { useAppSelector } from '../redux/hooks';

interface UserInfo {
    socketId: number;
    id: string;
}

const VocalChannel = () => {
    const { peer, socket, connectPeer } = useContext(PeerSocketContext);
    const activeVocalChannel = useAppSelector(
        (state) => state.userReducer.activeVocalChannel
    );
    const [userList, setUserList] = useState<UserInfo[]>([]);
    const streamRef = useRef<MediaStream>();
    const [activeCalls, setActiveCalls] = useState<MediaConnection[]>([]);

    const toggleMicrophone = async () => {
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

    const openPeer = useCallback(
        (peer_id: string) => {
            console.log('peerid:', peer_id);
            peer?.on('call', (_call) =>
                console.log('fdsqljqdsùsdqjlkqsdjqlskdj')
            );
            socket?.emit('peerId', { peer_id });
        },
        [socket]
    );

    const callEvent = useCallback(async (call: MediaConnection) => {
        const audioNode = new Audio();

        if (!streamRef.current?.active) {
            await toggleMicrophone();
        }
        call.answer(streamRef.current as MediaStream);

        setActiveCalls((prevState) => [...prevState, call]);
        call.on('stream', (stream) => {
            audioNode.srcObject = stream;
            console.log('receiving stream 2');
            console.log(stream);
            audioNode.play();
        });

        call.on('close', () => {
            audioNode.remove();
        });
        //}
    }, []);

    //const receiveUsers = (userList: UserInfo[]) => {
    //setUserList([...userList]);
    // };

    const receiveUsers = (userList: any) => {
        console.log(new Map(userList), 'toto');
    };

    const callUser = useCallback(
        async (id: string) => {
            console.log('calling:', id, peer?.id);
            const audioNode = new Audio();
            console.log(streamRef.current?.getTracks());
            const call = peer?.call(id, streamRef.current as MediaStream);

            call?.on('stream', (stream) => {
                audioNode.srcObject = stream;
                console.log('receiving stream 1');
                console.log(stream);
                audioNode.play();
                setActiveCalls((prevState) => [...prevState, call]);
            });

            call?.on('close', () => {
                console.log('close pipi');
                audioNode.remove();
            });
            //call?.close();

            console.log(call, 'call');
        },
        [peer]
    );

    const hello = useCallback(
        async (data: { user_id: number; peer_id: string }) => {
            console.log('hello');
            console.log('peer id:', data.peer_id);

            if (!streamRef.current?.active) {
                await toggleMicrophone();
            }
            callUser(data.peer_id);
            /*setUserList((prevState) => [
                ...prevState,
                { socketId: data.user_id, id: data.peer_id },
            ]);*/
        },
        [callUser]
    );

    /*const userDisconnected = (id: string) => {
        setUserList((prevUserList) => {
            return prevUserList.filter((u) => u.socketId !== id);
        });
    };*/

    useEffect(() => {
        console.log('use pipi', activeVocalChannel);
        socket?.on(`joiningvocalchannel:${activeVocalChannel}`, hello);
        return () => {
            socket?.off(`joiningvocalchannel:${activeVocalChannel}`, hello);
        };
    }, [activeVocalChannel, socket, activeCalls, hello, peer]);

    useEffect(() => {
        activeCalls.forEach((call) => call.close());
    }, [activeVocalChannel]);

    useEffect(() => {
        peer?.on('call', callEvent);
        peer?.on('open', openPeer);
        //peer?.on('call', (mddqs) => console.log('fdssdfsf'));
        peer?.on('error', (e) => console.log(e));
        console.log('my peer:', peer ? peer.id : 'none');
        socket?.on('users', receiveUsers);
        //socket?.on('disconnected', userDisconnected);
        return () => {
            peer?.off('call', callEvent);
            peer?.off('open', openPeer);
            socket?.off('users', receiveUsers);
            //socket?.off('disconnected', userDisconnected);
        };
    }, [peer, socket, callEvent, openPeer, hello]);

    const displayUserList = () => {
        return userList.map((u) => {
            return (
                <div key={u.id}>
                    {u.socketId}, {u.id}
                    <button onClick={() => callUser(u.id)}></button>
                </div>
            );
        });
    };

    return <div>{null}</div>;
};

export default VocalChannel;
