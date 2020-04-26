import React from 'react';


export default function Debug(props) {
  return (
    <div className="debug">
      {Object.entries(props).map(([k, v], i) => <div key={i}>{k}: {v}</div>)}
    </div>
  )
}
