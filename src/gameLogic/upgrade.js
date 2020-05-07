import { getNextValue } from './utils';


export default class Upgrade {
  constructor(name, basePrice, generator, priceMultiplier) {
      this.name = name;
      this.basePrice = basePrice;
      this.generator = generator;
      this.priceMultiplier = priceMultiplier;
      this.currentPrice = basePrice / priceMultiplier;
      this.currentValue = 0;
      this.incrementPrice();
  }

  static fromStatBase(name, stat) {
    return new Upgrade(
      name,
      stat.basePrice,
      stat.valueRange,
      stat.priceMultiplier
    )
  }

  incrementPrice = () => {
      let [nextValue, final] = getNextValue(this.generator);
      this.currentPrice = !final ? Math.ceil(this.currentPrice * this.priceMultiplier) : Infinity;
      this.currentValue = nextValue;
      return this.currentValue;
  }
};
