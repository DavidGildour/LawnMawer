import React, { useState, useEffect } from 'react';
import '../css/fieldView.css';

import Field from '../gameLogic/field';
import Debug from './debug';
import Renderer from '../gameLogic/renderer';
import { render } from '@testing-library/react';


export default function FieldView(props) {
    const [renderer, setRenderer] = useState(new Renderer(document.querySelector("#canvas").getContext('2d')))
    useEffect(() => {
        renderer.setField(props.field)
        renderer.renderAll();
        if (!props.field.isTickSet) {
            setTimeout(props.tick, props.tickRate, props.field);
            props.field.isTickSet = true;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.field]);

    const { paused } = props.debug;
    const { tickId } = props;
    useEffect(() => {
        if (!paused) {
          props.tick(props.field);
        } else {
          clearTimeout(tickId);
        }
    }, [paused])

    useEffect(() => {
        renderer.resize(props.size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.size])
    useEffect(() => {
        props.field.setGrowthSpeed(props.growthSpeed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.growthSpeed])
    useEffect(() => {
        props.field.speedUpMawer(props.mawerSpeed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.mawerSpeed])
    useEffect(() => {
        renderer.resizeMawer(props.mawerSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.mawerSize])
    useEffect(() => {
        renderer.toggleValues(props.debug.showValues);
    }, [props.debug.showValues])
    const fieldStats = props.field.getDebugStats();
    let debugComponent;
    if (props.debug.active) {
        debugComponent =
            <Debug 
                tickRate={props.tickRate} growthRate={props.growthRate} size={props.size}
                grownCells={fieldStats.grownCellsThisTick} lostCells={fieldStats.overallCellsLost} 
                grassInMawer={fieldStats.grassInMawer} grassMawed={fieldStats.grassMawed}
            />
    } else {
        debugComponent = null;
    }
    return (
        <div className="green rounded game">
            <canvas id="canvas"></canvas>
            {debugComponent}
        </div>
    )
};