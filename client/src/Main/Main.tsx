import { Content } from "antd/es/layout/layout";
import { Col, Input, Layout, Row } from "antd";
import Sider from "antd/es/layout/Sider";
import { ChanelBar } from "../ChanelBar/ChanelBar";
import chanelData from "../mock1";

export const Main = () => {
    return (
        <Row style={{ height: "100vh", width: "100%", marginLeft: "0 !important" }} className="main">

            <Col style={{ backgroundColor: "#535151" }} span={3.5}><ChanelBar></ChanelBar></Col>
            <Col span={16}>qdsdsqdqd</Col>
            <Col style={{ backgroundColor: "grey" }} span={4}>ksqkhjds</Col>
        </Row>
    )
}