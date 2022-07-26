import { MediaConnection } from 'peerjs';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { PeerSocketContext } from '../context/PeerSocket';
import { useAppSelector } from '../redux/hooks';

interface UserInfo {
    socketId: string;
    id: string;
}

const VocalChannel = () => {
    const { peer, socket } = useContext(PeerSocketContext);
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
                        console.log(track.getSettings());
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
            socket?.emit('peerId', { peer_id });
        },
        [socket]
    );

    const callEvent = useCallback(async (call: MediaConnection) => {
        const audioNode = new Audio();
        // eslint-disable-next-line no-restricted-globals
        //if (confirm(`Call incoming`)) {
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
            const audioNode = new Audio();
            console.log(id);
            const call = peer?.call(id, streamRef.current as MediaStream);

            if (!call) return;
            setActiveCalls((prevState) => [...prevState, call]);

            call?.on('stream', (stream) => {
                audioNode.srcObject = stream;
                console.log('receiving stream 1');
                console.log(stream);
                audioNode.play();
            });

            call?.on('close', () => {
                audioNode.remove();
            });
            call?.close();
        },
        [peer]
    );

    const hello = useCallback(
        async (data: { user_id: number; peer_id: string }) => {
            console.log('hello');

            if (!streamRef.current?.active) {
                await toggleMicrophone();
            }
            callUser(data.peer_id);
        },
        [callUser]
    );

    const userDisconnected = (id: string) => {
        setUserList((prevUserList) => {
            return prevUserList.filter((u) => u.socketId !== id);
        });
    };

    useEffect(() => {
        activeCalls.forEach((call) => call.close());
        socket?.on(`joiningvocalchannel:${activeVocalChannel}`, hello);
        return () => {
            socket?.off(`joiningvocalchannel:${activeVocalChannel}`, hello);
        };
    }, [activeVocalChannel, socket, peer]);

    useEffect(() => {
        peer?.on('call', callEvent);
        peer?.on('open', openPeer);
        socket?.on('users', receiveUsers);
        socket?.on('disconnected', userDisconnected);
        return () => {
            peer?.off('call', callEvent);
            peer?.off('open', openPeer);
            socket?.off('users', receiveUsers);
            socket?.off('disconnected', userDisconnected);
        };
    }, [peer, socket, callEvent, openPeer, hello]);

    const displayUserList = () => {
        return userList.map((u) => {
            return (
                <div>
                    {u.socketId}, {u.id}
                    <button onClick={() => callUser(u.id)}></button>
                </div>
            );
        });
    };

    return <div>{displayUserList()}</div>;
};

export default VocalChannel;
