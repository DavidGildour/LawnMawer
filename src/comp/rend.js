import React, { createRef, useEffect } from 'react';
import '../css/fieldView.css';

export default ({ fieldView }) => {
  const [comp, setComp] = useState(null);

  return (
    <div className="green rounded game">
      <canvas id="canvas" ref={canRef}></canvas>
      {canRef.current && fieldView(canRef)}
    </div>
  );
};
