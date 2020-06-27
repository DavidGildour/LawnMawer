import React from 'react';
import '../css/control.css';

function formatPrice(price) {
    return price === Infinity ? "MAX" : price.toString();
}

function UpgradeButton(props) {
    return (
        <div className="upgrade">
            <button className="upgradeButton" onClick={props.upgradeFunc}>
                {props.text} ({formatPrice(props.currentPrice)})
            </button>
            <span className="upgradeText">&nbsp;{props.currentValue}</span>
        </div>
    )
}

export default function Control(props) {
    const ticksPerSecond = (1000 / props.curTickRate).toPrecision(4).replace(/\.?0+$/, "");
    const currentTickRate = `${ticksPerSecond} ticks per second`,
      currentSize = `${props.curSize} x ${props.curSize} tiles`,
      currentGrowthRate = `Growing ${props.curGrowthRate} tiles per tick`,
      currentMawerSize = `${props.curMawerSize[0]} x ${props.curMawerSize[1]}`,
      currentMawerSpeed = `Mawing ${props.curMawerSpeed} tiles per tick`;
    let debugControl = <div></div>
    if (props.debug.active) {
        const timeControl = <button onClick={props.togglePause}>{props.debug.paused ? 'Resume' : 'Pause'}</button>
        const gridValues = <button onClick={props.toggleValues}>Show grid values</button>
        const godMode = <button onClick={props.godMode}>Add cash</button>
    debugControl = <div>Debug stuff:{gridValues}{timeControl}{godMode}</div>
    }
    return (
        <div className="green rounded upgrades">
            <div>{props.cash.toString()}</div>
            <UpgradeButton upgradeFunc={props.upgradeTick} text="Upgrade Tick Rate" currentPrice={props.tickRatePrice} currentValue={currentTickRate} />
            <UpgradeButton upgradeFunc={props.upgradeSize} text="Upgrade Field Size" currentPrice={props.sizePrice} currentValue={currentSize} />
            <UpgradeButton upgradeFunc={props.upgradeGrowth} text="Upgrade Growth Rate" currentPrice={props.growthRatePrice} currentValue={currentGrowthRate} />
            <UpgradeButton upgradeFunc={props.upgradeMawerSpeed} text="Upgrade Mawer Speed" currentPrice={props.mawerSpeedPrice} currentValue={currentMawerSpeed} />
            <UpgradeButton upgradeFunc={props.upgradeMawerSize} text="Upgrade Mawer Size" currentPrice={props.mawerSizePrice} currentValue={currentMawerSize} />
            <UpgradeButton upgradeFunc={props.godMode} text="Add $$$" currentPrice={0} currentValue={100_000} />
            {debugControl}
        </div>
    )
};