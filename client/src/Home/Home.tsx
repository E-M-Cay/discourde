import react from "react";
import {LeftBar} from "../LeftBar/LeftBar";
import {Main} from "../Main/Main";
import {Col, Row} from "antd";
import { ChanelBar } from "../ChanelBar/ChanelBar";

export const Home = () => {
    return (
        <Row style={{backgroundColor: "#353535"}} >
            <Col span={1}><LeftBar /></Col>
            <Col span={23}><Main /></Col>
        </Row>
    )
}