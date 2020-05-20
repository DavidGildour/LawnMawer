import React from 'react';
import './Game.css';

import Header from './comp/header';
import Control from './comp/control';
import FieldView from './comp/fieldView';

import Config from './gameLogic/config';
import Upgrade from './gameLogic/upgrade';


class Game extends React.Component {
  constructor(props) {
    super(props);
    const grassField = new Config({
      baseColor: [113, 100, 20],
      grownColor: [113, 100, 40],
      mawerColor: [0, 100, 40],
      cashMultiplier: 1,
      fieldSizeBasePrice: 1000,
      growthRateBasePrice: 15,
      tickRateBasePrice: 5,
      mawerSpeedBasePrice: 50,
    });
    this.state = {
      cash: 0,
      cashMultiplier: grassField.cashMultpiler,
      baseColor: grassField.baseColor,
      grownColor: grassField.grownColor,
      mawerColor: grassField.mawerColor,
      fieldSize: Upgrade.fromStatBase('fieldSize', grassField.fieldSize),
      tickRate: Upgrade.fromStatBase('tickRate', grassField.tickRate),
      growthRate: Upgrade.fromStatBase('growthRate', grassField.growthRate),
      mawerSpeed: Upgrade.fromStatBase('mawerSpeed', grassField.mawerSpeed),
      paused: false,
      debug: true,
      valuesShown: false
    }
  }

  calculateIncome = (value) => {
    // TODO: more sophisticated way of calculating income
    return Math.round(this.state.cashMultiplier * value);
  }

  genericUpgrade = (upgradeType) => {
    const { cash } = this.state;
    const price = this.state[upgradeType].currentPrice;
    if (cash - price >= 0) {
      this.state[upgradeType].upgrade();
      this.setState({
        cash: cash - price
      });
    }
  }

  upgradeTick = () => this.genericUpgrade("tickRate");
  upgradeSize = () => this.genericUpgrade("fieldSize");
  upgradeGrowth = () => this.genericUpgrade("growthRate");
  upgradeMawerSpeed = () => this.genericUpgrade("mawerSpeed");

  pauseGame = () => {
    clearTimeout(this.tickTimeoutId);
    this.setState({paused: true})
  }
  resumeGame = () => {
    this.tick();
    this.setState({paused: false})
  }
  toggleValues = () => {
    this.setState({ valuesShown: !this.state.valuesShown})
  }

  tick = (field) => {
    const { tickRate, growthRate } = this.state;

    const rawValueMawed = field.update(growthRate.currentValue);
    const income = this.calculateIncome(rawValueMawed);

    this.tickTimeoutId = setTimeout(this.tick, tickRate.currentValue, field);
    if (income > 0) {
      this.setState(state => ({
        cash: state.cash + income
      }));
    }
  }

  godMode = () => {
    this.setState(state => ({
      cash: state.cash + 100_000
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
          godMode={this.godMode}
          pause={this.pauseGame}
          resume={this.resumeGame}
          toggleValues={this.toggleValues}
          paused={this.state.paused}
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
          showValues={this.state.valuesShown}
          tick={this.tick}
        />
      </div>
    );
  }
}

export default Game;
