
import { AudioMutedOutlined, AudioOutlined, BellOutlined, BorderlessTableOutlined, CloseOutlined, CustomerServiceOutlined, DownOutlined, LogoutOutlined, PlusCircleOutlined, SettingOutlined, SoundOutlined, TeamOutlined, UserAddOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Collapse, Divider, Dropdown, Menu, Skeleton, Space, Tooltip, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Sider from "antd/lib/layout/Sider";
import React, { useState } from "react";
import chanelData from "../mock1";
import './ChanelBar.css';
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../redux/hooks";



    const {Panel} = Collapse;

export const ChanelBar= (serveur: any) => {
    for (const obj in serveur){
        console.table(`${obj} pipi : ${serveur[obj].nameChanel}, ${serveur[obj].descriptionChanel}`);
        }
        const txtListChanel: Array <any> = [];
        const vocListChanel: Array <any> = [];
        const headerTxt: string = "SALONS TEXTUELS";
        const headerVoc: string = "SALONS VOCAUX"
        const serverName: string = "TEEEST SERVEUR"
        const activeServer = useAppSelector(state => state.userReducer.activeServer);
        var micro: boolean = true;

        
            for (let index = 0; index < chanelData.length; index++) {
                if(chanelData[index].is_audio == false) {
                    const textualChanel = chanelData[index].nameChanel;   
                    txtListChanel.push(textualChanel);
                    
                } else {
                    const audioChanel = chanelData[index].nameChanel; 
                    vocListChanel.push(audioChanel);
                }
            } 

            const onChange = (key: any) => {
            }
            const onClick = (e: any) => {
              }
            
            const [stateMic, setmicState] = useState(true);
            const [stateHead, setheadState] = useState(true);
            const [stateMenu, setmenuState] = useState(true);
            const [isModalVisible, setIsModalVisible] = useState(false);
            const [isFocused, setFocus] = useState(false);
            const [channelName, setChannelName] = useState("");

            const showModal = () => {
              setIsModalVisible(true);
            };
          
            const handleOk = () => {
              setIsModalVisible(false);
            };
          
            const handleCancel = () => {
              setIsModalVisible(false);
            };

            const createChannel = (e: React.FormEvent<HTMLFormElement>) => {
                console.log("bhfdksdklf")
                e.preventDefault()
                axios.post("channel/create", {name: channelName, server_id: activeServer}, { headers: { access_token:  localStorage.getItem("token") as string },  } ).then((res) => {
                    console.log(res, "gdhdhdhdg");
                    setIsModalVisible(false);
                })
            }

            
            
            const menu = (
            <Menu className="menu"
                items={[
                    {
                      label: <li ><UserAddOutlined style={{ color: "darkgrey", fontSize: "small" }} /> Inviter des gens </li>,
                      key: '0',
                    },
                    {
                      label: <li ><TeamOutlined style={{ color: "darkgrey", fontSize: "small" }} /> Gestion des membres </li>,
                      key: '1',
                    },
                    {
                      type: 'divider',
                    },
                    {
                      label: <li ><SettingOutlined style={{ color: "darkgrey", fontSize: "small" }} /> Paramètres du serveur  </li>,
                      key: '3',
                    },
                    {
                        label: <li onClick={showModal}><PlusCircleOutlined style={{ color: "darkgrey", fontSize: "small" }}  /> Créer un salon  </li>,
                        key: '4',
                    },
                    {
                        type: 'divider',
                    },
                    {
                        label: <li ><BellOutlined style={{ color: "darkgrey", fontSize: "small" }} /> Notifications </li>,
                        key: '5',
                    },
                    {
                        type: 'divider',
                    },
                    {
                        label: <a href=""><LogoutOutlined  style={{ color: "red", fontSize: "small" }} /> Quitter le serveur </a>,
                        key: '6',
                    },
                ]}
            />)

    return (
                
        <div style={{width: "100%", backgroundColor: "#1F1F1F"}} className="site-layout-background">

             <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <form onSubmit={e => createChannel(e)} >
            <input type="text" defaultValue={channelName} onChange={(e) => setChannelName(e.target.value)} placeholder="Enter server name"/>
            <input type="submit" value="Create" />
            </form>
          </Modal>

                <Dropdown  overlay={menu} trigger={['click']}>
                    <ul onClick={(e) => e.preventDefault()} >
                      <Space >
                        <p className="serverName">{serverName}                  
                        <a onClick={() => setmenuState(!stateMenu)}>{stateMenu ? <DownOutlined className="menuIcon" /> : <CloseOutlined className="menuIcon" /> }</a>
                        </p>
                      </Space>
                    </ul> 
                </Dropdown>
                

            <div className={"scrollIssue"} style={{ height: '81vh', width: "100%", borderRight: 0, padding: 0, flexWrap: "wrap", overflowY: "scroll"  }}>
                
            <Collapse ghost defaultActiveKey={['1','2']} onChange={onChange} style={{ backgroundColor: "#1F1F1F" }}>
                
                <Panel className="headerPanel"  header={headerTxt} key="1">
                    {txtListChanel.map((nameChan) => <li onClick={onClick} className="panelContent"> <BorderlessTableOutlined />  {nameChan}</li> )}
                </Panel>
                
                <Panel className="headerPanel" header={headerVoc} key="2">
                    {vocListChanel.map((nameChan) => <li onClick={onClick} className="panelContent"> <SoundOutlined />  {nameChan}</li>)}
                </Panel>

             </Collapse>
             
            </div>
            <div style={{backgroundColor: "#353535"}}>
            <Card title="User + avatar" extra={<a href="#">
                <Tooltip placement="top" title={"Paramètres utilisateur"}><SettingOutlined style={{ color: "darkgrey", fontSize: "large" }} /></Tooltip></a>}style={{backgroundColor: "#353535", border: 0}}  > 
                
                <Tooltip placement="top" title={"Micro"}><a onClick={() => setmicState(!stateMic)}>{stateMic ? <AudioOutlined className="microOn" /> : <AudioMutedOutlined className="microOff" /> }</a></Tooltip>
                <Tooltip placement="top" title={"Casque"}><a onClick={() => setheadState(!stateHead)}>{stateHead ? <CustomerServiceOutlined className="microOn" /> : <CustomerServiceOutlined className="microOff" /> }</a></Tooltip>
             
             </Card>
            </div>
        </div>
    )
}