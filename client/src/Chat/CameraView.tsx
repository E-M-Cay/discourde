export const CameraView = () => {
  const cam = ['jean', 'pierre', 'pen', 'jdjdh'];
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
            style={{
              width: 'calc(100%-20px)',
              height: '100%',
              backgroundColor: '#323232',
              margin: '10px',
              borderRadius: '10px',
              boxSizing: 'border-box',
              //   border: '8px solid rgba(0, 0, 0, 0.7)',
            }}
          >
            {c}
          </div>
        </div>
      ))}
    </div>
  );
};
