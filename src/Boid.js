import React from 'react';

function Boid({ boid, offset }) {
  if (!offset.x && !offset.y) return (<></>);

  return (
    <div
      style={{
        width: '10px',
        height: '10px',
        position: 'absolute',
        top: offset.y + boid.y,
        left: offset.x + boid.x,
        backgroundColor: '#fadb14',
        borderRadius: '50%'
      }}
    />
  );
}

export default Boid;
