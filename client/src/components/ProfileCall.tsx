import {
  AudioFilled,
  AudioOutlined,
  CustomerServiceFilled,
  CustomerServiceOutlined,
  PhoneFilled,
  PhoneOutlined,
  SettingFilled,
  SettingOutlined,
  WifiOutlined,
} from '@ant-design/icons';
import { Avatar, Modal, Tooltip, Typography } from 'antd';
import { useContext, useEffect, useState } from 'react';
import UserProfileSettings from '../Modals/UserProfileSettings';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { setActiveVocalChannel } from '../redux/userSlice';
import { VocalChan } from '../types/types';
import { VocalChannelContext } from './VocalChannel';
import logo from '../assets/discourde.png';

export const ProfileCall = (props: {
  activeServerName?: string;
  vocalChannelList?: VocalChan[];
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

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
  const me = useAppSelector((state) => state.userReducer.me);
  const isMute = useAppSelector((state) => state.userReducer.isMute);
  const isMuteAudio = useAppSelector((state) => state.userReducer.isMuteAudio);
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
          <Avatar
            size={37}
            style={{ margin: 'auto 10px' }}
            src={me?.picture || logo}
          />
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
            <AudioFilled
              style={{ color: isMute ? 'red' : '' }}
              onClick={isMute ? unmuteSelf : muteSelf}
            />
          </Tooltip>
          <Tooltip placement='top' title={'Casque'}>
            <CustomerServiceFilled
              style={{ color: isMuteAudio ? 'red' : '' }}
              onClick={isMuteAudio ? unmuteAudio : muteAudio}
            />
          </Tooltip>
          <Tooltip placement='top' title={'Paramètres utilisateur'}>
            <SettingOutlined onClick={() => showModal()} />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};