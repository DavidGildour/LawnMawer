import React from 'react';
import './Game.css';

import Header from './comp/header';
import Control from './comp/control';
import FieldView from './comp/fieldView';

import Config from './gameLogic/config';
import { getNextValue } from './gameLogic/utils'

export class Upgrade {
  constructor(name, basePrice, generator, priceMultiplier) {
      this.name = name;
      this.basePrice = basePrice;
      this.generator = generator;
      this.priceMultiplier = priceMultiplier;
      this.currentPrice = basePrice / priceMultiplier;
      this.currentValue = 0;
      this.getNextValue()
  }

  getNextValue = () => {
      let [nextValue, final] = getNextValue(this.generator);
      this.currentPrice = !final ? Math.ceil(this.currentPrice * this.priceMultiplier) : Infinity;
      this.currentValue = nextValue;
      return this.currentValue;
  }
}


class Game extends React.Component {
  constructor(props) {
    super(props);
    const baseConfig = new Config(
      [113, 100],
      1,
      {
        size: 1000,
        tickRate: 5,
        growthRate: 10,
      }
    );
    this.state = {
      cash: 0,
      cfg: baseConfig,
      baseColor: baseConfig.baseColor,
      fieldSize: new Upgrade('fieldSize', 1000, baseConfig.fieldSizeGen, 1.2),
      tickRate: new Upgrade('tickRate', 8, baseConfig.tickRateGen, 1.2),
      growthRate: new Upgrade('growthRate', 10, baseConfig.growthRateGen, 1.6),
      mawerSpeed: new Upgrade('mawerSpeed', 150, baseConfig.mawerSpeedGen, 1.9),
    }
  }

  calculateIncome = (value) => {
    // TODO: more sophisticated way of calculating income
    return Math.round(this.state.cfg.cashMultpiler * value);
  }

  genericUpgrade = (upgradeType) => {
    const { cash } = this.state;
    const price = this.state[upgradeType].currentPrice;
    if (cash - price >= 0) {
      this.state[upgradeType].getNextValue();
      this.setState({
        cash: cash - price
      });
    }
  }

  upgradeTick = () => this.genericUpgrade("tickRate");
  upgradeSize = () => this.genericUpgrade("fieldSize");
  upgradeGrowth = () => this.genericUpgrade("growthRate");
  upgradeMawerSpeed = () => this.genericUpgrade("mawerSpeed");

  tick = (field) => {
    const { tickRate, growthRate } = this.state;

    const rawValueMawed = field.update(growthRate.currentValue);
    const income = this.calculateIncome(rawValueMawed);

    setTimeout(this.tick, tickRate.currentValue, field);
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
      fieldSize, 
      tickRate, 
      growthRate,
      mawerSpeed
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
        />
        <FieldView
          size={fieldSize.currentValue}
          tickRate={tickRate.currentValue}
          growthRate={growthRate.currentValue}
          baseColor={baseColor}
          mawerSpeed={mawerSpeed.currentValue}
          tick={this.tick}
        />
      </div>
    );
  }
}

export default Game;
