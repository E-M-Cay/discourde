import React from "react";
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './Navbar.css';
import { Menu } from 'antd';
import {
    MessageFilled,
  } from '@ant-design/icons';


const Navbar = ({channels, channel, setChannel}) => {
    var p = 0;
    return (
        <div>
        <Menu
            selectedKeys={[channel]}
            mode="inline"
            theme="dark"
        >

            {channels[0] ? channels.map(function (e) {
                return (<Menu.Item onClick={() => {
                            setChannel(e)
                        }} id={e} key={e} icon={<MessageFilled />}>
                            {e}
                        </Menu.Item>)
                p++
                }) : ""
            }
        </Menu>
      </div>
    )
}

export default Navbar;