import {Image, Typography, Tooltip} from 'antd';
import React from 'react';
import {useState} from "react";

export const CustomLimage = ({obj}: any) => {
    const [isFocused, setFocus] = useState(false);
    return (
        <Tooltip placement="left" title={obj.first_name}>
            <img
                onMouseEnter={() => setFocus(true)}
                onMouseLeave={() => setFocus(false)}
                className={"imgS"} style={{margin: "5px auto", width: "auto", backgroundColor: isFocused ? "#4b4b4b" : "#353535", borderRadius: "30px", cursor: "pointer"}} src={obj.img} />
        </Tooltip>


    )
}
