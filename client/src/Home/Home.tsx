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
import NotificationsContextProvider from '../context/NotificationsContext';
import UserMapsContextProvider from '../context/UserMapsContext';
import { PeerSocketContext } from '../context/PeerSocket';

export const Home = () => {
  const [servers, setServers] = useState<ServerResponse[]>([]);
  const dispatch = useAppDispatch();

  const activeServer = useAppSelector(
    (state) => state.userReducer.activeServer
  );
  const me = useAppSelector((state) => state.userReducer.me);
  const { isPeerConnected, isSocketConnected } = useContext(PeerSocketContext);

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
        dispatch(setActiveServerOwner(res.data[0]?.server?.owner.id || -1));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch]);

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
    <UserMapsContextProvider>
      <NotificationsContextProvider>
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
      </NotificationsContextProvider>
    </UserMapsContextProvider>
  );
};
