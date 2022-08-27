import { useContext } from 'react';
import VideoStreamComponent from '../components/VideoStreamComponent';
import { VocalChannelContext } from '../components/VocalChannel';
import { useAppSelector } from '../redux/hooks';

export const CameraView = (props: {
  users: number[];
  stream?: MediaStream;
  streamMap: Omit<Map<number, MediaStream>, 'delete' | 'set' | 'clear'>;
}) => {
  const me = useAppSelector((state) => state.userReducer.me);
  const { users, stream, streamMap } = props;
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        height: 'calc(95vh - 44px)',
        margin: 'auto',
      }}
    >
      <VideoStreamComponent stream={stream} />
      {users.map((u) =>
        u !== me?.id ? (
          <VideoStreamComponent stream={streamMap.get(u) ?? undefined} />
        ) : null
      )}
    </div>
  );
};
