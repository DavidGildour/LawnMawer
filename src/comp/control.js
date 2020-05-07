import React from 'react';
import '../css/control.css';

function formatPrice(price) {
    return price === null ? "MAX" : price.toString();
}

function UpgradeButton(props) {
    return (
        <div className="upgrade transparentb">
            <button type="button" className="nes-btn" onClick={props.upgradeFunc}>
                {props.text} ({formatPrice(props.currentPrice)})
            </button>
            <span className="upgradeText">&nbsp;{props.currentValue}</span>
        </div>
    )
}

export default function Control(props) {
    return (
        <div className="grass rounded upgrades">
            <div className="cash transparentb">Earned {props.cash.toString()}</div>
            <UpgradeButton upgradeFunc={props.upgradeTick} text="Upgrade Tick Rate" currentPrice={props.tickRatePrice} currentValue={props.curTickRate} />
            <UpgradeButton upgradeFunc={props.upgradeSize} text="Upgrade Field Size" currentPrice={props.sizePrice} currentValue={props.curSize} />
            <UpgradeButton upgradeFunc={props.upgradeGrowth} text="Upgrade Growth Rate" currentPrice={props.growthRatePrice} currentValue={props.curGrowthRate} />
            <UpgradeButton upgradeFunc={props.godMode} text="Add $$$" currentPrice={0} currentValue={100_000} />
        </div>
    )
};