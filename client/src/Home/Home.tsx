import { useCallback, useContext, useEffect, useState } from 'react';
import { LeftBar } from '../LeftBar/LeftBar';
import { Main } from '../Main/Main';
import { Col, Row } from 'antd';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  setActiveServer,
  setActiveServerName,
  setActiveServerOwner,
  setIsHome,
} from '../redux/userSlice';
import { ServerResponse } from '../types/types';
import VocalChannelContextProvider from '../components/VocalChannel';
import NotificationsContextProvider, {
  NotificationsContext,
} from '../context/NotificationsContext';
import UserMapsContextProvider from '../context/UserMapsContext';
import { PeerSocketContext } from '../context/PeerSocket';

export const Home = () => {
  const [servers, setServers] = useState<ServerResponse[]>([]);
  const dispatch = useAppDispatch();
  const { socket } = useContext(PeerSocketContext);

  const activeServer = useAppSelector(
    (state) => state.userReducer.activeServer
  );
  const me = useAppSelector((state) => state.userReducer.me);
  const { isPeerConnected, isSocketConnected } = useContext(PeerSocketContext);
  const { addNotification } = useContext(NotificationsContext);

  const getServers = useCallback(() => {
    axios
      .get('server/list', {
        headers: {
          access_token: localStorage.getItem('token') as string,
        },
      })
      .then((res) => {
        //console.log(res.data[0], 'data');
        setServers(res.data);
        // //console.log('active server:', res.data[0].server.id);
        dispatch(setActiveServer(res.data[0]?.server.id));
        dispatch(setActiveServerName(res.data[0]?.server.name));
        dispatch(setActiveServerOwner(res.data[0]?.server?.owner.id || -1));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch]);

  const handleLeaveServer = () => {
    const serv = activeServer;
    axios
      .delete(`/server/${serv}/user/${me?.id}`, {
        headers: {
          access_token: localStorage.getItem('token') as string,
        },
      })
      .then((res) =>
        setServers((prevstate) =>
          prevstate.filter((server) => server.server.id !== serv)
        )
      )
      .catch((e) => console.log(e));

    return () => {
      setServers([]);
    };
  };

  useEffect(() => {
    if (isSocketConnected) {
      getServers();
    }

    return () => {
      setServers([]);
    };
  }, [getServers, isSocketConnected]);

  return (
    <NotificationsContextProvider>
      <UserMapsContextProvider>
        <VocalChannelContextProvider>
          {isPeerConnected ? (
            <Row style={{ backgroundColor: '#353535' }}>
              <Col span={1}>
                <LeftBar setServers={setServers} servers={servers} />
              </Col>
              <Col span={23}>
                <Main
                  servers={servers}
                  handleLeaveServer={handleLeaveServer}
                  setServers={setServers}
                />
              </Col>
            </Row>
          ) : null}
        </VocalChannelContextProvider>
      </UserMapsContextProvider>
    </NotificationsContextProvider>
  );
};
