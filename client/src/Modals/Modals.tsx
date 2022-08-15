import { Button, Checkbox, Input, Modal, Typography } from "antd";
import { Channel, VocalChan } from "../types/types";

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
  return (
    <Modal
      visible={isModalVisibleInvitation}
      onOk={() => handleOk2()}
      onCancel={() => handleCancel2()}
      style={{ backgroundColor: "#1F1F1F" }}
      closable={false}
      footer={null}
    >
      <Button onClick={(e) => handleLinkCreation()}>créer lien</Button>
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
          onChange={(e) => setNewTextChannelName("teste")}
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
          onChange={(e) => setNewTextChannelName("vocal")}
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
