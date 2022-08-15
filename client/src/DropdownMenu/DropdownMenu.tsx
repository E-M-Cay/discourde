import { BellOutlined, LogoutOutlined, PlusCircleOutlined, SettingOutlined, TeamOutlined, UserAddOutlined } from "@ant-design/icons";
import { Avatar, Badge, Menu } from "antd";

export const DropdownMenu = (params: {

    showModal2: Function;
showModal3: Function;
showModal: Function;
deleteServer: Function;
}) =>{ 
    const {
        showModal2,
        showModal3,
        showModal,
        deleteServer,
    } = params;
    return (
    <Menu
      className="menu"
      items={[
        {
          label: (
            <li style={{ color: "white" }} key={0} onClick={() => showModal2()}>
              <UserAddOutlined
                style={{
                  color: "darkgrey",
                  fontSize: "small",
                }}
              />{" "}
              Inviter des gens{" "}
            </li>
          ),
          key: "0",
        },
        {
          label: (
            <li style={{ color: "white" }} key={1}>
              <TeamOutlined
                style={{
                  color: "darkgrey",
                  fontSize: "small",
                }}
              />{" "}
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
            <li style={{ color: "white" }} onClick={() => showModal3()} key={2}>
              <SettingOutlined
                style={{
                  color: "darkgrey",
                  fontSize: "small",
                }}
              />{" "}
              Paramètres du serveur{" "}
            </li>
          ),
          key: "2",
        },
        {
          label: (
            <li style={{ color: "white" }} key={3} onClick={() => showModal()}>
              <PlusCircleOutlined
                style={{
                  color: "darkgrey",
                  fontSize: "small",
                }}
              />{" "}
              Créer un salon{" "}
            </li>
          ),
          key: "3",
        },
        {
          label: (
            <li
              style={{ color: "white" }}
              key={4}
              onClick={() => deleteServer()}
            >
              <PlusCircleOutlined
                style={{
                  color: "darkgrey",
                  fontSize: "small",
                }}
              />{" "}
              Supprimer serveur{" "}
            </li>
          ),
          key: "4",
        },
        {
          type: "divider",
        },
        {
          label: (
            <li style={{ color: "white" }} key={5}>
              <BellOutlined
                style={{
                  color: "darkgrey",
                  fontSize: "small",
                }}
              />{" "}
              Notifications{" "}

            </li>
          ),
          key: "5",
        },
        {
          type: "divider",
        },
        {
          label: (
            <a style={{ color: "white" }} href="">
              <LogoutOutlined
                style={{
                  color: "red",
                  fontSize: "small",
                }}
              />{" "}
              Quitter le serveur{" "}
            </a>
          ),
          key: "6",
        },
      ]}
    />
  );}