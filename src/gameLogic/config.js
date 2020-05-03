import { tickRateGen, fieldSizeGen, growthRateGen } from './baseConfig';

export default class Config {
    constructor(baseColor, cashMultiplier) {
        this.baseColor = baseColor;
        this.fieldSizeGen = fieldSizeGen;
        this.tickRateGen = tickRateGen;
        this.growthRateGen = growthRateGen;
        this.cashMultpiler = cashMultiplier;
    }

    getNext(what) {
        return this[what].nextValue()
    }
};

