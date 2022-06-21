
import Sider from "antd/lib/layout/Sider";
import React from "react";
import {CustomLimage} from "../CustomLi/CustomLi";
import fake from "../mock";

export const LeftBar= () => {
    for (const prop in fake){
    console.log(`${prop}: ${fake[prop].first_name}`);
    }
    return (
        <Sider  className="site-layout-background">

            <div className={"scrollIssue"} style={{ height: '100vh', borderRight: 0, padding: 0, width: "70px", display: "flex", justifyContent: "center", flexWrap: "wrap", overflowY: "scroll"  }}>
                {
                    fake.map((object: any, i: any) => <CustomLimage obj={object} key={i} />)
                }
            </div>
        </Sider>
    )
}