import {
  AudioFilled,
  CustomerServiceFilled,
  PhoneOutlined,
  SettingOutlined,
  WifiOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Dropdown,
  Menu,
  Modal,
  Tooltip,
  Typography,
} from 'antd';
import { useContext, useEffect, useState } from 'react';
import UserProfileSettings from '../Modals/UserProfileSettings';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import {
  setActiveVocalChannel,
  setCameraChat,
  setMe,
  setStatus,
} from '../redux/userSlice';
import { VocalChan } from '../types/types';
import { VocalChannelContext } from './VocalChannel';
import logo from '../assets/discourde.png';
import { socketPort } from '../env/host';
import { PeerSocketContext } from '../context/PeerSocket';

export const ProfileCall = (props: {
  activeServerName?: string;
  vocalChannelList?: VocalChan[];
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { socket } = useContext(PeerSocketContext);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const { activeServerName, vocalChannelList } = props;
  const activeVocalChannel = useAppSelector(
    (state) => state.userReducer.activeVocalChannel
  );
  const dispatch = useAppDispatch();
  const { me, isMute, isMuteAudio } = useAppSelector(
    (state) => state.userReducer
  );
  const { muteSelf, unmuteSelf, muteAudio, unmuteAudio } =
    useContext(VocalChannelContext);

  useEffect(() => {
    const tmp = vocalChannelList?.find((v) => v.id === activeVocalChannel);
    if (tmp && !localStorage.getItem('activeVocalChannel')) {
      localStorage.setItem(
        'activeVocalChannel',
        tmp.name +
          '/' +
          activeServerName?.charAt(0).toUpperCase() +
          activeServerName?.slice(1)
      );
    }
  }, [activeVocalChannel, vocalChannelList, activeServerName]);

  function statusHandler(status: string, inNumber: number) {
    socket.emit(status, me?.id);
    if (me) dispatch(setMe({ ...me, status: inNumber }));
    // console.log('status', status, me, 'me', inNumber, 'tmp');
  }

  const menu = (
    <Menu
      style={{ width: '120px' }}
      className='menu'
      items={[
        {
          key: '1',
          label: <div onClick={() => statusHandler('online', 1)}>En Ligne</div>,
        },
        {
          key: '2',
          label: <div onClick={() => statusHandler('inactif', 2)}>Absent</div>,
        },
        {
          key: '3',
          label: <div onClick={() => statusHandler('dnd', 3)}>Occupé</div>,
        },
        {
          key: '4',
          label: (
            <div onClick={() => statusHandler('invisible', 0)}>Invisible</div>
          ),
        },
      ]}
    />
  );

  const MicrophoneClosedSvg = () => (
    <svg
      onClick={isMute ? unmuteSelf : muteSelf}
      width='1em'
      height='1em'
      fill='currentColor'
      viewBox='0 0 1024 1024'
      style={{ cursor: 'pointer' }}
    >
      <path
        d='M202.096 630.464l80.816-52.816A254.896 254.896 0 0 1 256 464a48 48 0 1 0-96 0l0.016 0.128-0.016 0.24c0 60.192 15.424 116.624 42.096 166.096zM704 302.32V192c0-106.032-85.968-192-192-192S320 85.968 320 192v256c0 32.752 8.24 63.568 22.704 90.544L704 302.32zM952 241.6a24 24 0 0 0-37.12-20.064v-0.016l-0.288 0.176L81.264 767.12a24 24 0 1 0 26.272 40.144v0.016l0.272-0.192L941.12 261.68v-0.016c6.56-4.272 10.88-11.664 10.88-20.064zM701.744 475.824l-240.4 157.2c16.16 4.432 33.088 6.976 50.656 6.976 96.56 0 176.256-71.36 189.744-164.176zM816 416a48 48 0 0 0-48 48c-0.064 129.472-96.288 236.144-221.056 253.264a274.944 274.944 0 0 1-32.944 2.624v0.032c-0.64 0-1.248 0.08-1.888 0.08-47.344 0-91.52-13.056-129.568-35.456l-86.896 56.816a350.4 350.4 0 0 0 168.336 71.04V928H304a48 48 0 1 0 0 96h416a48 48 0 1 0 0-96H560v-115.6c171.632-23.312 304-170.032 304-348.032l-0.016-0.24L864 464a48 48 0 0 0-48-48z'
        fill=''
        p-id='4504'
      ></path>
    </svg>
  );
  const HeadsetClosedSvg = () => (
    <svg
      onClick={isMuteAudio ? unmuteAudio : muteAudio}
      width='1em'
      height='1em'
      fill='currentColor'
      viewBox='0 0 1024 1024'
      style={{ cursor: 'pointer' }}
    >
      <path
        d='M927.3 600.5V491c0-55.7-11-109.8-32.7-160.9-4.1-9.6-8.5-19.1-13.3-28.3-8.7-16.8-31.3-20.3-44.7-6.9-8.7 8.7-10.6 21.9-5 32.8 4.1 7.9 7.9 16 11.4 24.3 18.7 44.1 28.2 90.9 28.2 139v55.8c-4.2-2.4-8.4-4.5-12.8-6.5-9.6-32.2-39.5-55.7-74.7-55.7h-29.2c-43.1 0-78 34.9-78 78v307c0 43.1 34.9 78 78 78h29.2c35.2 0 65.1-23.5 74.7-55.7 26.8-12 50.7-32.7 68.5-59.8 21.9-33.3 33.4-73.4 33.4-116 0.2-42.4-11.3-82.4-33-115.6zM805.8 869.6c0 12.1-9.9 22-22 22h-29.2c-12.1 0-22-9.9-22-22v-307c0-12.1 9.9-22 22-22h29.2c12.1 0 22 9.9 22 22v307z m56-46.1V608.8c26 24.2 42.7 63.8 42.7 107.3s-16.7 83.2-42.7 107.4zM293.5 869.6c0 12.2-9.8 22-22 22 0 0-15.6 0-24.9-0.1-4.3 0-8.4 1.7-11.4 4.7l-21.6 21.6c-8.5 8.5-4.9 23.2 6.7 26.6 7 2.1 14.4 3.2 22 3.2h29.2c43.1 0 78-34.9 78-78v-49c0-14.3-17.2-21.4-27.3-11.3l-24 24c-3 3-4.7 7.1-4.7 11.3v25zM121.7 716.2c0-43.5 16.6-83.1 42.7-107.3v107.6c0 14.3 17.2 21.4 27.3 11.3l24-24c3-3 4.7-7.1 4.7-11.3V562.7c0-12.2 9.8-22 22-22h29.2c12.2 0 22 9.8 22 22v24.6c0 14.3 17.2 21.4 27.3 11.3l24-24c3-3 4.7-7.1 4.7-11.3v-0.6c0-43.1-34.9-78-78-78h-29.2c-35.2 0-65.1 23.5-74.7 55.7-4.3 1.9-8.6 4.1-12.8 6.5V491c0-48.1 9.5-94.9 28.2-139 18.1-42.6 44-81 77-113.9 33-33 71.3-58.9 113.9-77 44.1-18.7 90.9-28.2 139-28.2 48.1 0 94.9 9.5 139 28.2 17.3 7.4 33.9 16 49.7 25.9 11.1 6.9 25.4 5.3 34.6-3.9 12.8-12.8 10.3-34.1-5-43.6-18.1-11.5-37.3-21.5-57.3-30-51.1-21.7-105.2-32.7-160.9-32.7s-109.8 11-160.9 32.7c-49.3 20.9-93.6 50.9-131.6 88.9-38.1 38.1-68 82.4-88.9 131.6-21.8 51.2-32.8 105.3-32.8 161v109.5c-21.7 33.2-33.2 73.2-33.2 115.6 0 24.1 3.7 47.4 10.9 69.2 6.5 19.8 31.7 25.8 46.4 11 7.4-7.4 10.2-18.5 6.9-28.5-5.3-15.9-8.2-33.4-8.2-51.6zM98.7 926.7c-10.9-10.9-10.9-28.7 0-39.6l722-722c10.9-10.9 28.7-10.9 39.6 0 10.9 10.9 10.9 28.7 0 39.6l-722 722c-10.9 11-28.6 11-39.6 0z'
        fill=''
        p-id='13887'
      ></path>
    </svg>
  );
  const HeadsetSvg = () => (
    <svg
      onClick={isMuteAudio ? unmuteAudio : muteAudio}
      width='1em'
      height='1em'
      fill='currentColor'
      viewBox='0 0 1024 1024'
      style={{ cursor: 'pointer' }}
    >
      <path
        d='M927.3 600.5V491c0-55.7-11-109.8-32.7-160.9-20.9-49.3-50.9-93.6-88.9-131.6-38.1-38.1-82.4-68-131.6-88.9C623 87.9 568.9 76.9 513.2 76.9s-109.8 11-160.9 32.7c-49.3 20.9-93.6 50.9-131.6 88.9-38.1 38.1-68 82.4-88.9 131.6-21.9 51.1-32.9 105.2-32.9 160.9v109.5c-21.7 33.2-33.2 73.2-33.2 115.6 0 42.6 11.6 82.7 33.4 116 17.8 27.2 41.7 47.9 68.5 59.8 9.6 32.2 39.5 55.7 74.7 55.7h29.2c43 0 78-35 78-78v-307c0-43-35-78-78-78h-29.2c-35.2 0-65.1 23.5-74.7 55.7-4.3 1.9-8.6 4.1-12.8 6.5V491c0-48.1 9.5-94.9 28.2-139 18.1-42.6 44-81 77-113.9s71.3-58.9 113.9-77c44.1-18.7 90.9-28.2 139-28.2s94.9 9.5 139 28.2c42.6 18.1 81 44 113.9 77 33 33 58.9 71.3 77 113.9 18.7 44.1 28.2 90.9 28.2 139v55.8c-4.2-2.4-8.4-4.6-12.8-6.5-9.6-32.2-39.5-55.7-74.7-55.7h-29.2c-43 0-78 35-78 78v307c0 43 35 78 78 78h29.2c35.2 0 65.1-23.5 74.7-55.7 26.8-12 50.7-32.7 68.5-59.8 21.9-33.3 33.4-73.4 33.4-116 0.4-42.4-11.1-82.3-32.8-115.6z m-706.9-37.8c0-12.1 9.9-22 22-22h29.2c12.1 0 22 9.9 22 22v307c0 12.1-9.9 22-22 22h-29.2c-12.1 0-22-9.9-22-22v-307z m-56 46.1v214.6c-26-24.2-42.7-63.8-42.7-107.3 0.1-43.4 16.7-83.1 42.7-107.3z m641.4 260.8c0 12.1-9.9 22-22 22h-29.2c-12.1 0-22-9.9-22-22v-307c0-12.1 9.9-22 22-22h29.2c12.1 0 22 9.9 22 22v307z m56-46.1V608.8c26 24.2 42.7 63.8 42.7 107.3s-16.6 83.2-42.7 107.4z'
        fill=''
        p-id='15027'
      ></path>
    </svg>
  );

  const returnColor = (status: number) => {
    console.log(status);
    switch (status) {
      case 0:
        return 'grey';
      case 1:
        return 'green';
      case 2:
        return 'yellow';
      case 3:
        return 'red';
      default:
      //console.log('could not read status');
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#292B2F !important',
        height: '19vh',
        width: '100%',
      }}
    >
      <Modal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <UserProfileSettings />
      </Modal>
      <div
        style={{
          marginTop: '14.5%',
          height: '30%',
          width: '100%',
          backgroundColor: '#292B2F',
          borderBottom: '1px solid #33353b',
          visibility: activeVocalChannel ? 'visible' : 'hidden',
        }}
      >
        {activeVocalChannel && (
          <div
            style={{
              color: 'darkgrey',
              height: '100%',
              width: '100%',
              fontSize: '21px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0px 15px',
            }}
          >
            {' '}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Typography.Text
                style={{
                  color: 'green',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                <WifiOutlined style={{ fontSize: '17px' }} /> Voix connectée
              </Typography.Text>
              <Typography.Text
                style={{
                  color: 'darkgrey',
                  fontSize: '13px',
                }}
              >
                {localStorage.getItem('activeVocalChannel')}
              </Typography.Text>
            </div>
            <Tooltip placement='top' title={'raccrochage'}>
              <PhoneOutlined
                onClick={() => {
                  dispatch(setActiveVocalChannel(0));
                  dispatch(setCameraChat(false));

                  localStorage.removeItem('activeVocalChannel');
                }}
              />
            </Tooltip>
          </div>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          backgroundColor: '#292B2F',
          justifyContent: 'space-between',
          height: '30%',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            backgroundColor: '#292B2F',
            justifyContent: 'start',
            height: '100%',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Dropdown overlay={menu} trigger={['click']} placement='top'>
            <Badge
              className='fixStatus badgination'
              dot
              style={{
                backgroundColor: returnColor(Number(me?.status)),
                left: '0px',
              }}
            >
              <Avatar
                className='paddingAvatarFix loreImg'
                size={37}
                style={{ margin: 'auto 10px' }}
                src={me?.picture || logo}
              />
            </Badge>
          </Dropdown>
          <div>
            <Typography
              style={{ color: 'white', fontWeight: '600', fontSize: '16px' }}
            >
              {me?.username.length || 0 > 9
                ? me?.username.slice(0, 8) + '...'
                : me?.username || 'random'}
            </Typography>
            <Typography style={{ color: 'darkgrey', fontSize: '11px' }}>
              #292B2F
            </Typography>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            width: '150px',
            color: 'darkgrey',
            fontSize: '18px',
            marginRight: '10px',
          }}
        >
          <Tooltip placement='top' title={'Micro'}>
            {isMute ? (
              <MicrophoneClosedSvg />
            ) : (
              <AudioFilled
                style={{ color: isMute ? 'red' : '' }}
                onClick={isMute ? unmuteSelf : muteSelf}
              />
            )}
          </Tooltip>
          <Tooltip placement='top' title={'Casque'}>
            {isMuteAudio ? <HeadsetClosedSvg /> : <HeadsetSvg />}
            {/* <CustomerServiceFilled
              style={{ color: isMuteAudio ? 'red' : '' }}
              onClick={isMuteAudio ? unmuteAudio : muteAudio}
            /> */}
          </Tooltip>
          <Tooltip placement='top' title={'Paramètres utilisateur'}>
            <SettingOutlined onClick={() => showModal()} />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
