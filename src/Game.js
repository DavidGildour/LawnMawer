import React from 'react';
import './Game.css';

import Header from './comp/header';
import Control from './comp/control';
import FieldView from './comp/fieldView';

import Config from './gameLogic/config';

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
      size: baseConfig.size,
      tickRate: baseConfig.tickRate,
      growthRate: baseConfig.growthRate,
    }
  }

  calculateIncome = (value) => {
    // TODO: more sophisticated way of calculating income
    return Math.round(this.state.cfg.multiplier * value);
  }

  genericUpgrade = (upgradeType) => {
    const { cfg, cash } = this.state;
    const price = cfg[upgradeType].currentPrice;
    if (cash - price >= 0) {
      cfg[upgradeType].getNextValue();
      this.setState({
        cash: cash - price
      });
    }
  }

  upgradeTick = () => this.genericUpgrade("tickRate");
  upgradeSize = () => this.genericUpgrade("size");
  upgradeGrowth = () => this.genericUpgrade("growthRate");

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
      size, 
      tickRate, 
      growthRate,
    } = this.state;
    return (
      <div className="Game">
        <Header />
        <Control
          cash={cash}
          upgradeSize={this.upgradeSize} sizePrice={size.currentPrice} curSize={size.currentValue}
          upgradeTick={this.upgradeTick} tickRatePrice={tickRate.currentPrice} curTickRate={tickRate.currentValue}
          upgradeGrowth={this.upgradeGrowth} growthRatePrice={growthRate.currentPrice} curGrowthRate={growthRate.currentValue}
          godMode={this.godMode}
        />
        <FieldView
          size={size.currentValue}
          tickRate={tickRate.currentValue}
          growthRate={growthRate.currentValue}
          baseColor={baseColor}
          tick={this.tick}
        />
      </div>
    );
  }
}

export default Game;
