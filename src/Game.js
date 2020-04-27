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
      size: baseConfig.sizes[0],
      sizePrice: baseConfig.basePrices.size,
      tickRate: baseConfig.tickRates[0],
      tickRatePrice: baseConfig.basePrices.tickRate,
      growthRate: baseConfig.growthRates[0],
      growthRatePrice: baseConfig.basePrices.growthRate,
    }
  }

  calculateIncome = (value) => {
    // TODO: more sophisticated way of calculating income
    return Math.round(this.state.cfg.multiplier * value);
  }

  genericUpgrade = (upgradeType) => {
    const { cfg, cash } = this.state;
    const current = this.state[upgradeType];
    const newValue = cfg.getNext(upgradeType, current);
    const price = this.state[upgradeType + "Price"];
    if (newValue && cash - price >= 0) {
      this.setState({
        [upgradeType]: newValue,
        cash: cash - price,
        [upgradeType + "Price"]: Math.ceil(price*1.2),
      });
    }
  }

  upgradeTick = () => this.genericUpgrade("tickRate");
  upgradeSize = () => this.genericUpgrade("size");
  upgradeGrowth = () => this.genericUpgrade("growthRate");

  tick = (field) => {
    const { tickRate, growthRate } = this.state;

    const rawValueMawed = field.update(growthRate);
    const income = this.calculateIncome(rawValueMawed);

    setTimeout(this.tick, tickRate, field);
    if (income > 0) {
      this.setState(state => ({
        cash: state.cash + income
      }));
    }
  }

  render() {
    const {
      cash,
      baseColor,
      size,       sizePrice,
      tickRate,   tickRatePrice,
      growthRate, growthRatePrice,
    } = this.state;
    const ticksPerSecond = (1000 / tickRate).toPrecision(4).replace(/\.?0+$/, "");
    const currentTickRate   = `${ticksPerSecond} ticks per second`,
          currentSize       = `${size} x ${size} tiles`,
          currentGrowthRate = `Growing ${growthRate} tiles per tick`;
    return (
      <div className="Game">
        <Header />
        <Control
          cash={cash}
          upgradeSize={this.upgradeSize} sizePrice={sizePrice} curSize={currentSize}
          upgradeTick={this.upgradeTick} tickRatePrice={tickRatePrice} curTickRate={currentTickRate}
          upgradeGrowth={this.upgradeGrowth} growthRatePrice={growthRatePrice} curGrowthRate={currentGrowthRate}
        />
        <FieldView
          size={size}  
          tickRate={tickRate}
          growthRate={growthRate}
          baseColor={baseColor}
          tick={this.tick}
        />
      </div>
    );
  }
}

export default Game;
