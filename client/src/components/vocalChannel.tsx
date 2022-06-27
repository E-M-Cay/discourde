import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../context/socket';
import { useAppSelector } from '../redux/hooks';

const vocalChannel = (props: { channelName: string }) => {
  const socket = useContext(SocketContext);
  const { channelName } = props;
  const user = useAppSelector((state) => state.userReducer);
  const [users, setUsers] = useState<string[]>([]);
  useEffect(() => {
    if (users.length === 0) {
    }
    return () => {};
  });
};

export default vocalChannel;
