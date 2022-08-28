import { useContext } from 'react';
import VideoStreamComponent from '../components/VideoStreamComponent';
import { VocalChannelContext } from '../components/VocalChannel';
import { useAppSelector } from '../redux/hooks';

export const CameraView = (props: {
  users: number[];
  stream?: MediaStream;
  streamMap: Omit<Map<number, MediaStream>, 'delete' | 'set' | 'clear'>;
  videoElRef: React.RefObject<HTMLVideoElement>;
  turnOnCamera: (state: boolean) => void;
}) => {
  const { me } = useAppSelector((state) => state.userReducer);
  const { users, stream, streamMap, turnOnCamera } = props;
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          width: '100%',
          height: 'calc(95vh - 44px)',
          margin: 'auto',
        }}
      >
        {me && <VideoStreamComponent stream={stream} user={me.id} />}
        {users.map((u) =>
          u !== me?.id ? (
            <VideoStreamComponent
              stream={streamMap.get(u) ?? undefined}
              user={u}
            />
          ) : null
        )}
      </div>
      <button onClick={() => turnOnCamera(true)}>activer caméra</button>
      <button onClick={() => turnOnCamera(false)}>desactiver caméra</button>
    </>
  );
};
