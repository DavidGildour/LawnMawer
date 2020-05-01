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
      currentGrowthRate = `Growing ${props.curGrowthRate} tiles per tick`;
    return (
        <div className="green rounded upgrades">
            <div>{props.cash} $</div>
            <button onClick={props.upgradeTick}>Upgrade Tick Rate ({formatPrice(props.tickRatePrice)})</button> {currentTickRate}<br />
            <button onClick={props.upgradeSize}>Upgrade Field Size ({formatPrice(props.sizePrice)})</button> {currentSize}<br />
            <button onClick={props.upgradeGrowth}>Upgrade Growth Rate ({formatPrice(props.growthRatePrice)})</button> {currentGrowthRate}<br />
            <button onClick={props.godMode}>Add cash</button>
        </div>
    )
};