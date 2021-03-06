import React, { useState, useEffect } from 'react';
import '../css/fieldView.css';

import Field from '../gameLogic/field';
import Debug from './debug';

export default function FieldView(props) {
    const [field, setField] = useState(null);
    useEffect(() => {
        const canvas = document.querySelector("#canvas");
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext("2d");
        const newField = new Field(ctx, props.baseColor, props.grownColor, props.mawerColor, props.size);
        newField.renderAll();
        // newField.mawer.progress(props.size);
        setTimeout(props.tick, props.tickRate, newField);
        setField(newField)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { paused } = props.debug;
    const { tickId } = props;
    useEffect(() => {
        if (field && !paused) {
          props.tick(field);
        } else {
          clearTimeout(tickId);
        }
    }, [paused])

    useEffect(() => {
        if (field) field.resize(props.size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.size])
    useEffect(() => {
        if (field) field.setGrowthSpeed(props.growthSpeed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.growthSpeed])
    useEffect(() => {
        if (field) field.speedUpMawer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.mawerSpeed])
    useEffect(() => {
        if (field) field.resizeMawer(props.mawerSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.mawerSize])
    useEffect(() => {
        if (field) field.toggleValues(props.debug.showValues);
    }, [props.debug.showValues])
    const fieldStats = field ? field.getDebugStats() : {}
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