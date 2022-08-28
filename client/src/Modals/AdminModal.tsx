import { CheckOutlined, CloseOutlined, EditOutlined, RotateLeftOutlined, SettingFilled } from '@ant-design/icons';
import { Modal, Typography, Input, Avatar, Divider, Tabs, Button, Dropdown, Form, Space, Checkbox, Row } from 'antd';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import { Channel, ServerResponse, ServerUser, User, VocalChan } from '../types/types';
import { UserMapsContext } from '../context/UserMapsContext';
import { CustomImage } from '../CustomLi/CustomLi';
import PermModal from './PermModal';


const { TabPane } = Tabs;
let userConcern: number;

let listOfRoles: Array<any> = [];
const AdminModal = (props: {
    isModalVisibleAdmin: boolean;
    setIsAdminModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    servers: ServerResponse[];
  
}) => {
  const {
    isModalVisibleAdmin,
    setIsAdminModalVisible,
    servers,
  } = props;

  const [form] = Form.useForm();
  const [isModalVisibleRole, setisModalVisibleRole] = useState(false);
  const [isModalVisiblePerm, setisModalVisiblePerm] = useState(false);
  const { serverUserMap } = useContext(UserMapsContext);
  const { me } = useAppSelector((state) => state.userReducer);
  const activeServer = useAppSelector(
    (state) => state.userReducer.activeServer
  );


  let tmpCheckedRoles: Array<any> = [];
  let checkedListRoles: Array<any> = [];
  let rolesAlreadyChecked: Array<any> = [];
  
  useEffect(() => getRolesByServer())
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
      console.log("getRoles");
     
      listOfRoles= res.data;

     });  
  }

let serverId: any = activeServer;
let userId: any = 0;

const showPermModal = () => {
  setisModalVisiblePerm(true);
};



  const showAdminModal = () => {
    setIsAdminModalVisible(true);
  };

  const handleAdminOk = () => {
    setIsAdminModalVisible(false);
  };

  const handleAdminCancel = () => {
    setIsAdminModalVisible(false);
  };
  const onChange = (key: any) => {
    console.log(key);
  };
  

  const kickUser = (user : ServerUser) => {
    console.log("UUSSSER")
    for (const [key, value] of Object.entries(user)) {
        if(typeof value === 'object') {
            for (const [key2, value2] of Object.entries(value)) {
                if(key2 === 'id') {
                    if(userId === 0) {
                        userId = value2;
                    }
                    else { serverId = value2;}
                }
            }
        }
    }
    console.log("serverID" + serverId);
    console.log("userID" + userId);
    
    axios
     .delete(`/server/${serverId}/user/${userId}`, {
      headers: {
        access_token: localStorage.getItem('token') as string,
      },
    }); 
}
const onCreateNewRole = (values: any) => {
  console.log("Id du role : " +  values)
};

const setUserConcern = (selectUser: number) => {

  userConcern = selectUser;
  console.log("UserConcernOnSetUser : " + userConcern)
  getRolesByServeUser();
  showRoleModal(userConcern);
  return selectUser;
}
const getRolesByServeUser = () => {
  axios
  .get(`/role/role_list/${userConcern}`, {
   headers: {
     access_token: localStorage.getItem('token') as string,
   },
 })
 .then((res) => {
  console.log("getRolesByUser");
  console.log(res.data);

  rolesAlreadyChecked= res.data;
  rolesAlreadyChecked = rolesAlreadyChecked.map((role) => role.id);
  console.log("second tableau roles")
  console.log(rolesAlreadyChecked)

 });  
}
const showRoleModal = (idUserConcern: number) => {
  console.log("ID USER DANS ROLE MODAL : " + idUserConcern)
  setisModalVisibleRole(true);
};
const handleRoleOk = () => {
  setisModalVisibleRole(false);
};

const handleRoleCancel = () => {
  setisModalVisibleRole(false);
};


const onChangeR = (checkedValues: any) => {
  console.log('checked = ' + checkedValues);
  console.log("OnConcern - change : " + userConcern)
  tmpCheckedRoles = checkedValues;
  let okTest: number;
  okTest = 1;
};
const onValidateAdmR = () => {
  checkedListRoles = tmpCheckedRoles;
  console.log("Id du user : " + userConcern)
  console.log("Liste des roles : " +  checkedListRoles);

  axios
  .post(`/role/add_role/`, {
        'role_id_list': checkedListRoles,
        'server_user_id': userConcern
  }, {
   headers: {
     access_token: localStorage.getItem('token') as string,
   },
 })

  setisModalVisibleRole(false);
}

  return (
    <div>
    <Modal title="Gestion des membres" visible={isModalVisibleAdmin} onOk={handleAdminOk} onCancel={handleAdminCancel}>
        <Tabs onChange={onChange}>
          <TabPane tab='Liste des membres' key="1">
            <div>
                {Array.from(serverUserMap.entries()).map(([id, user]) => 
                
                <div
                key={id}
                className='hoStat'
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  maxWidth: '300px',
                }}
              >
                <CustomImage
                  username={user.nickname}
                  status={user.user.status}
                  picture={user.user.picture}
                  key={id}
                />{' '}
                <Typography
                  style={{
                    width: '100%',
                    height: '100%',
                    paddingLeft: '10px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    color: '#A1A1A1',
                  }}
                >
                  {user.nickname.length > 14
                    ? user.nickname.slice(0, 14) + '...'
                    : user.nickname}
                </Typography>{' '}
                <SettingFilled style={{fontSize: 'large', marginRight: '1vw', cursor: 'pointer'}} onClick={() => setUserConcern(user.id) }/> 
                <CloseOutlined style={{fontSize: 'large', color: 'red', cursor: 'pointer'}} onClick={() => kickUser(user)}/>
              </div>
              )}
            </div>
            </TabPane>
            <TabPane tab='Liste des roles' key="2">
              {listOfRoles.map((role) => (<p> {role.name} <SettingFilled style={{fontSize: 'large', cursor: 'pointer'}} onClick={() => showPermModal()} /> </p> ) )}

              <Form
                form={form}
                layout="vertical"
                onFinish={onCreateNewRole}
              >
                <Form.Item name="newRole" label="Créer un nouveaux rôle">
                  <Input placeholder="Nom du rôle" id='roleName' />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit">
                      Valider
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
      </Modal>
      <Modal title="Administration des rôles" visible={isModalVisibleRole} onOk={handleRoleOk} onCancel={handleRoleCancel}>
        <Checkbox.Group
            style={{
            width: '100%',
            }}
            onChange={onChangeR}
            defaultValue={rolesAlreadyChecked}
        >
        <Row>
          {listOfRoles.map((role) => (<Checkbox value={role.id}> {role.name} </Checkbox> ) )}
        </Row>
        </Checkbox.Group>
        <Button onClick={onValidateAdmR}><CheckOutlined style={{color: 'green', fontSize: 'large'}} /></Button>
        </Modal>
        <PermModal 
          isModalVisiblePerm={isModalVisiblePerm}
          setIsPermModalVisible={setisModalVisiblePerm } 
          servers={[]} 
        />
{/*       <RoleModal
      isModalVisibleRole={isModalVisibleRole}
      userConcern={userConcern}
      setIsRoleModalVisible={setisModalVisibleRole } 
      servers={[]}
       /> */}
      
      </div>
  );
};

export default AdminModal;
