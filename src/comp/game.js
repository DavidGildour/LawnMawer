import React, { useState, useEffect } from 'react';
import '../css/game.css';

import Field from '../gameLogic/field';

function tick(field, cfg) {
    field.update();
    if (cfg.tickRate > 4) {
        cfg.tickRate *= 0.99;
    }
    setTimeout(tick, cfg.tickRate, field, cfg);
}

export default function Game(props) {
    const cfg = props.config;
    const [tickRate, setTickRate] = useState(cfg.tickRate);
    setInterval(cfg => {
        setTickRate(cfg.tickRate)
    }, 10, cfg);

    useEffect(() => {
        const canvas = document.querySelector("#canvas");
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext("2d");
        setField(new Field(ctx, cfg.baseColor, cfg.sizes[0]));
    }, [cfg]);

    const [field, setField] = useState(null);
    useEffect(() => {
        if (field) {
            field.renderAll();
            setTimeout(tick, cfg.tickRate, field, cfg);
        }
    }, [field])

    return (
        <div className="green rounded game">
            <canvas id="canvas"></canvas>
            <div className="debug">Tick rate: {tickRate.toPrecision(4)} ms</div>
        </div>
    )
};