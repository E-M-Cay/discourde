import {
  BorderlessTableOutlined,
  SoundOutlined,
  WechatOutlined,
} from '@ant-design/icons';
import { Avatar, Collapse } from 'antd';
import { useContext } from 'react';
import { UserMapsContext } from '../context/UserMapsContext';
import { Channel, VocalChan } from '../types/types';
import logo from '../assets/discourde.png';
import { VocalChannelContext } from '../components/VocalChannel';
import { useAppSelector } from '../redux/hooks';
const { Panel } = Collapse;

export const ChannelCollapse = (props: {
  textChannelList: Channel[];
  vocalChannelList: VocalChan[];
  onTextChannelClick: (id: number) => void;
  onVocalChannelClick: Function;
  activeVocalChannel?: number;
}) => {
  const onChange = (key: any) => {};
  const {
    textChannelList,
    vocalChannelList,
    onTextChannelClick,
    onVocalChannelClick,
    activeVocalChannel,
  } = props;
  const headerTxt: string = 'SALONS TEXTUELS';
  const headerVoc: string = 'SALONS VOCAUX';
  const { serverUserMap } = useContext(UserMapsContext);
  const { displayActiveVocalChannel } = useContext(VocalChannelContext);
  const activeServer = useAppSelector(
    (state) => state.userReducer.activeServer
  );

  return (
    <Collapse
      ghost
      defaultActiveKey={['1', '2']}
      onChange={onChange}
      style={{ backgroundColor: '#2F3136' }}
    >
      <Panel
        className='headerPanel'
        style={{ fontSize: '12px' }}
        header={headerTxt}
        key='1'
      >
        {textChannelList &&
          textChannelList.map((chan) => (
            <li
              key={chan.id}
              onClick={() => onTextChannelClick(chan.id)}
              className='panelContent'
            >
              {' '}
              <BorderlessTableOutlined style={{ marginRight: '5px' }} />{' '}
              {chan.name.length > 15
                ? chan.name.substring(0, 15) + '...'
                : chan.name}
            </li>
          ))}
        {activeServer === 1 && (
          <li
            key={-1}
            onClick={() => onTextChannelClick(-1)}
            className='panelContent'
          >
            {' '}
            <WechatOutlined style={{ marginRight: '5px' }} /> Ai Chat
          </li>
        )}
      </Panel>

      <Panel
        className='headerPanel'
        style={{ fontSize: '12px' }}
        header={headerVoc}
        key='2'
      >
        {vocalChannelList &&
          vocalChannelList.map((chan) =>
            chan.id !== activeVocalChannel ? (
              <li key={chan.id} onClick={() => onVocalChannelClick(chan.id)}>
                {' '}
                <div className='panelContent'>
                  <SoundOutlined style={{ marginRight: '5px' }} />{' '}
                  <span
                    style={{
                      color: activeVocalChannel === chan.id ? 'white' : '',
                    }}
                  >
                    {chan.name}
                  </span>
                </div>
                {/* {activeVocalChannel === chan.id && (
                <>
                  {' '}
                  <BorderlessTableOutlined className='activeChannel' />
                </>
              )} */}
                {chan.users.map((u) => (
                  <div
                    // onClick={() => //console.log(serverUserMap.get(u), 'test')}
                    key={u}
                    style={{ marginTop: '5px', marginLeft: '20px' }}
                    className='panelContentRen'
                  >
                    <Avatar
                      size={27}
                      style={{
                        marginRight: '5px',
                        // marginBottom: '3px',
                        border: '2px solid transparent',
                      }}
                      src={serverUserMap.get(u)?.user.picture ?? logo}
                    />{' '}
                    {serverUserMap.get(u)?.nickname || 'Error retrieving user'}
                  </div>
                ))}
              </li>
            ) : (
              displayActiveVocalChannel(chan)
            )
          )}
      </Panel>
    </Collapse>
  );
};
