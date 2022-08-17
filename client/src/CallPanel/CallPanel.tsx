
import { AudioMutedOutlined, MenuOutlined, PhoneOutlined, SoundOutlined, TeamOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Collapse, Divider, Dropdown, Menu, Skeleton, Space, Tabs, Tooltip, Input, Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import React, { useState } from "react";
import './CallPanel.css';



const { TabPane } = Tabs;
const {Panel} = Collapse;
const { Search } = Input;

let testUsers: Array<any> = [];
testUsers.push({id: 1, nickName: "Nathan"})

export const CallPanel= (serveur: any) => {
    for (const obj in serveur){
        console.table(`${obj} callP : ${serveur[obj].nickname}, ${serveur[obj].email}`);
        }

    return (
        <Layout className="vocStyle">
            <header>
                <SoundOutlined /> Nom du chanel vocal        
                <button>
                    <MenuOutlined id="menu" />
                </button>
            
            </header>
            <Content >
            <p>
            AFFICHAGE DES PARTICIPANTS AVATAR + PSEUDO
            </p>
            </Content>
            <footer>
                <button>
                    <AudioMutedOutlined id="audio" style={{textAlign: 'center'}} />
                </button>
            
                <button>
                    <PhoneOutlined id='phone' />
                </button>
            </footer>
            
            
           

        </Layout>

    )
}