import { useContext, useState } from 'react';
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
  const [camera, setCamera] = useState(false);
  const handleCamera = () => {
    if (camera) {
      turnOnCamera(false);
      setCamera(false);
    } else {
      turnOnCamera(true);
      setCamera(true);
    }
  };
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
              key={u}
              stream={streamMap.get(u) ?? undefined}
              user={u}
            />
          ) : null
        )}
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <button
          style={{
            borderRadius: 0,
            border: 0,
            padding: '3px 10px',
            color: 'grey',
            backgroundColor: '#40444b',
            marginTop: '10px',
            marginRight: '10px',
          }}
          onClick={() => handleCamera()}
        >
          {!camera ? 'Activer caméra' : 'Desactiver caméra'}
        </button>
      </div>
    </>
  );
};
