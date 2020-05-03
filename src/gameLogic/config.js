import { tickRateGen, fieldSizeGen, growthRateGen, mawerSpeedGen } from './baseConfig';

export default class Config {
    constructor(baseColor, cashMultiplier) {
        this.baseColor = baseColor;
        this.fieldSizeGen = fieldSizeGen;
        this.tickRateGen = tickRateGen;
        this.growthRateGen = growthRateGen;
        this.mawerSpeedGen = mawerSpeedGen;
        this.cashMultpiler = cashMultiplier;
    }

    getNext(what) {
        return this[what].nextValue()
    }
};

