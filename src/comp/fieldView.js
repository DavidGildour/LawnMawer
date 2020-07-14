import React, { useState, useEffect, useCallback } from 'react';
import '../css/fieldView.css';

import Debug from './debug';
import Renderer from '../gameLogic/renderer';

export default props => {
  const [renderer, setRenderer] = useState(null);

  const ref = useCallback(canvas => {
    if (canvas) setRenderer(new Renderer(canvas.getContext('2d')));
  }, []);

  const ifRenderer = effect => {
    return () => {
      if (renderer) {
        effect();
      }
    };
  };

  useEffect(
    ifRenderer(() => {
      console.log(renderer, 'field');
      renderer.setField(props.field);
      renderer.renderAll();
      if (!props.field.isTickSet) {
        setTimeout(props.tick, props.tickRate, props.field, renderer);
        props.field.isTickSet = true;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }),
    [props.field, renderer]
  );

  const { paused } = props.debug;
  const { tickId } = props;
  useEffect(
    ifRenderer(() => {
      if (!paused) {
        props.tick(props.field, renderer);
      } else {
        clearTimeout(tickId);
      }
    }),
    [paused]
  );

  useEffect(
    ifRenderer(() => {
      renderer.resizeField(props.size);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }),
    [props.size]
  );
  useEffect(() => {
    props.field.setGrowthSpeed(props.growthSpeed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.growthSpeed]);
  useEffect(() => {
    props.field.speedUpMawer(props.mawerSpeed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.mawerSpeed]);
  useEffect(
    ifRenderer(() => {
      renderer.resizeMawer(props.mawerSize);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }),
    [props.mawerSize]
  );
  useEffect(
    ifRenderer(() => {
      renderer.toggleValues(props.debug.showValues);
    }),
    [props.debug.showValues]
  );
  const fieldStats = props.field.getDebugStats();
  let debugComponent;
  if (props.debug.active) {
    debugComponent = (
      <Debug
        tickRate={props.tickRate}
        growthRate={props.growthRate}
        size={props.size}
        grownCells={fieldStats.grownCellsThisTick}
        lostCells={fieldStats.overallCellsLost}
        grassInMawer={fieldStats.grassInMawer}
        grassMawed={fieldStats.grassMawed}
      />
    );
  } else {
    debugComponent = null;
  }
  return (
    <div className="green rounded game">
      <canvas id="canvas" ref={ref}></canvas>
      {debugComponent}
    </div>
  );
};
