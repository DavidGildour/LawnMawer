import React, { useState, useEffect } from 'react';
import '../css/game.css';

import Field from '../gameLogic/field';
import Debug from './debug';

export default function FieldView(props) {
    const [field, setField] = useState(null);
    useEffect(() => {
        const canvas = document.querySelector("#canvas");
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext("2d");
        const newField = new Field(ctx, props.baseColor, props.size);
        newField.renderAll();
        newField.progressMawer();
        setTimeout(props.tick, props.tickRate, newField);
        setField(newField)
    }, []);

    useEffect(() => {
        if (field) field.resize(props.size);
    }, [props.size])

    return (
        <div className="green rounded game">
            <canvas id="canvas"></canvas>
            <Debug tickRate={props.tickRate} size={props.size} />
        </div>
    )
};