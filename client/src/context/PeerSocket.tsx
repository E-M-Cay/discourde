import React, { createContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { host, socketPort } from '../env/host';
import { peerPort, peerServerHost } from '../env/host';
import Peer from 'peerjs';

interface PeerSocket {
    peer?: Peer;
    socket?: Socket;
    connectPeer: () => void;
    connectSocket: (token: string) => void;
}

const PeerSocketContext = createContext<PeerSocket>({
    connectPeer: () => {
        throw new Error('connectPeer not correctly overriden');
    },
    connectSocket: () => {
        throw new Error('connectSocket not correctly overriden');
    },
});

interface Props {
    children: React.ReactNode;
}

const PeerSocketProvider: React.FunctionComponent<Props> = ({ children }) => {
    interface ISocket extends Socket {
        username?: string;
    }

    const [socket, setSocket] = useState<ISocket>();
    const [peer, setPeer] = useState<Peer>();

    const connectSocket = (token: string) => {
        socket?.close();
        if (process.env.NODE_ENV === 'production') {
            setSocket(
                io(`wss://${host}:${socketPort}/`, {
                    auth: {
                        token,
                    },
                })
            );
        } else {
            setSocket(
                io(`ws://${host}:${socketPort}/`, {
                    auth: {
                        token,
                    },
                })
            );
        }
    };

    const connectPeer = () => {
        let secure = false;
        if (process.env.NODE_ENV === 'production') {
            secure = true;
        }

        const newPeer = new Peer({
            config: {
                iceServers: [
                    { urls: ['stun:stun.l.google.com:19302'] },
                    {
                        urls: 'turn:turn.bistri.com:80',
                        credential: 'homeo',
                        username: 'homeo',
                    },
                ],
                sdpSemantics: 'unified-plan',
            },
            port: peerPort,
            host: peerServerHost,
            path: '/',
            debug: 3,
            secure: secure,
        });
        setPeer(newPeer);
    };

    return (
        <PeerSocketContext.Provider
            value={{ peer, socket, connectPeer, connectSocket }}>
            {children}
        </PeerSocketContext.Provider>
    );
};

export default PeerSocketProvider;

export { PeerSocketContext };
