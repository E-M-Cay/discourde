
import { AudioMutedOutlined, AudioOutlined, BellOutlined, BorderlessTableOutlined, CloseCircleOutlined, CloseOutlined, CustomerServiceOutlined, DownOutlined, LogoutOutlined, MenuOutlined, MessageOutlined, PlusCircleOutlined, SettingOutlined, SoundOutlined, TeamOutlined, UserAddOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Collapse, Divider, Dropdown, Menu, Skeleton, Space, Tabs, Tooltip } from "antd";
import Sider from "antd/lib/layout/Sider";
import React, { useState } from "react";
import friendsData from "../mockFriends";
import './FriendPanel.css';



const { TabPane } = Tabs;
const {Panel} = Collapse;


export const FriendPanel= (serveur: any) => {
    for (const obj in serveur){
        console.table(`${obj} pipi : ${serveur[obj].nickname}, ${serveur[obj].email}`);
        }
        const gayList: Array <any> = [];
        
        let arthur: string = "Arthur";
        gayList.push(arthur);
        console.log("List des omo : " + gayList);

        const onlineUsers: Array <any> = [];
        const onRequestUsers: Array <any> = [];
        const allFriends: Array <any> = [];

        for (let index = 0; index < friendsData.length; index++) {
            if(friendsData[index].onRequest == true) {
                const onRequestUser = friendsData[index].nickname;   
                onRequestUsers.push(onRequestUser);
                
            } else if(!friendsData[index].onRequest && friendsData[index].onLine) {
                const onLineUser = friendsData[index].nickname; 
                onlineUsers.push(onLineUser);
            } else if(!friendsData[index].onRequest) {
                const useer = friendsData[index].nickname; 
                allFriends.push(useer);
            }
        } 

        const onChange = (key: any) => {
            console.log(key);
          };
          const onClick = (e: any) => {
            console.log('click ', e);
          }

    return (
                  
        <Tabs onChange={onChange} type="card">
            <TabPane tab="En ligne" key="1" className={"scrollIssue"}>
                <a>
                    {onlineUsers.map((nickname) => <li onClick={onClick} className="panelContent">  {nickname} <a href=""><MessageOutlined className="iconChan" /></a> <a href=""><MenuOutlined className="iconChan"/></a></li> )}
                </a>
            </TabPane>
            <TabPane tab="Tous" key="2" className={"scrollIssue"}>
                <a>
                    {allFriends.map((nickname) => <li onClick={onClick} className="panelContent">  {nickname} <a href=""><MessageOutlined className="iconChan" /></a>  <a href=""><MenuOutlined className="iconChan"/></a></li> )}
                </a>
            </TabPane>
            <TabPane tab="En attente" key="3" className={"scrollIssue"}>
                <a>
                    {onRequestUsers.map((nickname) => <li onClick={onClick} className="panelContent">  {nickname} <a href=""><CloseCircleOutlined className="iconChan" style={{ textAlign: "right" }}/></a>  </li> )}
                </a>
            </TabPane>
            <TabPane tab="Ajouter un ami" key="4">
                Ajout amis
            </TabPane>
        </Tabs>


    )
}