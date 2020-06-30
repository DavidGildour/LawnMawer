import React from 'react';
import './Game.css';

import Header from './comp/header';
import Control from './comp/control';
import FieldView from './comp/fieldView';

import fields from './gameLogic/fields'


import Muney from './utils/money';

class Game extends React.Component {
  constructor(props) {
    super(props);
    const grassField = fields.grassField;
    this.state = {
      cash: new Muney(0),
      currentField: grassField,
      fields: [],
      debug: {
        active: true,
        paused: false,
        showValues: false
      }
    }
  }

  calculateIncome = (value) => {
    // TODO: more sophisticated way of calculating income
    return Math.round(this.state.currentField.cashMultiplier * value);
  }

  genericUpgrade = (upgradeType) => {
    const { cash } = this.state;
    const price = this.state.currentField[upgradeType].currentPrice;
    if (price !== Infinity && cash.sub(price).ge(0)) {
      this.state.currentField[upgradeType].upgrade();
      this.setState({
        cash: cash.sub(price)
      });
    }
  }

  upgradeTick = () => this.genericUpgrade("tickRate");
  upgradeSize = () => this.genericUpgrade("fieldSize");
  upgradeGrowth = () => this.genericUpgrade("growthRate");
  upgradeMawerSpeed = () => this.genericUpgrade("mawerSpeed");
  upgradeGrowthSpeed = () => this.genericUpgrade("growthSpeed");
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

  tick = (field, renderer) => {
    const { tickRate, growthRate } = this.state.currentField;

    const rawValueMawed = field.update(growthRate.currentValue);
    const income = this.calculateIncome(rawValueMawed);

    this.tickTimeoutId = setTimeout(this.tick, tickRate.currentValue, field);
    if (income > 0) {
      this.setState(state => ({
        cash: state.cash.add(income)
      }));
    }
    if (field === this.currentField) {
      renderer.update()
    }
  }

  godMode = () => {
    this.setState(state => ({
      cash: state.cash.add(100_000_000)
    }))
  }

  render() {
    const { debug, cash } = this.state;
    const {
      baseColor,
      grownColor,
      mawerColor,
      fieldSize, 
      tickRate, 
      growthRate,
      mawerSpeed,
      growthSpeed,
      mawerSize,
    } = this.state.currentField;
    return (
      <div className="Game">
        <Header />
        <Control
          cash={cash}
          upgradeSize={this.upgradeSize} sizePrice={fieldSize.currentPrice} curSize={fieldSize.currentValue}
          upgradeTick={this.upgradeTick} tickRatePrice={tickRate.currentPrice} curTickRate={tickRate.currentValue}
          upgradeGrowth={this.upgradeGrowth} growthRatePrice={growthRate.currentPrice} curGrowthRate={growthRate.currentValue}
          upgradeMawerSpeed={this.upgradeMawerSpeed} mawerSpeedPrice={mawerSpeed.currentPrice} curMawerSpeed={mawerSpeed.currentValue}
          upgradeGrowthSpeed={this.upgradeGrowthSpeed} growthSpeedPrice={growthSpeed.currentPrice} curGrowthSpeed={growthSpeed.currentValue}
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
          growthSpeed={growthSpeed.currentValue}
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
