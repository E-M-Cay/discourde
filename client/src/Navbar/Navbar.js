import 'antd/dist/antd.min.css';
import './Navbar.css';
import { Menu } from 'antd';
import { MessageFilled } from '@ant-design/icons';

const Navbar = ({ channels, channel, setChannel }) => {
    return (
        <div>
            <Menu selectedKeys={[channel]} mode='inline' theme='dark'>
                {channels[0]
                    ? channels.map(function (e) {
                          return (
                              <Menu.Item
                                  onClick={() => {
                                      setChannel(e);
                                  }}
                                  id={e}
                                  key={e}
                                  icon={<MessageFilled />}>
                                  {e}
                              </Menu.Item>
                          );
                      })
                    : ''}
            </Menu>
        </div>
    );
};

export default Navbar;
