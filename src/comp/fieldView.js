import React, { useState, useEffect, useCallback } from 'react';
import '../css/fieldView.css';

import Debug from './debug';
import Renderer from '../gameLogic/renderer';

export default props => {
  const [renderer, setRenderer] = useState(null);
  const ref = useCallback(canvas => {
    console.log(canvas);
    if (canvas) setRenderer(new Renderer(canvas.getContext('2d')));
  }, []);
  useEffect(() => {
    console.log(renderer, 'field');
    if (!renderer) return;
    renderer.setField(props.field);
    renderer.renderAll();
    if (!props.field.isTickSet) {
      setTimeout(props.tick, props.tickRate, props.field, renderer);
      props.field.isTickSet = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.field]);

  const { paused } = props.debug;
  const { tickId } = props;
  useEffect(() => {
    if (!paused) {
      props.tick(props.field, renderer);
    } else {
      clearTimeout(tickId);
    }
  }, [paused]);

  useEffect(() => {
    if (renderer) renderer.resizeField(props.size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.size]);
  useEffect(() => {
    props.field.setGrowthSpeed(props.growthSpeed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.growthSpeed]);
  useEffect(() => {
    props.field.speedUpMawer(props.mawerSpeed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.mawerSpeed]);
  useEffect(() => {
    if (renderer) renderer.resizeMawer(props.mawerSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.mawerSize]);
  useEffect(() => {
    if (renderer) renderer.toggleValues(props.debug.showValues);
  }, [props.debug.showValues]);
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
