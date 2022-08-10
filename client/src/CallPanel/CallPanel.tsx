
import { Avatar, Button, Card, Collapse, Divider, Dropdown, Menu, Skeleton, Space, Tabs, Tooltip, Input } from "antd";
import Sider from "antd/lib/layout/Sider";
import React, { useState } from "react";
import './CallPanel.css';



const { TabPane } = Tabs;
const {Panel} = Collapse;
const { Search } = Input;



export const CallPanel= (serveur: any) => {
    for (const obj in serveur){
        console.table(`${obj} pipi : ${serveur[obj].nickname}, ${serveur[obj].email}`);
        }

    return (
        <div>
            
        
        </div>

    )
}