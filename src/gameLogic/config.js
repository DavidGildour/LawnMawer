import {
  tickRateGen,
  fieldSizeGen,
  growthRateGen,
  mawerSpeedGen,
  mawerSizeGen,
  growthSpeedGen,
} from './baseConfig';
import Upgrade from './upgrade';
import Field from './field';

class StatBase {
  constructor(basePrice, valueRange, priceMultiplier) {
    this.basePrice = basePrice;
    this.valueRange = valueRange;
    this.priceMultiplier = priceMultiplier;
  }
}

export default class Config {
  constructor({
    baseColor,
    grownColor,
    mawerColor,
    tickRateBasePrice,
    growthRateBasePrice,
    fieldSizeBasePrice,
    mawerSpeedBasePrice,
    mawerSizeBasePrice,
    growthSpeedBasePrice,
    cashMultiplier,
  }) {
    this.baseColor = baseColor;
    this.grownColor = grownColor;
    this.mawerColor = mawerColor;
    this.fieldSize = Upgrade.fromStatBase(
      'fieldSize',
      new StatBase(fieldSizeBasePrice, fieldSizeGen, 2.5)
    );
    this.tickRate = Upgrade.fromStatBase(
      'tickRate',
      new StatBase(tickRateBasePrice, tickRateGen, 1.2)
    );
    this.growthRate = Upgrade.fromStatBase(
      'growthRate',
      new StatBase(growthRateBasePrice, growthRateGen, 1.2)
    );
    this.mawerSpeed = Upgrade.fromStatBase(
      'mawerSpeed',
      new StatBase(mawerSpeedBasePrice, mawerSpeedGen, 1.5)
    );
    this.growthSpeed = Upgrade.fromStatBase(
      'growthSpeed',
      new StatBase(growthSpeedBasePrice, growthSpeedGen, 10)
    );
    this.mawerSize = Upgrade.fromStatBase(
      'mawerSize',
      new StatBase(mawerSizeBasePrice, mawerSizeGen, 1.5),
      () => {
        return (
          Math.pow(this.fieldSize.currentValue, 2) >
          this.mawerSize.currentValue[0] * this.mawerSize.currentValue[1]
        );
      }
    );
    this.cashMultiplier = cashMultiplier;
    this.field = new Field(
      baseColor,
      grownColor,
      mawerColor,
      this.fieldSize.currentValue
    );
  }

  getNext = what => this[what].valueRange.nextValue();
}
