import { Avatar } from 'antd';
import { useEffect, useRef } from 'react';

const VideoStreamComponent = (props: { stream?: MediaStream }) => {
  const { stream } = props;
  const cam = 'jean';
  const bool = false;
  const videoRef = useRef<HTMLVideoElement>(null);

  //   stream.getVideoTracks().forEach((tr) => {
  //     tr.addEventListener('mute')
  //   })

  useEffect(() => {
    // if (stream && videoRef.current) {
    //     videoRef.current?.src = stream
    // }

    return () => {};
  }, [stream]);

  return (
    <div
      style={{
        flexBasis: '50%',
        width: '100%',
        height: cam.length > 2 ? '50%' : '100%',
        marginTop: '10px',
        marginInline: 'auto',
      }}
    >
      <div
        className='camcam'
        style={{
          width: 'calc(100%-20px)',
          height: '100%',
          backgroundColor: '#323232',
          margin: '10px',
          borderRadius: '10px',
          boxSizing: 'border-box',
          backgroundImage: `url(/profile-pictures/robot1.png)`,
          backgroundSize: '99999999px',
          //   border: '8px solid rgba(0, 0, 0, 0.7)',
        }}
      >
        {!bool ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Avatar
              src={'/profile-pictures/robot1.png'}
              size={100}
              style={{ margin: 'auto' }}
            />
          </div>
        ) : (
          <video ref={videoRef} />
        )}
      </div>
    </div>
  );
};

export default VideoStreamComponent;
