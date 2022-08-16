import { Avatar, Button, Checkbox, Input, Modal, Typography } from "antd";
import axios from "axios";
import { useContext } from "react";
import { UserMapsContext } from "../context/UserMapsContext";
import { useAppSelector } from "../redux/hooks";
import { Channel, User, VocalChan } from "../types/types";
import logo from "../assets/discourde.png";

export const ServerParams = (props: {
  isModalVisibleParams: boolean;
  handleOk3: Function;
  handleCancel3: Function;
  textChannelList: Channel[];
  vocalChannelList: VocalChan[];
  isModify: number;
  newTextChannelName: string;
  setModifingChannel: Function;
  handleUpdateChannel: Function;
  modifingChannel: any;
  setIsModify: Function;
  handleModifyChannelText: Function;
  isModifyVoc: number;
  setIsModifyVoc: Function;
  handleModifyChannelVoc: Function;
}) => {
  const {
    isModalVisibleParams,
    handleOk3,
    handleCancel3,
    textChannelList,
    isModify,
    newTextChannelName,
    setModifingChannel,
    handleUpdateChannel,
    modifingChannel,
    setIsModify,
    handleModifyChannelText,
    vocalChannelList,
    isModifyVoc,
    setIsModifyVoc,
    handleModifyChannelVoc,
  } = props;
  return (
    <Modal
      visible={isModalVisibleParams}
      onOk={() => handleOk3()}
      onCancel={() => handleCancel3()}
      closable={false}
      footer={null}
    >
      <Typography.Title level={4}>Paramètres du serveur</Typography.Title>
      <Typography.Title level={5}>Channel Textuel</Typography.Title>
      {textChannelList.map((channel: any) =>
        isModify === channel.id ? (
          <div>
            <Input
              placeholder="Nom du salon"
              defaultValue={newTextChannelName}
              onChange={(e) =>
                setModifingChannel((prev: any) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
            <Button
              type="primary"
              onClick={() => handleUpdateChannel(modifingChannel, undefined)}
            >
              Modifier
            </Button>
            <Button type="primary" onClick={() => setIsModify(0)}>
              Annuler
            </Button>
          </div>
        ) : (
          <div
            key={channel.id}
            onClick={() => handleModifyChannelText(channel)}
          >
            <div>
              <span>{channel.name}</span>
              <span>{channel.hidden ? "Caché" : "Public"}</span>
            </div>
            <div></div>
          </div>
        )
      )}
      <Typography.Title level={5}>Channel Audio</Typography.Title>
      {vocalChannelList.map((channel: any) =>
        isModifyVoc === channel.id ? (
          <div>
            <Input
              placeholder="Nom du salon"
              defaultValue={channel.name}
              onChange={(e) =>
                setModifingChannel((prev: any) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
            <Button
              type="primary"
              onClick={() => handleUpdateChannel(undefined, modifingChannel)}
            >
              Modifier
            </Button>
            <Button type="primary" onClick={() => setIsModifyVoc(0)}>
              Annuler
            </Button>
          </div>
        ) : (
          <div key={channel.id} onClick={() => handleModifyChannelVoc(channel)}>
            <div>
              <span>{channel.name}</span>
              <span>{channel.hidden ? "Caché" : "Public"}</span>
            </div>
            <div></div>
          </div>
        )
      )}
    </Modal>
  );
};

export const ServerInvit = (props: {
  isModalVisibleInvitation: boolean;
  handleOk2: Function;
  handleCancel2: Function;
  handleLinkCreation: Function;
}) => {
  const {
    isModalVisibleInvitation,
    handleOk2,
    handleCancel2,
    handleLinkCreation,
  } = props;
  const { friendMap } = useContext(UserMapsContext);
  return (
    <Modal
      visible={isModalVisibleInvitation}
      onOk={() => handleOk2()}
      onCancel={() => handleCancel2()}
      
      closable={false}
      footer={null}
    >
      <div style={{ minHeight: "500px" }} >
      <Button onClick={(e) => handleLinkCreation()}>créer lien</Button>
      <>
        <Typography.Title level={4}>Inviter un ami</Typography.Title>
        {Array.from(friendMap.entries()).map(([id, friendShip]) => {
          return (
          <div key={id}>  
            <Avatar src={friendShip.friend.picture ?? logo} />
            <span>{friendShip.friend.username}</span>
            <Button type="primary">Inviter</Button>
          </div>
          );
        }
        )}
      </></div>
    </Modal>
  );
};
export const ServerChannels = (props: {
  isModalVisible: boolean;
  handleOk: Function;
  handleCancel: Function;
  setNewTextChannelName: Function;
  setIsAdminChannel: Function;
  handleCreateChannel: Function;
}) => {
  const {
    isModalVisible,
    handleOk,
    handleCancel,
    setNewTextChannelName,
    setIsAdminChannel,
    handleCreateChannel,
  } = props;
  return (
    <Modal
      visible={isModalVisible}
      onOk={() => handleOk()}
      onCancel={() => handleCancel()}
      style={{ backgroundColor: "#1F1F1F" }}
      closable={false}
      footer={null}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Input
          placeholder="Add text channel"
          onChange={(e) => setNewTextChannelName(e.target.value)}
        />
        <Checkbox onChange={(e) => setIsAdminChannel(e.target.checked)}>
          isAdmin
        </Checkbox>
        <Button type="primary" onClick={() => handleCreateChannel(false)}>
          Create
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Input
          onChange={(e) => setNewTextChannelName(e.target.value)}
          placeholder="Add vocal channel"
        />
        <Checkbox onChange={(e) => setIsAdminChannel(e.target.checked)}>
          isAdmin
        </Checkbox>{" "}
        <Button type="primary" onClick={() => handleCreateChannel(true)}>
          Create
        </Button>
      </div>
    </Modal>
  );
};

export const UserProfileModal = (props: {
  openPrivateChat: Function;
  user: User;
}) => {
  const { openPrivateChat, user } = props;
  const { Title } = Typography;

  const maybeSendFriendRequest = (id: number) => {
    axios.post(
      `/friends/send_request`,
      {
        user: id,
      },
      {
        headers: {
          access_token: localStorage.getItem("token") as string,
        },
      }
    );
  };
  const me = useAppSelector((state) => state.userReducer.me);
  const { friendMap } = useContext(UserMapsContext);
  const isFriend = friendMap.has(user.id);
  console.log(user);
  return (
    <div style={{ minHeight: "500px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Avatar size={64} src={user.picture ?? logo} />
        <Title level={2}>{" " + user.username}</Title>
        <div></div>
      </div>
      <div style={{ marginTop: "24px" }}>
        {isFriend === false && me?.id !== user.id ? (
          <Button onClick={() => maybeSendFriendRequest(user.id)}>
            Add as friend
          </Button>
        ) : me?.id !== user.id ? (
          <Typography>You are friends</Typography>
        ) : null}
        <br />
        {me?.id !== user.id && (
          <Button onClick={() => openPrivateChat(user)}>Message</Button>
        )}
      </div>
    </div>
  );
};
