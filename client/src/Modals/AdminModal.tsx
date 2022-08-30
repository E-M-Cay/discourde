import { CheckOutlined, CloseOutlined, EditOutlined, RotateLeftOutlined, SettingFilled } from '@ant-design/icons';
import { Modal, Typography, Input, Avatar, Divider, Tabs, Button, Dropdown, Form, Space, Checkbox, Row, notification } from 'antd';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import { Channel, ServerResponse, ServerUser, User, VocalChan } from '../types/types';
import { UserMapsContext } from '../context/UserMapsContext';
import { CustomImage } from '../CustomLi/CustomLi';
import PermModal from './PermModal';


const { TabPane } = Tabs;
let userConcern: number;

let tmpCheckedRoles: Array<any> = [];
let checkedListRoles: Array<any> = [];
let rolesAlreadyChecked: Array<any> = [];

let idServer: number = -1
let allPerm: Array<any> = [];
let listOfRoles: Array<any> = [];

let tempoPerm: Array<any> = [];
let checkedListPerm : Array<any> = [];
let permAlreadyChecked: Array<any> = [];

let selectedRole: string;
let selectedRoleId: number;
let newRoleName: string;

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
  
  const [isModalVisiblePerm, setIsPermModalVisible] = useState(false);
  const { serverUserMap } = useContext(UserMapsContext);
  const { me } = useAppSelector((state) => state.userReducer);
  const activeServer = useAppSelector(
    (state) => state.userReducer.activeServer
  );

  idServer = activeServer;


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
      console.log("getRolesbyServer");
     
      listOfRoles= res.data;

     });  
  }

let serverId: any = activeServer;
let userId: any = 0;

const showPermModal = () => {
  setIsPermModalVisible(true);
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
  let nameNewRole: string = values.newRole;
  console.log("NameRole : " + nameNewRole)
  console.log("idServer du role : " + idServer)
  
  axios
  .post(`/role/create/`, {
        'name': nameNewRole,
        'server_id': idServer
  }, {
   headers: {
     access_token: localStorage.getItem('token') as string,
   },
 }).then((res) => {
  console.log(res.data)
  openNotification("Nouveau rôle créé avec succès !")
})
 handleAdminOk();
 getRolesByServer();
};
const getPermByServerRole = async (idRole: number) => {
  await axios
  .get(`/role/permission/${idRole}`, {
    headers: {
      access_token: localStorage.getItem('token') as string,
    },
  })
  .then((res) => {
   permAlreadyChecked = res.data;
   console.log("permAlreadyChecked")
   console.log(permAlreadyChecked)
   showPermModal();
  });

}

const setUserConcern = async (selectUser: number) => {

  userConcern = selectUser;
  console.log("UserConcernOnSetUser : " + userConcern)
  await getRolesByServeUser();
  showRoleModal(userConcern);
  return selectUser;
}
const getRolesByServeUser = async () => {
  await axios
  .get(`/role/role_list/${userConcern}`, {
   headers: {
     access_token: localStorage.getItem('token') as string,
   },
 })
 .then((res) => {
  console.log("getRolesByUser");
  console.log(res.data);

  rolesAlreadyChecked = res.data.role_id_list;
  
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

const onChangeP = (checkedValues: any) => {
  console.log('checked = ' + checkedValues);
  tempoPerm = checkedValues;

};
const onValidateAdmR = () => {
  checkedListRoles = tmpCheckedRoles;
  console.log("Id du user : " + userConcern)
  console.log("Liste des roles : " +  checkedListRoles);
  const tab_initial_role_id = []
  for(const role of listOfRoles)
    tab_initial_role_id.push(role.id)

  axios
  .post(`/role/add_role/`, {
        'role_id_list': checkedListRoles,
        'server_user_id': userConcern,
        'role_id_initial_list': tab_initial_role_id
  }, {
   headers: {
     access_token: localStorage.getItem('token') as string,
   },
 }).then((res) => {
  
  openNotification("Rôle attribué avec succès ! ")
})

  setisModalVisibleRole(false);
}

const isCheck = (idRole: any) => {


  var n = rolesAlreadyChecked.includes(idRole);
  console.log(rolesAlreadyChecked)
  console.log(idRole)
  console.log(n)
  return n
}
const isCheckP = (idPerm: any) => {


  var p = permAlreadyChecked.includes(idPerm);
  console.log(permAlreadyChecked.includes(idPerm))
  console.log(idPerm)
  console.log(permAlreadyChecked)

  return p
}
const handlePermOk = () => {
  setIsPermModalVisible(false);
};

const handlePermCancel = () => {
  setIsPermModalVisible(false);
};

const getAllPerm = async (roleId: number, roleName: string) => {
  selectedRoleId = roleId;
  selectedRole = roleName;
  newRoleName = selectedRole;
  console.log(" selectedRole: " + selectedRole)
  console.log("roleId : " + selectedRoleId )
  await axios
  .get(`/permission/list_all`, {
   headers: {
     access_token: localStorage.getItem('token') as string,
   },
 })
 .then(async (res) => {
  console.log("getAllPerm");
 
  allPerm= res.data;
  console.log(allPerm);
   await getPermByServerRole(selectedRoleId);
   
 });
 
  
}

const delRoleByServer = (role_id: number) => {
  console.log('roleid a delete : ' + role_id)
  axios
  .delete(`/role/delete/${role_id}`, {
    headers: {
      access_token: localStorage.getItem('token') as string,
    },
  }).then((res) => {
    openNotification("Rôle supprimé avec succès !")
  })
}

const updatePermServerRole = () => {
  
  checkedListPerm = tempoPerm;
  console.log("Nom du rôle a update : " + newRoleName)
  console.log("id du role choisis : " + selectedRoleId);
  console.log("List des perm à attribuer : " + checkedListPerm);

  axios
  .put(`/role/update/`, {
    'name': newRoleName,
    'role_id': selectedRoleId,
    'permission_list': checkedListPerm
    },{
    headers: {
      access_token: localStorage.getItem('token') as string,
    },
  }).then((res) => {
    console.log(res.data)
    openNotification("Rôle modifié avec succès !")
  })
  handlePermOk();
  handleAdminOk();
}
const setNewRoleName = (newName: any) => {
  console.log("NEWNAME")
  console.log(newName)
  newRoleName = newName;
}

const openNotification = (messageContent: any) => {
  notification.open({
    message: 'Notification !',
    description: messageContent,
    onClick: () => {
      console.log('Notification Clicked!');
    },
  });
};

  return (
    <div>
    <Modal title="Gestion des membres" visible={isModalVisibleAdmin} onOk={handleAdminOk} onCancel={handleAdminCancel} footer={null}>
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
              {listOfRoles.map((role) => (<p> {role.name} 
              <SettingFilled style={{fontSize: 'large', cursor: 'pointer', marginLeft: '1vw', marginRight:'1vw'}} onClick={() => getAllPerm(role.id, role.name)} />
              <CloseOutlined style={{fontSize: 'large', color: 'red', cursor: 'pointer'}} onClick={() => delRoleByServer(role.id)}/> </p> ) )}
              <Divider></Divider>
              <Form
                form={form}
                layout="vertical"
                onFinish={onCreateNewRole}
              >
                <Form.Item name="newRole" label="Créer un nouveau rôle">
                  <Input placeholder="Nom du rôle" defaultValue="" id='roleName' />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit">VALIDER</Button>
                  </Space>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
    </Modal>
      <Modal title="Attribution des rôles" visible={isModalVisibleRole} onOk={handleRoleOk} onCancel={handleRoleCancel} footer={null}>
        <Checkbox.Group
            style={{
              display: "flex",
              flexDirection: "column",
            }}
            defaultValue={rolesAlreadyChecked}
            onChange={onChangeR} 
        >
          {listOfRoles.map((role) => (<Checkbox checked={isCheck(role.id)} value={role.id}> {role.name}</Checkbox>) )}
        
        </Checkbox.Group><br/>
        <Button type='primary' onClick={onValidateAdmR}>VALIDER</Button>
        </Modal>
        <Modal title="Gestion des permissions" visible={isModalVisiblePerm} onOk={handlePermOk} onCancel={handlePermCancel} footer={null}>

            <Input addonBefore="Nom du rôle" defaultValue={selectedRole} id='roleName2' name='roleName2' onChange={(event) => setNewRoleName(event.target.value)}/>
        <Divider></Divider>
        <Checkbox.Group
            style={{
              display: "flex",
              flexDirection: "column"
            }}
            defaultValue={permAlreadyChecked}
            onChange={onChangeP}  
        >
          {allPerm.map((perm) => (<Checkbox checked={isCheckP(perm.id)} value={perm.id}>{perm.name}</Checkbox>))}
        
        </Checkbox.Group><br />
        <Button type="primary" style={{marginRight: "1vw"}} onClick={updatePermServerRole}>UPDATE</Button>
        <Button onClick={handlePermCancel}>ANNULER</Button>
      </Modal>
{/*         <PermModal 
          isModalVisiblePerm={isModalVisiblePerm}
          setIsPermModalVisible={setisModalVisiblePerm } 
          servers={[]} 
        /> */}
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
