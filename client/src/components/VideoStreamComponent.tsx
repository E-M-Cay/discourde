import { Avatar } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserMapsContext } from '../context/UserMapsContext';

const VideoStreamComponent = (props: {
  stream?: MediaStream;
  user: number;
}) => {
  const { stream, user } = props;
  const cam = 'jean';
  const bool = false;
  const { serverUserMap } = useContext(UserMapsContext);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log(stream?.getVideoTracks().length, 'length3');
  });

  useEffect(() => {
    const videoNode = videoRef.current;
    if (stream && videoNode) {
      // if (stream.getVideoTracks().length > 0) {
      videoNode.srcObject = stream;
      // }
      videoNode.volume = 0;
      videoNode?.play();
    }

    return () => {
      if (stream && videoNode) {
        videoNode?.pause();
      }
    };
  }, [stream, serverUserMap]);

  console.log(serverUserMap.get(user), 'test display');

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
          backgroundImage: `url(${
            serverUserMap.get(user)?.user.picture ??
            '/profile-pictures/robot1.png'
          })`,
          backgroundSize: '99999999px',
          //   border: '8px solid rgba(0, 0, 0, 0.7)',
        }}
      >
        {serverUserMap.get(user)?.user.mediaStatus.camera ? (
          <video
            ref={videoRef}
            autoPlay
            // src='http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '10px',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Avatar
              src={
                serverUserMap.get(user)?.user.picture ??
                '/profile-pictures/robot1.png'
              }
              size={100}
              style={{ margin: 'auto' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoStreamComponent;
