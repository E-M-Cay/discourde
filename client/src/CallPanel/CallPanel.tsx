import {
  AudioMutedOutlined,
  PhoneOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import { Space, Tooltip, Layout, Slider, Image } from 'antd';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import React, { useContext, useState } from 'react';
import './CallPanel.css';

let src: string = '';
let width: number = 200;
let chanName: string = 'testVocalChanel';
let marginTopPP: string = '20vh';
let spaceBetween: number = 20;
let pair: boolean;
let n: number = 0;

// export const CallPanel = () => {
//   if (fakeUsers.length % 2 == 0) {
//     pair = true;
//   } else {
//     pair = false;
//   }

//   if (fakeUsers.length > 4) {
//     width = 150;
//     marginTopPP = '20vh';
//   } else if (fakeUsers.length == 1) {
//     marginTopPP = '40vh';
//   }
//   const onClick = (e: number) => {
//     return (event: React.MouseEvent) => {
//       //console.log('id User : ', e);
//       event.preventDefault();
//     };
//   };

//   return (
//     <Layout className='vocStyle'>
//       <Header>
//         <SoundOutlined /> {chanName}
//       </Header>
//       <Content style={{ textAlign: 'center', marginTop: marginTopPP }}>
//         {fakeUsers.map((user) => {
//           n += 1;
//           src = user.avatar;
//           if (pair) {
//             //console.log("pair ? :" + pair)
//           }
//           return (
//             <div className='ProfilPic'>
//               <Space size={spaceBetween}>
//                 <img onClick={onClick(user.id)} src={src} width={width} />
//                 <h1>{user.nickName}</h1>
//               </Space>
//             </div>
//           );
//         })}
//       </Content>
//       <Footer style={{ textAlign: 'center' }}>
//         <Tooltip placement='top' title={'Couper le micro'}>
//           <button>
//             <AudioMutedOutlined id='audio' />
//           </button>
//         </Tooltip>
//         <Tooltip placement='top' title={'Raccrocher'}>
//           <button>
//             <PhoneOutlined id='phone' />
//           </button>
//         </Tooltip>
//         <Tooltip
//           placement='top'
//           title={<Slider vertical defaultValue={50} className='volSider' />}
//         >
//           <button>
//             <SoundOutlined id='volume' />
//           </button>
//         </Tooltip>
//       </Footer>
//     </Layout>
//   );
// };
