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
        newField.initiate();
        newField.mawer.progress(props.size);
        setTimeout(props.tick, props.tickRate, newField);
        setField(newField)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (field) field.resize(props.size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.size])
    useEffect(() => {
        if (field) field.speedUpMawer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.mawerSpeed])
    useEffect(() => {
        if (field) field.showValues(props.showValues);
    }, [props.showValues])
    const fieldStats = field ? field.getDebugStats() : {}
    return (
        <div className="green rounded game">
            <canvas id="canvas"></canvas>
            <Debug 
                tickRate={props.tickRate} growthRate={props.growthRate} size={props.size}
                grownCells={fieldStats.grownCellsThisTick} lostCells={fieldStats.overallCellsLost} 
                grassInMawer={fieldStats.grassInMawer} grassMawed={fieldStats.grassMawed}/>
        </div>
    )
};