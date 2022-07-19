import { Content } from "antd/es/layout/layout";
import { Col, Input, Layout, Row } from "antd";
import Sider from "antd/es/layout/Sider";
import {StatusBar} from "../statusBar/StatusBar"
import Chat from "../Chat/Chat";
import { ChanelBar } from "../ChanelBar/ChanelBar";
import chanelData from "../mock1";
import { FriendPanel } from "../FriendPanel/FriendPanel";

export const Main = () => {
    return (
        <Row style={{ height: "100vh", width: "100%", marginLeft: "0 !important" }} className="main">

            <Col style={{ backgroundColor: "#535151" }} span={3.5}><ChanelBar></ChanelBar></Col>
            <Col span={16}><Chat /></Col>
            <Col style={{ backgroundColor: "grey" }} span={4}><StatusBar /></Col>
        </Row>
    )
}