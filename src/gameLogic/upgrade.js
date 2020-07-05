import { getNextValue } from '../utils/utils';

export default class Upgrade {
  constructor(
    name,
    basePrice,
    generator,
    priceMultiplier,
    externalCondition = () => true
  ) {
    this.externalCondition = externalCondition;
    this.name = name;
    this.basePrice = basePrice;
    this.generator = generator();
    this.priceMultiplier = priceMultiplier;
    this._currentPrice = basePrice;
    this.currentValue = this.initValue();
  }

  setExternalCondition(cond) {
    this.externalCondition = cond;
  }

  get currentPrice() {
    if (this.externalCondition()) {
      return this._currentPrice;
    } else {
      return Infinity;
    }
  }

  set currentPrice(val) {
    this._currentPrice = val;
  }

  static fromStatBase(name, stat, externalCondition) {
    return new Upgrade(
      name,
      stat.basePrice,
      stat.valueRange,
      stat.priceMultiplier,
      externalCondition
    );
  }

  initValue = () => {
    let [nextValue, final] = getNextValue(this.generator);
    if (final) {
      this.currentPrice = Infinity;
    }
    return nextValue;
  };

  upgrade = () => {
    let [nextValue, final] = getNextValue(this.generator);
    this.currentPrice = !final
      ? this.currentPrice.mult(this.priceMultiplier)
      : Infinity;
    this.currentValue = nextValue;
    return this.currentValue;
  };
}
