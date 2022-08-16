import { Avatar, Badge, notification } from "antd";
import { useState } from "react";

export const NotificationsComponent = () => {
    const [showNotification, setShowNotification] = useState(false);
  // create false value array [{ title: any; content: any }]
  const notifications: any = [
    { title: "fsdfsfdsf", content: "fsdfsdfsdfsdfsdfsdfdsfs" },
    { title: "fsdfsfdsf", content: "fsdfsdfsdfsdfsdfsdfdsfs" },
    { title: "fsdfsfdsf", content: "fsdfsdfsdfsdfsdfsdfdsfs" },
  ];
  return (
    <div>
        <div onClick={() => setShowNotification(true)} >
        <Badge count={5}>
      <Avatar shape="square" size="large">Notification</Avatar>
    </Badge></div>
    {showNotification ? (
      notifications.map((notification: any, index: number) => (
        <div key={index}>
          <h2>{notification.title}</h2>
          <p>{notification.content}</p>
        </div>
      ))): null}
    </div>
  );
};
