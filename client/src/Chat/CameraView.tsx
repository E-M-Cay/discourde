import React from 'react';
import { Avatar } from 'antd';

export const CameraView = () => {
  const cam = ['jean', 'pierre', 'pen', 'jdjdh'];
  const bool = false;
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        height: 'calc(95vh - 44px)',
        margin: 'auto',
      }}
    >
      {cam.map((c) => (
        <div
          style={{
            flexBasis: '50%',
            width: '100%',
            height: cam.length > 2 ? '50%' : '100%',
            marginTop: '10px',
            marginInline: 'auto',
          }}
        >
          <div
            className='camcam'
            style={{
              width: 'calc(100%-20px)',
              height: '100%',
              backgroundColor: '#323232',
              margin: '10px',
              borderRadius: '10px',
              boxSizing: 'border-box',
              backgroundImage: `url(/profile-pictures/robot1.png)`,
              backgroundSize: '99999999px',
              //   border: '8px solid rgba(0, 0, 0, 0.7)',
            }}
          >
            {!bool && (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Avatar
                  src={'/profile-pictures/robot1.png'}
                  size={100}
                  style={{ margin: 'auto' }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
