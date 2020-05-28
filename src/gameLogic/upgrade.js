import { getNextValue } from '../utils/utils';


export default class Upgrade {
  constructor(name, basePrice, generator, priceMultiplier) {
    this.name = name;
    this.basePrice = basePrice;
    this.generator = generator;
    this.priceMultiplier = priceMultiplier;
    this.currentPrice = basePrice;
    this.currentValue = this.initValue();
  }

  static fromStatBase(name, stat) {
    return new Upgrade(
      name,
      stat.basePrice,
      stat.valueRange,
      stat.priceMultiplier
    )
  }

  initValue = () => {
    let [nextValue, final] = getNextValue(this.generator);
    if (final) {
      this.currentPrice = Infinity;
    }
    return nextValue;
  }

  upgrade = () => {
    let [nextValue, final] = getNextValue(this.generator);
    this.currentPrice = !final ? this.currentPrice.mult(this.priceMultiplier) : Infinity;
    this.currentValue = nextValue;
    return this.currentValue;
  }
};
