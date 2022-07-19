import { Collapse, Typography } from "antd";

import React from "react";
import { CustomImage } from "../CustomLi/CustomLi";
import fake from "../mock";
const { Title } = Typography;
const { Panel } = Collapse;

export const StatusBar = () => {
  return (
    <div
      className={"scrollIssue"}
      style={{
        height: "100vh",
        borderRight: 0,
        padding: 0,
        overflowY: "scroll",
      }}
    >
      <Collapse defaultActiveKey={["1", "2"]} ghost>
        <Panel key="1" header="en ligne" style={{ margin: "0 !important" }}>
          {fake.map((object: any, i: any) =>
            object.status ? (
              <div
                
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  maxWidth: "300px",
                }}
                className="hoStat"
              >
                {" "}
                <CustomImage obj={object} key={i} />{" "}
                <Typography style={{ width: "100%", paddingLeft: "30px", fontWeight: "bold", color: "#A1A1A1" }}>
                  {object.first_name}
                </Typography>{" "}
              </div>
            ) : (
              ""
            )
          )}
        </Panel>
        <Panel key="2" header="hors ligne" style={{ margin: "0 !important" }}>
          {fake.map((object: any, i: any) =>
            !object.status ? (
              <div
                className="hoStat"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  maxWidth: "300px",
                }}
              >
                <CustomImage obj={object} key={i} />{" "}
                <Typography style={{ width: "100%", height: "100%", paddingLeft: "30px", fontWeight: "bold", color: "#A1A1A1" }}>
                  {object.first_name}
                </Typography>{" "}
              </div>
            ) : (
              ""
            )
          )}
        </Panel>
      </Collapse>
    </div>
  );
};
