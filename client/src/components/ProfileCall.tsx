import {
  AudioFilled,
  AudioOutlined,
  CustomerServiceFilled,
  CustomerServiceOutlined,
  SettingFilled,
  SettingOutlined,
} from '@ant-design/icons';
import { Avatar, Tooltip, Typography } from 'antd';
import { useAppSelector } from '../redux/hooks';
import { setActiveVocalChannel } from '../redux/userSlice';

export const ProfileCall = () => {
  const activeVocalChannel = useAppSelector(
    (state) => state.userReducer.activeVocalChannel
  );
  const me = useAppSelector((state) => state.userReducer.me);
  return (
    <div
      style={{
        backgroundColor: '#292B2F !important',
        height: '19vh',
        width: '100%',
      }}
    >
      <div style={{ height: '47%' }}>{activeVocalChannel && <div></div>}</div>
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
            src={
              me?.picture || 'https://randomuser.me/api/portraits/women/1.jpg'
            }
          />
          <div>
            <Typography
              style={{ color: 'white', fontWeight: '600', fontSize: '16px' }}
            >
              {me?.username || 'random'}
            </Typography>
            <Typography style={{ color: 'lightgrey', fontSize: '11px' }}>
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
            fontSize: '21px',
            marginRight: '10px',
          }}
        >
          <Tooltip placement='top' title={'Micro'}>
            <AudioFilled />
          </Tooltip>
          <Tooltip placement='top' title={'Casque'}>
            <CustomerServiceFilled />
          </Tooltip>
          <Tooltip placement='top' title={'Paramètres utilisateur'}>
            <SettingOutlined />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
