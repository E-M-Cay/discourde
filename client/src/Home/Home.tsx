import react, { useCallback, useEffect, useState } from 'react';
import { LeftBar } from '../LeftBar/LeftBar';
import { Main } from '../Main/Main';
import { Col, Row } from 'antd';
import { ChanelBar } from '../ChanelBar/ChanelBar';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setActiveServer } from '../redux/userSlice';
import { ServerResponse } from '../types/types';

export const Home = (props: {
    setTokenMissing: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [servers, setServers] = useState<ServerResponse[]>([]);
    const token = useAppSelector((state) => state.userReducer.token);
    const dispatch = useAppDispatch();

    useEffect(() => {
        console.log('change token ??');
        getServers();
        console.log(window.location.pathname.substring(1));
        if (window.location.pathname.substring(1) !== '') {
            joinServer(window.location.pathname.substring(1));
        }
    }, [token]);

    const joinServer = (uuid: string) => {
        axios
            .post(
                '/server/add_user',
                { uuid },
                {
                    headers: {
                        access_token: localStorage.getItem('token') as string,
                    },
                }
            )
            .then((res) => {
                console.log(res, 'gdhdhdhdg');
                // dispatch(setActiveChannel(id));
            });
    };

    const getServers = useCallback(() => {
        if (token) {
            axios
                .get('server/list', {
                    headers: {
                        access_token: localStorage.getItem('token') as string,
                    },
                })
                .then((res) => {
                    if (res.data.length === 0) {
                        console.log('no servers');
                        return;
                    }
                    console.log(res.data[0], 'data');
                    setServers(res.data);
                    console.log('active server:', res.data[0].server.id);
                    dispatch(setActiveServer(res.data[0].server.id));
                })
                .catch((err) => {
                    console.log(err);
                    if (err.response.data.e.message === 'jwt expired') {
                        localStorage.removeItem('token');
                        props.setTokenMissing(true);
                    }
                });
        }
    }, [token]);

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
