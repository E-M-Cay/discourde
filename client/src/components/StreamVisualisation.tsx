import { Avatar, Drawer } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { UserMapsContext } from '../context/UserMapsContext';
import logo from '../assets/discourde.png';
import { VocalChannelContext } from './VocalChannel';
import Meyda from 'meyda';

const StreamVisualisation = (props: { u: number; stream?: MediaStream }) => {
  const { serverUserMap } = useContext(UserMapsContext);
  const { audioContext } = useContext(VocalChannelContext);
  const { u, stream } = props;
  const [average, setAverage] = useState<number>(0);

  useEffect(() => {
    if (!stream) return;
    let callBack: NodeJS.Timeout;

    const getAverageVolume = (analyser: AnalyserNode) => {
      const array = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(array);
      let values = 0;
      let average: number;

      const length = array.length;

      // get all the frequency amplitudes
      for (let i = 0; i < length; i++) {
        values += array[i];
      }

      average = values / length;
      setAverage(average);

      callBack = setTimeout(() => {
        getAverageVolume(analyser);
      }, 500);
    };

    const source = audioContext.createMediaStreamSource(stream);

    const analyser = audioContext.createAnalyser();
    analyser.minDecibels = -90;
    analyser.fftSize = 256;

    const gainNode = audioContext.createGain();
    const bufferLength = analyser.frequencyBinCount;

    source.connect(gainNode);
    gainNode.connect(analyser);
    getAverageVolume(analyser);
    return () => {
      clearTimeout(callBack);
    };
  }, [stream, audioContext]);

  return (
    <>
      <Avatar
        size={27}
        style={{
          marginRight: '5px',
          // marginBottom: '3px',
          boxSizing: 'content-box',
          border:
            Number(average) > 8 ? '2px solid green' : '2px solid transparent',
        }}
        src={serverUserMap.get(u)?.user.picture ?? logo}
      />
    </>
  );
};

export default StreamVisualisation;
