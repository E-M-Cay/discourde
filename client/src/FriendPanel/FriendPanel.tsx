
import { AudioMutedOutlined, AudioOutlined, BellOutlined, BorderlessTableOutlined, CloseCircleOutlined, CloseOutlined, CustomerServiceOutlined, DownOutlined, LogoutOutlined, MenuOutlined, MessageOutlined, PhoneOutlined, PlusCircleOutlined, SearchOutlined, SettingOutlined, SoundOutlined, TeamOutlined, UserAddOutlined, UserDeleteOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Collapse, Divider, Dropdown, Menu, Skeleton, Space, Tabs, Tooltip, Input } from "antd";
import Sider from "antd/lib/layout/Sider";
import React, { useState } from "react";
import friendsData from "../mockFriends";
import './FriendPanel.css';



const { TabPane } = Tabs;
const {Panel} = Collapse;
const { Search } = Input;



export const FriendPanel= (serveur: any) => {
    for (const obj in serveur){
        console.table(`${obj} pipi : ${serveur[obj].nickname}, ${serveur[obj].email}`);
        }
        const gayList: Array <any> = [];
        
        let gayMaster: string = "Arthur";
        gayList.push(gayMaster);
        console.log("List des homo : " + gayList);

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
            console.log(onlineUsers)
        } 

        const [stateMenu, setmenuState] = useState(true);

        const onChange = (key: any) => {
            console.log(key);
          };
          const onClick = (e: any) => {
            console.log('click ', e);
          }
          const onSearch = (value: any) => console.log(value);


          const menu = (
            <Menu className="menu"
                items={[
                    {
                        label: <li><MessageOutlined style={{ color: "green", fontSize: "small" }}/> Envoyer un message </li>,
                        key: '1',
                    }
                    ,
                    {
                      type: 'divider',
                    },
                    {
                      label: <li><PhoneOutlined style={{ color: "green", fontSize: "small" }}/> Démarrer un appel vocal </li>,
                      key: '2',
                    },
                    {
                      label: <li><VideoCameraOutlined style={{ color: "green", fontSize: "small" }}/> Démarrer un appel vidéo </li>,
                      key: '3',
                    },
                    {
                      type: 'divider',
                    },
                    {
                      label: <li><UserDeleteOutlined style={{ color: "red", fontSize: "small" }}/> Retirer l'ami </li>,
                      key: '4',
                    },
                ]}
            />)


    return (
        <div>
            
                  
        <Tabs onChange={onChange} style={{marginLeft: 10}}>
            <TabPane tab="En ligne" key="1" >
                <p style={{ position: 'fixed', fontSize: 'medium'}}> 
                    EN LIGNE - {onlineUsers.length}
                    </p><br /><br />
                <Search className="searchBar2"
                    placeholder="Rechercher" 
                    enterButton={<SearchOutlined />}
                    size="middle"
                    onSearch={onSearch}
                />
                <br /><br />
                <li className={"scrollIssue"} style={{ height: '73vh', width: "100%", borderRight: 0, padding: 0, flexWrap: "wrap", overflowY: "scroll"}}>
                    {onlineUsers.map((nickname) => <div onClick={onClick} className="panelContent" style={{margin: 0, padding: 0, height: '8vh', fontWeight:'bold'}}>
                        <Divider style={{margin: 0}} /> {nickname} 
                        <div className="iconFriend"> 
                        <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft" className="DropDownFriend">
                                <ul onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <p>
                                            <a style={{ color: '#060606'}}><Tooltip placement="top" title={"Actions"}>  <MenuOutlined />  </Tooltip></a>
                                            <a onClick={() => setmenuState(!stateMenu)}>
                                            </a>
                                        </p>
                                    </Space>
                            </ul>
                            </Dropdown>
                        </div></div>  
                        )}
                </li>
            </TabPane>
            <TabPane tab="Tous" key="2">
                <p style={{position: 'fixed', fontSize: 'medium'}}>
                    TOUS LES AMIS - {allFriends.length}
                </p><br /><br />
                <Search className="searchBar2"
                    placeholder="Rechercher" 
                    enterButton={<SearchOutlined />}
                    size="middle"
                    onSearch={onSearch}
                />
                <br /><br />
                <li className={"scrollIssue"} style={{ height: '73vh', width: "100%", borderRight: 0, padding: 0, flexWrap: "wrap", overflowY: "scroll"}}>
                    {allFriends.map((nickname) => <div onClick={onClick} className="panelContent" style={{margin: 0, padding: 0, height: '8vh', fontWeight:'bold'}}>
                        <Divider style={{margin: 0}} />  {nickname} 
                        <div className="iconFriend"> 
{/*                             <a style={{ color: '#060606'}}><div><Tooltip placement="top" title={"Envoyer un message"}><MessageOutlined /></Tooltip></div></a>
 */}                            <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft" className="DropDownFriend">
                                <ul onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <p>
                                            <a style={{ color: '#060606'}}><Tooltip placement="top" title={"Actions"}>  <MenuOutlined />  </Tooltip></a>
                                            <a onClick={() => setmenuState(!stateMenu)}>
                                            </a>
                                        </p>
                                    </Space>
                            </ul>
                            </Dropdown>
                            </div>
                        </div>  
                    )}
                </li>
            </TabPane>
            <TabPane tab="En attente" key="3">
                <p style={{ position: 'fixed', fontSize: 'medium'}}>
                    EN ATTENTE - {onRequestUsers.length}
                    </p><br /><br />
                <Search className="searchBar2"
                    placeholder="Rechercher" 
                    enterButton={<SearchOutlined />}
                    size="middle"
                    onSearch={onSearch}
                /><br /><br />
                <li className={"scrollIssue"} style={{ height: '73vh', width: "100%", borderRight: 0, padding: 0, flexWrap: "wrap", overflowY: "scroll"}}>
                    {onRequestUsers.map((nickname) => <div onClick={onClick} className="panelContent" style={{margin: 0, padding: 0, height: '8vh', fontWeight:'bold'}}>
                    <Divider style={{margin: 0}} /> 
                    {nickname} 
                    <Tooltip title="Annuler la demande">
                        <Button shape="circle" className="DelFriendBtton" icon={<CloseOutlined />}  danger/>
                    </Tooltip>
                    </div>)}
                    </li>
            </TabPane>
            <TabPane tab="Ajouter un ami" key="4">
            <p style={{ position: 'fixed', fontSize: 'medium'}}> 
                    AJOUTER UN AMI
                </p><br /><br />
                <Search className="searchBar"
                    placeholder="Entrer un pseudo" 
                    enterButton="Envoyer demande" 
                    size="large"
                    onSearch={onSearch}
                />
            </TabPane>
        </Tabs>
        
        </div>

    )
}