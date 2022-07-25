import react, { useEffect, useState } from 'react';
import { LeftBar } from '../LeftBar/LeftBar';
import { Main } from '../Main/Main';
import { Col, Row } from 'antd';
import { ChanelBar } from '../ChanelBar/ChanelBar';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setActiveServer } from '../redux/userSlice';

interface ServerResponse {
    id: number;
    nickname: string;
    server: Server;
}

interface Server {
    id: number;
    logo: string;
    main_img: string;
    name: string;
}

export const Home = () => {
    const [servers, setServers] = useState<ServerResponse[]>([]);
    let ignore = false;
    useEffect(() => {
        getServers();
        return () => {
            ignore = true;
        };
    }, []);
    const getServers = () => {
        if (servers.length === 0 && !ignore) {
            axios
                .get('server/list', {
                    headers: {
                        access_token: localStorage.getItem('token') as string,
                    },
                })
                .then((res) => {
                    console.log(res.data[0], 'data');
                    setServers(res.data);
                    setActiveServer(res.data[0].server.id);
                });
        }
    };

    return (
        <Row style={{ backgroundColor: '#353535' }}>
            <Col span={1}>
                <LeftBar setServers={setServers} servers={servers} />
            </Col>
            <Col span={23}>
                <Main />
            </Col>
        </Row>
    );
};
