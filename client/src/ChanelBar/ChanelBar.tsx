import {
  AudioMutedOutlined,
  AudioOutlined,
  BellOutlined,
  BorderlessTableOutlined,
  CloseOutlined,
  CustomerServiceOutlined,
  DownOutlined,
  LogoutOutlined,
  PlusCircleOutlined,
  SettingOutlined,
  SoundOutlined,
  TeamOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Collapse,
  Divider,
  Dropdown,
  Menu,
  Skeleton,
  Space,
  Tooltip,
  Modal,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Sider from "antd/lib/layout/Sider";
import React, { useCallback, useContext, useEffect, useState } from "react";
//import chanelData from '../mock1';
import "./ChanelBar.css";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setActiveChannel, setActiveVocalChannel } from "../redux/userSlice";
import { act } from "react-dom/test-utils";
import { PeerSocketContext } from "../context/PeerSocket";

const { Panel } = Collapse;

export const ChanelBar = () => {
  const activeServer = useAppSelector(
    (state) => state.userReducer.activeServer
  );
  const activeChannel = useAppSelector(
    (state) => state.userReducer.activeChannel
  );
  const { peer, socket } = useContext(PeerSocketContext);
  const dispatch = useAppDispatch();
  const headerTxt: string = "SALONS TEXTUELS";
  const headerVoc: string = "SALONS VOCAUX";
  const serverName: string = "TEEEST SERVEUR";
  const [vocalChannelList, setVocalChannelList] = useState<Channel[]>();
  const [textChannelList, setTextChannelList] = useState<Channel[]>();
  const activeVocalChannel = useAppSelector(
    (state) => state.userReducer.activeVocalChannel
  );

  let micro: boolean = true;

  interface Channel {
    hidden: boolean;
    id: number;
    name: string;
    is_audio: boolean;
  }

  useEffect(() => {
    if (activeServer)
      axios
        .get(`/channel/list/${activeServer}`, {
          headers: {
            access_token: localStorage.getItem("token") as string,
          },
        })
        .then((res) => {
          setVocalChannelList(res.data.vocal);
          setTextChannelList(res.data.text);
          console.log(res.data.text[0]);
          dispatch(setActiveChannel(res.data.text[0].id));
        });
  }, [activeServer]);

  const onChange = (key: any) => {};
  const onTextChannelClick = (id: number) => {
    dispatch(setActiveChannel(id));
  };
  const onVocalChannelClick = useCallback(
    (id: number) => {
      console.log(id, activeVocalChannel);
      if (activeVocalChannel === id) return;
      dispatch(setActiveVocalChannel(id));
      socket?.emit("joinvocalchannel", id);
    },
    [socket, activeVocalChannel]
  );

  const [stateMic, setmicState] = useState(true);
  const [stateHead, setheadState] = useState(true);
  const [stateMenu, setmenuState] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFocused, setFocus] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [serverId, setServerId] = useState(0);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const createChannel = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("bhfdksdklf");
    e.preventDefault();
    axios
      .post(
        "channel/create",
        { name: channelName, server_id: activeServer },
        {
          headers: {
            access_token: localStorage.getItem("token") as string,
          },
        }
      )
      .then((res) => {
        console.log(res, "gdhdhdhdg");
        setIsModalVisible(false);
      });
  };

  //get User id from dispach
  const userId = useAppSelector((state) => state.userReducer.user_id);

  //function joinChannel with axios request
  const joinServer = () => {
    axios
      .post(
        "/server/add_user",
        { server_id: serverId, id: userId },
        {
          headers: {
            access_token: localStorage.getItem("token") as string,
          },
        }
      )
      .then((res) => {
        console.log(res, "gdhdhdhdg");
        // dispatch(setActiveChannel(id));
      });
  };

  const deleteServer = useCallback(() => {
    axios.delete(`/server/delete_server/${activeServer}`, {
      headers: { access_token: localStorage.getItem("token") as string },
    });
  }, [activeServer]);

  const menu = (
    <Menu
      className="menu"
      items={[
        {
          label: (
            <li>
              <UserAddOutlined
                style={{ color: "darkgrey", fontSize: "small" }}
              />{" "}
              Inviter des gens{" "}
            </li>
          ),
          key: "0",
        },
        {
          label: (
            <li>
              <TeamOutlined style={{ color: "darkgrey", fontSize: "small" }} />{" "}
              Gestion des membres{" "}
            </li>
          ),
          key: "1",
        },
        {
          type: "divider",
        },
        {
          label: (
            <li>
              <SettingOutlined
                style={{ color: "darkgrey", fontSize: "small" }}
              />{" "}
              Paramètres du serveur{" "}
            </li>
          ),
          key: "3",
        },
        {
          label: (
            <li onClick={showModal}>
              <PlusCircleOutlined
                style={{ color: "darkgrey", fontSize: "small" }}
              />{" "}
              Créer un salon{" "}
            </li>
          ),
          key: "4",
        },
        {
          label: (
            <li onClick={() => deleteServer()}>
              <PlusCircleOutlined
                style={{ color: "darkgrey", fontSize: "small" }}
              />{" "}
              Supprimer serveur{" "}
            </li>
          ),
          key: "5",
        },
        {
          type: "divider",
        },
        {
          label: (
            <li>
              <BellOutlined style={{ color: "darkgrey", fontSize: "small" }} />{" "}
              Notifications{" "}
            </li>
          ),
          key: "6",
        },
        {
          type: "divider",
        },
        {
          label: (
            <a href="">
              <LogoutOutlined style={{ color: "red", fontSize: "small" }} />{" "}
              Quitter le serveur{" "}
            </a>
          ),
          key: "7",
        },
      ]}
    />
  );

  return (
    <div
      style={{ width: "100%", backgroundColor: "#1F1F1F" }}
      className="site-layout-background"
    >
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <form onSubmit={(e) => createChannel(e)}>
          <input
            type="text"
            defaultValue={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="Enter channel name"
          />
          <input type="submit" value="Create" />
        </form>
        <form onSubmit={(e) => joinServer()}>
          <input
            type="number"
            defaultValue={channelName}
            onChange={(e) => setServerId(+e.target.value)}
            placeholder="Enter server id"
          />
          <input type="submit" value="Create" />
        </form>
      </Modal>

      <Dropdown overlay={menu} trigger={["click"]}>
        <ul onClick={(e) => e.preventDefault()}>
          <Space>
            <p className="serverName">
              {serverName}
              <a onClick={() => setmenuState(!stateMenu)}>
                {stateMenu ? (
                  <DownOutlined className="menuIcon" />
                ) : (
                  <CloseOutlined className="menuIcon" />
                )}
              </a>
            </p>
          </Space>
        </ul>
      </Dropdown>

      <div
        className={"scrollIssue"}
        style={{
          height: "81vh",
          width: "100%",
          borderRight: 0,
          padding: 0,
          flexWrap: "wrap",
          overflowY: "scroll",
        }}
      >
        <Collapse
          ghost
          defaultActiveKey={["1", "2"]}
          onChange={onChange}
          style={{ backgroundColor: "#1F1F1F" }}
        >
          <Panel className="headerPanel" header={headerTxt} key="1">
            {textChannelList &&
              textChannelList.map((chan) => (
                <li
                  key={chan.id}
                  onClick={() => onTextChannelClick(chan.id)}
                  className="panelContent"
                >
                  {" "}
                  <BorderlessTableOutlined /> {chan.name}
                </li>
              ))}
          </Panel>

          <Panel className="headerPanel" header={headerVoc} key="2">
            {vocalChannelList &&
              vocalChannelList.map((chan) => (
                <li
                  onClick={() => onVocalChannelClick(chan.id)}
                  className="panelContent"
                >
                  {" "}
                  <SoundOutlined /> {chan.name}
                  {activeVocalChannel === chan.id && (
                    <>
                      <br />
                      <BorderlessTableOutlined className="activeChannel" />
                      {userId}
                    </>
                  )}
                </li>
              ))}
          </Panel>
        </Collapse>
      </div>
      <div style={{ backgroundColor: "#353535" }}>
        <Card
          title="User + avatar"
          extra={
            <a href="#">
              <Tooltip placement="top" title={"Paramètres utilisateur"}>
                <SettingOutlined
                  style={{
                    color: "darkgrey",
                    fontSize: "large",
                  }}
                />
              </Tooltip>
            </a>
          }
          style={{ backgroundColor: "#353535", border: 0 }}
        >
          <Tooltip placement="top" title={"Micro"}>
            <a onClick={() => setmicState(!stateMic)}>
              {stateMic ? (
                <AudioOutlined className="microOn" />
              ) : (
                <AudioMutedOutlined className="microOff" />
              )}
            </a>
          </Tooltip>
          <Tooltip placement="top" title={"Casque"}>
            <a onClick={() => setheadState(!stateHead)}>
              {stateHead ? (
                <CustomerServiceOutlined className="microOn" />
              ) : (
                <CustomerServiceOutlined className="microOff" />
              )}
            </a>
          </Tooltip>
        </Card>
      </div>
    </div>
  );
};
