import { Image, Typography, Tooltip } from "antd";
import React from "react";
import { useState } from "react";

export const CustomLimage = ({ obj }: any) => {
  const [isFocused, setFocus] = useState(false);
  return (
    <Tooltip
      mouseLeaveDelay={0.3}
      placement="left"
      style={{ fontSize: "32px" }}
      title={obj.first_name}
    >
      <img
        alt={obj.first_name}
        onMouseEnter={() => setFocus(true)}
        onMouseLeave={() => setFocus(false)}
        className={"imgS"}
        style={{
          margin: "5px auto",
          width: "auto",
          backgroundColor: isFocused ? "#4b4b4b" : "#353535",
          borderRadius: "30px",
          cursor: "pointer",
        }}
        src={obj.img}
      />
    </Tooltip>
  );
};
export const CustomImage = ({ obj }: any) => {
  console.log(obj);
  const [isFocused, setFocus] = useState(false);
  return (
    <img
      alt={obj.first_name}
      onMouseEnter={() => setFocus(true)}
      onMouseLeave={() => setFocus(false)}
      className={"imgS2"}
      style={{
        margin: "5px auto",
        width: "auto",
        backgroundColor: "#4b4b4b",
        borderRadius: "30px",
        cursor: "pointer",
      }}
      src={obj.img}
    />
  );
};
export const CustomImageMess = ({ obj }: any) => {
  console.log(obj);
  const [isFocused, setFocus] = useState(false);
  return (
    <img
      alt={obj.first_name}
      onMouseEnter={() => setFocus(true)}
      onMouseLeave={() => setFocus(false)}
      style={{
        backgroundColor: "#535353",
        margin: "5px auto",
        width: "auto",
        borderRadius: "22px",
        cursor: "pointer",
        height: "45px",
        marginRight: "17px",
        marginLeft: "10px",
      }}
      src={obj.photo}
    />
  );
};
