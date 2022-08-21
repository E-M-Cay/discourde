import {
  AudioFilled,
  AudioOutlined,
  CustomerServiceFilled,
  CustomerServiceOutlined,
  PhoneFilled,
  PhoneOutlined,
  SettingFilled,
  SettingOutlined,
} from '@ant-design/icons';
import { Avatar, Tooltip, Typography } from 'antd';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { setActiveVocalChannel } from '../redux/userSlice';

export const ProfileCall = () => {
  const activeVocalChannel = useAppSelector(
    (state) => state.userReducer.activeVocalChannel
  );
  const dispatch = useAppDispatch();
  const me = useAppSelector((state) => state.userReducer.me);
  return (
    <div
      style={{
        backgroundColor: '#292B2F !important',
        height: '19vh',
        width: '100%',
      }}
    >
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
            <Typography.Text
              style={{
                color: 'darkgrey',
                fontSize: '21px',
              }}
            >
              Connecté à {activeVocalChannel}
            </Typography.Text>
            <Tooltip placement='top' title={'raccrochage'}>
              <PhoneOutlined
                onClick={() => dispatch(setActiveVocalChannel(0))}
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
