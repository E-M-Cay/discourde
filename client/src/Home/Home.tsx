import react, { useEffect, useState } from "react";
import { LeftBar } from "../LeftBar/LeftBar";
import { Main } from "../Main/Main";
import { Col, Row } from "antd";
import { ChanelBar } from "../ChanelBar/ChanelBar";
import axios from "axios";

export const Home = () => {
  const [servers, setServers] = useState<string[]>();
  const getServers = () => {
    if (!servers) {
      axios.get("server/list").then((res) => {
        console.log(res);
      });
    }
  };
  useEffect(() => {
    getServers();
  }, []);
  return (
    <Row style={{ backgroundColor: "#353535" }}>
      <Col span={1}>
        <LeftBar />
      </Col>
      <Col span={23}>
        <Main />
      </Col>
    </Row>
  );
};
