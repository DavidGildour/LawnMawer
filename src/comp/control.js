import React from 'react';
import '../css/control.css';

export default function Control(props) {
    return (
        <div className="green rounded upgrades">
            <div>{props.cash} $</div>
            <button onClick={props.upgradeTick}>Upgrade Tick Rate</button><br />
            <button onClick={props.upgradeSize}>Upgrade Field Size</button>
        </div>
    )
};