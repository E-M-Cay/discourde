import react from "react";
import {LeftBar} from "../LeftBar/LeftBar";
import {Main} from "../Main/Main";
import {Col, Row} from "antd";

export const Home = () => {
    return (
        <Row>
            <Col span={1}><LeftBar /></Col>
            <Col span={23}><Main /></Col>
        </Row>
    )
}