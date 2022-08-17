import { useCallback, useContext, useEffect, useState } from 'react';
import { LeftBar } from '../LeftBar/LeftBar';
import { Main } from '../Main/Main';
import { Col, Row } from 'antd';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setActiveServer, setActiveServerName } from '../redux/userSlice';
import { ServerResponse } from '../types/types';
import { PeerSocketContext } from '../context/PeerSocket';

export const Home = (props: {
  setTokenMissing: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [servers, setServers] = useState<ServerResponse[]>([]);
  const dispatch = useAppDispatch();
  const { socket } = useContext(PeerSocketContext);

  const getServers = useCallback(() => {
    axios
      .get('server/list', {
        headers: {
          access_token: localStorage.getItem('token') as string,
        },
      })
      .then((res) => {
        console.log(res.data[0], 'data');
        setServers(res.data);
        // console.log('active server:', res.data[0].server.id);
        dispatch(setActiveServer(res.data[0]?.server.id));
        dispatch(setActiveServerName(res.data[0]?.server.name));
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.e.message === 'jwt expired') {
          localStorage.removeItem('token');
          props.setTokenMissing(true);
        }
      });
  }, [dispatch, props]);

  useEffect(() => {
    console.log('change token ??');
    socket?.on('ready', getServers);
    console.log(window.location.pathname.substring(1));
    if (window.location.pathname.substring(1) !== '') {
      joinServer(window.location.pathname.substring(1));
    }
    return () => {
      socket?.off('ready', getServers);
    };
  }, [getServers, socket]);

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
