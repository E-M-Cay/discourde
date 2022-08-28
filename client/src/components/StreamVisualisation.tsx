import { Avatar, Drawer } from 'antd';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { UserMapsContext } from '../context/UserMapsContext';
import logo from '../assets/discourde.png';
import { VocalChannelContext } from './VocalChannel';
import Meyda from 'meyda';

const StreamVisualisation = (props: { u: number; stream?: MediaStream }) => {
  const { serverUserMap } = useContext(UserMapsContext);
  const { audioContext } = useContext(VocalChannelContext);
  const { u, stream } = props;
  const [features, setFeatures] = useState<any>();
  const [bufferLength, setBufferLength] = useState<number>(0);
  const [callBack, setCallBack] = useState<NodeJS.Timeout>();

  const setUpAnalyzer = (stream: MediaStream) => {};

  useLayoutEffect(() => {
    if (!stream) return;
    let callBack: NodeJS.Timeout;

    const getAverageVolume = (array: Uint8Array, analyser: AnalyserNode) => {
      analyser.getByteFrequencyData(array);
      let values = 0;
      let average: number;

      const length = array.length;

      // get all the frequency amplitudes
      for (let i = 0; i < length; i++) {
        values += array[i];
      }

      average = values / length;
      setBufferLength(average);

      callBack = setTimeout(() => {
        getAverageVolume(array, analyser);
      }, 200);
    };

    const source = audioContext.createMediaStreamSource(stream);

    const analyser = audioContext.createAnalyser();
    analyser.minDecibels = -90;
    analyser.fftSize = 256;

    const gainNode = audioContext.createGain();
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(gainNode);
    gainNode.connect(analyser);
    getAverageVolume(dataArray, analyser);

    // setUpAnalyzer(stream);

    // const distortion = audioContext.createWaveShaper();

    // const biquadFilter = audioContext.createBiquadFilter();
    // const convolver = audioContext.createConvolver();

    // const pcmData = new Float32Array(analyser.fftSize);
    // analyser.getFloatTimeDomainData(pcmData);
    // let sumSquares = 0.0;

    // analyser.maxDecibels = -10;
    // if (!stream) return;
    // const analyzer = Meyda.createMeydaAnalyzer({
    //   audioContext,
    //   source: source,
    //   bufferSize: 8192,
    //   featureExtractors: ['loudness'],
    //   sampleRate: 0,
    //   hopSize: 8192,
    //   callback: (features: any) => {
    //     console.log(features.loudness.total);
    //     setFeatures(features);
    //   },
    // });
    // analyzer.start();
    return () => {
      clearTimeout(callBack);
    };
  }, [stream]);

  return (
    <>
      <Avatar
        size={27}
        style={{
          marginRight: '5px',
          // marginBottom: '3px',
          boxSizing: 'content-box',
          border:
            Number(bufferLength) > 8
              ? '2px solid green'
              : '2px solid transparent',
        }}
        src={serverUserMap.get(u)?.user.picture ?? logo}
      />
    </>
  );
};

export default StreamVisualisation;
