import { BorderlessTableOutlined, SoundOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import { useContext } from 'react';
import { UserMapsContext } from '../context/UserMapsContext';
import { Channel, VocalChan } from '../types/types';
const { Panel } = Collapse;

export const ChannelCollapse = (props: {
    textChannelList: Channel[];
    vocalChannelList: VocalChan[];
    onTextChannelClick: Function;
    onVocalChannelClick: Function;
    activeVocalChannel: number | undefined;
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

    return (
        <Collapse
            ghost
            defaultActiveKey={['1', '2']}
            onChange={onChange}
            style={{ backgroundColor: '#1F1F1F' }}>
            <Panel className='headerPanel' header={headerTxt} key='1'>
                {textChannelList &&
                    textChannelList.map((chan) => (
                        <li
                            key={chan.id}
                            onClick={() => onTextChannelClick(chan.id)}
                            className='panelContent'>
                            {' '}
                            <BorderlessTableOutlined /> {chan.name}
                        </li>
                    ))}
            </Panel>

            <Panel className='headerPanel' header={headerVoc} key='2'>
                {vocalChannelList &&
                    vocalChannelList.map((chan) => (
                        <li
                            key={chan.id}
                            onClick={() => onVocalChannelClick(chan.id)}
                            className='panelContent'>
                            {' '}
                            <SoundOutlined /> {chan.name}
                            {activeVocalChannel === chan.id && (
                                <>
                                    <br />
                                    <BorderlessTableOutlined className='activeChannel' />
                                </>
                            )}
                            {chan.users.map((u) => (
                                <div key={u}>
                                    {serverUserMap.get(u)?.nickname ||
                                        'Error retrieving user'}
                                </div>
                            ))}
                        </li>
                    ))}
            </Panel>
        </Collapse>
    );
};