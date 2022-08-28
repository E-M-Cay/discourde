import { CheckOutlined, CloseOutlined, EditOutlined, RotateLeftOutlined, SettingFilled } from '@ant-design/icons';
import { Modal, Typography, Input, Avatar, Divider, Tabs, Button, Dropdown, Checkbox, Form, Space, Row } from 'antd';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import { Channel, ServerResponse, ServerUser, User, VocalChan } from '../types/types';
import { UserMapsContext } from '../context/UserMapsContext';
import { CustomImage } from '../CustomLi/CustomLi';
import AdminModal from './AdminModal';

const { TabPane } = Tabs;
let listOfRoles: Array<any> = [];
const RoleModal = (props: {
    isModalVisibleRole: boolean;
    userConcern: number;
    setIsRoleModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    servers: ServerResponse[];
}) => {
  const {
    isModalVisibleRole,
    userConcern,
    setIsRoleModalVisible,
    servers,
  } = props;

  const activeServer = useAppSelector(
    (state) => state.userReducer.activeServer
  );

  const [form] = Form.useForm();

  useEffect(() => getRolesByServer())
  useEffect(() => console.log("user : " + userConcern))


  const getRolesByServer = () => {
    console.log("SERVEUR ID GET")
    console.log(activeServer);
      axios
      .get(`/role/list/${activeServer}`, {
       headers: {
         access_token: localStorage.getItem('token') as string,
       },
     })
     .then((res) => {
      console.log("list des roles");
     
      listOfRoles= res.data;

     });  
  }
  const handleRoleOk = () => {
    setIsRoleModalVisible(false);
  };

  const handleRoleCancel = () => {
    setIsRoleModalVisible(false);
  };
  const onValidateForm = (values : any) => {
    console.log(values)
  }
  let tmpCheckedRoles: Array<any> = [];
  let checkedListRoles: Array<any> = [];

  const onChange = (checkedValues: any) => {
    console.log('checked = ', checkedValues);
    tmpCheckedRoles = checkedValues;
  };
  const onValidate = () => {
    checkedListRoles = tmpCheckedRoles;
    console.log(checkedListRoles);
    setIsRoleModalVisible(false);
  }

  return (
    <div>
    <Modal title="Administration des rôles" visible={isModalVisibleRole} onOk={handleRoleOk} onCancel={handleRoleCancel}>
{/*       {listOfRoles.map((role) => (<Checkbox> {role.name} </Checkbox> ) )}
     */}
{/*       <Checkbox.Group options={listOfRoles.map((role) => role.name)} onChange={onChange} />
      <Button onClick={onValidate}> VALIDER </Button> */}
      <Checkbox.Group
        style={{
        width: '100%',
      }}
        onChange={onChange}
      >
        <Row>
        {listOfRoles.map((role) => (<Checkbox value={role.id}> {role.name} </Checkbox> ) )}
        </Row>
      </Checkbox.Group>
       <Button onClick={onValidate}><CheckOutlined style={{color: 'green', fontSize: 'large'}} /></Button>
    </Modal>
    </div>
  );
};

export default RoleModal;


