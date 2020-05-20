import React from 'react';
import '../css/control.css';


function formatPrice(price) {
    if (price === Infinity) {
        return 'MAX'
    } else {
        return `${price} $`
    }
}

export default function Control(props) {
    const ticksPerSecond = (1000 / props.curTickRate).toPrecision(4).replace(/\.?0+$/, "");
    const currentTickRate = `${ticksPerSecond} ticks per second`,
      currentSize = `${props.curSize} x ${props.curSize} tiles`,
      currentGrowthRate = `Growing ${props.curGrowthRate} tiles per tick`,
      currentMawerSpeed = `Mawing ${props.curMawerSpeed} tiles per tick`;
    let debugControl = <div></div>
    if (props.debug) {
        const timeControl = props.paused ? <button onClick={props.resume}>Resume</button> : <button onClick={props.pause}>Pause</button>
        const gridValues = <button onClick={props.toggleValues}>Show grid values</button>
        const godMode = <button onClick={props.godMode}>Add cash</button>
    debugControl = <div>Debug stuff:{gridValues}{timeControl}{godMode}</div>
    }
    return (
        <div className="green rounded upgrades">
            <div>{props.cash} $</div>
            <button onClick={props.upgradeTick}>Upgrade Tick Rate ({formatPrice(props.tickRatePrice)})</button> {currentTickRate}<br />
            <button onClick={props.upgradeSize}>Upgrade Field Size ({formatPrice(props.sizePrice)})</button> {currentSize}<br />
            <button onClick={props.upgradeGrowth}>Upgrade Growth Rate ({formatPrice(props.growthRatePrice)})</button> {currentGrowthRate}<br />
            <button onClick={props.upgradeMawerSpeed}>Upgrade Mawer Speed ({formatPrice(props.mawerSpeedPrice)})</button> {currentMawerSpeed}<br />
            {debugControl}
        </div>
    )
};