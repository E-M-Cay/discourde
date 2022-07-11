import {Content} from "antd/es/layout/layout";
import {Col, Input, Layout, Row} from "antd";
import Sider from "antd/es/layout/Sider";
import {StatusBar} from "../statusBar/StatusBar"
import Chat from "../Chat/Chat";

export const Main = () => {
    return (
        <Row style={{height: "100vh",width: "100%", marginLeft: "0 !important"}} className="main">
        
        <Col style={{backgroundColor: "grey", minWidth: "13vw"}} flex={6}>hjqdshjld</Col>
        <Col flex={30}><Chat /></Col>
        <Col style={{backgroundColor: "rgb(53, 53, 53)", maxWidth: "250px"}} flex={6} ><StatusBar /></Col>
        </Row>
    )
}