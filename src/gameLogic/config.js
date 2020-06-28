import { tickRateGen, fieldSizeGen, growthRateGen, mawerSpeedGen, growthSpeedGen } from './baseConfig';

class StatBase {
    constructor(basePrice, valueRange, priceMultiplier) {
        this.basePrice = basePrice;
        this.valueRange = valueRange;
        this.priceMultiplier = priceMultiplier;
    }
}

export default class Config {
    constructor({ baseColor, grownColor, mawerColor, tickRateBasePrice, growthRateBasePrice,
                  fieldSizeBasePrice, mawerSpeedBasePrice, growthSpeedBasePrice, cashMultiplier }) {
        this.baseColor = baseColor;
        this.grownColor = grownColor;
        this.mawerColor = mawerColor;
        this.fieldSize = new StatBase(fieldSizeBasePrice, fieldSizeGen, 2.5);
        this.tickRate = new StatBase(tickRateBasePrice, tickRateGen, 1.2);
        this.growthRate = new StatBase(growthRateBasePrice, growthRateGen, 1.2);
        this.mawerSpeed = new StatBase(mawerSpeedBasePrice, mawerSpeedGen, 1.5);
        this.growthSpeed = new StatBase(growthSpeedBasePrice, growthSpeedGen, 10);
        this.cashMultpiler = cashMultiplier;
    }

    getNext = what => this[what].valueRange.nextValue();
};

