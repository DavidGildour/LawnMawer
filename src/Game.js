import React from 'react';
import './Game.css';

import Header from './comp/header';
import Control from './comp/control';
import FieldView from './comp/fieldView';

import Config from './gameLogic/config';
import Upgrade from './gameLogic/upgrade';


import Muney from './utils/money';

class Game extends React.Component {
  constructor(props) {
    super(props);
    const grassField = new Config({
      baseColor: [113, 100, 40],
      grownColor: [113, 100, 20],
      mawerColor: [0, 100, 40],
      cashMultiplier: 1,
      fieldSizeBasePrice: new Muney(1000),
      growthRateBasePrice: new Muney(15),
      tickRateBasePrice: new Muney(5),
      mawerSpeedBasePrice: new Muney(50),
      mawerSizeBasePrice: new Muney(50),
    });
    this.state = {
      cash: new Muney(0),
      cashMultiplier: grassField.cashMultplier,
      baseColor: grassField.baseColor,
      grownColor: grassField.grownColor,
      mawerColor: grassField.mawerColor,
      fieldSize: Upgrade.fromStatBase('fieldSize', grassField.fieldSize),
      tickRate: Upgrade.fromStatBase('tickRate', grassField.tickRate),
      growthRate: Upgrade.fromStatBase('growthRate', grassField.growthRate),
      mawerSpeed: Upgrade.fromStatBase('mawerSpeed', grassField.mawerSpeed),
      mawerSize: Upgrade.fromStatBase('mawerSize', grassField.mawerSize, () => {
        return Math.pow(this.state.fieldSize.currentValue, 2) > this.state.mawerSize.currentValue[0] * this.state.mawerSize.currentValue[1];
      }),
      debug: {
        active: true,
        paused: false,
        showValues: false
      }
    }
  }

  calculateIncome = (value) => {
    // TODO: more sophisticated way of calculating income
    return Math.round(this.state.cashMultiplier * value);
  }

  genericUpgrade = (upgradeType) => {
    const { cash } = this.state;
    const price = this.state[upgradeType].currentPrice;
    if (price !== Infinity && cash.sub(price).ge(0)) {
      this.state[upgradeType].upgrade();
      this.setState({
        cash: cash.sub(price)
      });
    }
  }

  upgradeTick = () => this.genericUpgrade("tickRate");
  upgradeSize = () => this.genericUpgrade("fieldSize");
  upgradeGrowth = () => this.genericUpgrade("growthRate");
  upgradeMawerSpeed = () => this.genericUpgrade("mawerSpeed");
  upgradeMawerSize = () => this.genericUpgrade("mawerSize");

  toggleDebug = (field) => {
    this.setState(state => (
      {
        debug: {
          ...state.debug,
          [field]: !state.debug[field]
        }
      }
    ))
  }

  togglePause = () => {
    this.toggleDebug('paused')
  }

  toggleValues = () => {
    this.toggleDebug('showValues')
  }

  tick = (field) => {
    const { tickRate, growthRate } = this.state;

    const rawValueMawed = field.update(growthRate.currentValue);
    const income = this.calculateIncome(rawValueMawed);

    this.tickTimeoutId = setTimeout(this.tick, tickRate.currentValue, field);
    if (income > 0) {
      this.setState(state => ({
        cash: state.cash.add(income)
      }));
    }
  }

  godMode = () => {
    this.setState(state => ({
      cash: state.cash.add(100_000)
    }))
  }

  render() {
    const {
      cash,
      baseColor,
      grownColor,
      mawerColor,
      fieldSize, 
      tickRate, 
      growthRate,
      mawerSpeed,
      mawerSize,
      debug
    } = this.state;
    return (
      <div className="Game">
        <Header />
        <Control
          cash={cash}
          upgradeSize={this.upgradeSize} sizePrice={fieldSize.currentPrice} curSize={fieldSize.currentValue}
          upgradeTick={this.upgradeTick} tickRatePrice={tickRate.currentPrice} curTickRate={tickRate.currentValue}
          upgradeGrowth={this.upgradeGrowth} growthRatePrice={growthRate.currentPrice} curGrowthRate={growthRate.currentValue}
          upgradeMawerSpeed={this.upgradeMawerSpeed} mawerSpeedPrice={mawerSpeed.currentPrice} curMawerSpeed={mawerSpeed.currentValue}
          upgradeMawerSize={this.upgradeMawerSize} mawerSizePrice={mawerSize.currentPrice} curMawerSize={mawerSize.currentValue}
          godMode={this.godMode}
          togglePause={this.togglePause}
          toggleValues={this.toggleValues}
          debug={debug}
        />
        <FieldView
          size={fieldSize.currentValue}
          tickRate={tickRate.currentValue}
          growthRate={growthRate.currentValue}
          baseColor={baseColor}
          grownColor={grownColor}
          mawerColor={mawerColor}
          mawerSpeed={mawerSpeed.currentValue}
          mawerSize={mawerSize.currentValue}
          debug={debug}
          tick={this.tick}
          tickId={this.tickTimeoutId}
        />
      </div>
    );
  }
}

export default Game;
