import React from 'react';
import '../css/control.css';

export default function Control(props) {
    return (
        <div className="green rounded upgrades">
            <div>{props.cash} $</div>
            <button onClick={props.upgradeTick}>Upgrade Tick Rate ({props.tickRatePrice} $)</button> {props.curTickRate}<br />
            <button onClick={props.upgradeSize}>Upgrade Field Size ({props.sizePrice} $)</button> {props.curSize}<br />
            <button onClick={props.upgradeGrowth}>Upgrade Growth Rate ({props.growthRatePrice} $)</button> {props.curGrowthRate}<br />
            <button onClick={props.godMode}>Add cash</button>
        </div>
    )
};