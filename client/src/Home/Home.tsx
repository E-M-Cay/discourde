import react, { useEffect, useState } from "react";
import { LeftBar } from "../LeftBar/LeftBar";
import { Main } from "../Main/Main";
import { Col, Row } from "antd";
import { ChanelBar } from "../ChanelBar/ChanelBar";
import axios from "axios";


interface ServerResponse {
  id: number;
  logo: string;
  main_img: string;
  name: string;
}

interface Server {
    id: number;
    logo: string;
    main_img: string;
    name: string;
}

export const Home = () => {
  const [servers, setServers] = useState<ServerResponse[]>([]);
  useEffect(() => {
    getServers();
  }, []);
  const getServers = () => {
    if (servers.length === 0) {
      axios.get("server/list").then((res) => {
        setServers(res.data);
        console.log(res.data, "res.data");
      });
    }
  };
  
  return (
    <Row style={{ backgroundColor: "#353535" }}>
      <Col span={1}>
        <LeftBar setServers={setServers} servers={servers} />
      </Col>
      <Col span={23}>
        <Main />
      </Col>
    </Row>
  );
};
