import { Avatar } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { UserMapsContext } from '../context/UserMapsContext';
import logo from '../assets/discourde.png';
import { VocalChannelContext } from './VocalChannel';
import Meyda from 'meyda';

const StreamVisualisation = (props: { u: number; stream?: MediaStream }) => {
  const { serverUserMap } = useContext(UserMapsContext);
  const { audioContext } = useContext(VocalChannelContext);
  const { u, stream } = props;
  const [features, setFeatures] = useState<any>();

  useEffect(() => {
    if (!stream) return;
    const source = audioContext.createMediaStreamSource(stream);
    const analyzer = Meyda.createMeydaAnalyzer({
      audioContext: audioContext,
      source: source,
      bufferSize: 512,
      featureExtractors: ['loudness'],
      callback: (features: any) => {
        // console.log(features.loudness.total);
        setFeatures(features);
      },
    });
    analyzer.start();
    return () => analyzer.stop();
  }, [stream]);

  return (
    <Avatar
      size={27}
      style={{
        marginRight: '5px',
        // marginBottom: '3px',
        boxSizing: 'content-box',
        border:
          Number(features?.loudness?.total) > 9
            ? '2px solid green'
            : '2px solid transparent',
      }}
      src={serverUserMap.get(u)?.user.picture ?? logo}
    />
  );
};

export default StreamVisualisation;
