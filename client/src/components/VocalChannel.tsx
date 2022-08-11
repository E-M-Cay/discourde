import { MediaConnection } from 'peerjs';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { PeerSocketContext } from '../context/PeerSocket';
import { useAppSelector } from '../redux/hooks';

const VocalChannel = () => {
    const { peer, socket } = useContext(PeerSocketContext);
    const activeVocalChannel = useAppSelector(
        (state) => state.userReducer.activeVocalChannel
    );
    const streamRef = useRef<MediaStream>();
    const [_activeCalls, setActiveCalls] = useState<MediaConnection[]>([]);

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
            setActiveCalls((prevState) => [...prevState, call]);
        });

        call.on('close', () => {
            audioNode.remove();
            setActiveCalls((prevCall) => prevCall.filter((c) => c !== call));
        });
        //}
    }, []);

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

            // streamRef.current
            //     ?.getAudioTracks()
            //     .forEach((tr) => streamRef.current?.removeTrack(tr));

            call?.on('close', () => {
                audioNode.remove();
                setActiveCalls((prevCall) =>
                    prevCall.filter((c) => c !== call)
                );
            });
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
        },
        [callUser]
    );

    useEffect(() => {
        if (activeVocalChannel)
            socket?.emit('joinvocalchannel', activeVocalChannel);
        socket?.on(`joiningvocalchannel:${activeVocalChannel}`, hello);
        return () => {
            socket?.off(`joiningvocalchannel:${activeVocalChannel}`, hello);
            if (activeVocalChannel)
                socket?.emit('leftvocalchannel', activeVocalChannel);
        };
    }, [activeVocalChannel, socket, hello]);

    useEffect(() => {
        setActiveCalls((prevState) => {
            prevState.forEach((call) => {
                call.close();
            });
            return [];
        });
        setActiveCalls([]);
    }, [activeVocalChannel]);

    useEffect(() => {
        peer?.on('call', callEvent);
        peer?.on('error', (e) => console.log(e));
        console.log('my peer:', peer ? peer.id : 'none');
        return () => {
            peer?.off('call', callEvent);
            peer?.off('error');
        };
    }, [peer, callEvent, hello]);

    return <></>;
};

export default VocalChannel;
