import { useCallback, useContext, useEffect, useState } from 'react';
import { LeftBar } from '../LeftBar/LeftBar';
import { Main } from '../Main/Main';
import { Col, Row } from 'antd';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  setActiveServer,
  setActiveServerName,
  setIsHome,
} from '../redux/userSlice';
import { ServerResponse } from '../types/types';
import { PeerSocketContext } from '../context/PeerSocket';

export const Home = (props: {
  setTokenMissing: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [servers, setServers] = useState<ServerResponse[]>([]);
  const dispatch = useAppDispatch();
  const { socket } = useContext(PeerSocketContext);
  const activeServer = useAppSelector(
    (state) => state.userReducer.activeServer
  );
  const me = useAppSelector((state) => state.userReducer.me);

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

  const handleLeaveServer = () => {
    axios
      .delete(`/server/${activeServer}/user/${me?.id}`, {
        headers: {
          access_token: localStorage.getItem('token') as string,
        },
      })
      .then((res) => {
        if (res.status === 204) {
          if (servers.length > 0) {
            setServers((prevState) =>
              prevState.filter((serv) => serv.server.id !== activeServer)
            );
            dispatch(setActiveServer(servers[0].server.id));
          } else {
            dispatch(setIsHome(true));
          }
        }
      });
  };

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
        <Main handleLeaveServer={handleLeaveServer} setServers={setServers} />
      </Col>
    </Row>
  );
};
