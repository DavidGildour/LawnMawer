import React, { useState, useEffect } from 'react';
import '../css/game.css';

import Field from '../gameLogic/field';

export default function Game(props) {
    const cfg = props.config;
    useEffect(() => {
        const canvas = document.querySelector("#canvas");
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext("2d");
        setField(new Field(ctx, cfg.baseColor, cfg.sizes[0]));
    }, [cfg]);

    const [field, setField] = useState(null);
    useEffect(() => {
        if (field) field.renderAll();
    }, [field])

    return (
        <div className="green rounded game">
            <canvas id="canvas"></canvas>
        </div>
    )
};