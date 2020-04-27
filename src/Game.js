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
    const { cfg } = this.state;
    const current = this.state[upgradeType];
    const newValue = cfg.getNext(upgradeType, current);
    if (newValue) {
      this.setState({
        [upgradeType]: newValue
      });
    }
  }

  upgradeTick = () => this.genericUpgrade("tickRate");
  upgradeSize = () => this.genericUpgrade("size");

  tick = (field) => {
    const rawValueMawed = field.update();
    const income = this.calculateIncome(rawValueMawed);

    const { tickRate } = this.state;
    setTimeout(this.tick, tickRate, field);
    this.setState(state => ({
      cash: state.cash + income
    }));
  }

  render() {
    const {cash, size, tickRate, baseColor} = this.state;
    return (
      <div className="Game">
        <Header />
        <Control cash={cash} upgradeSize={this.upgradeSize} upgradeTick={this.upgradeTick} />
        <FieldView size={size} tickRate={tickRate} baseColor={baseColor} tick={this.tick} />
      </div>
    );
  }
}

export default Game;
