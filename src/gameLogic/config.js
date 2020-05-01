import { tickRate, fieldSize, growthRate } from './baseConfig';

export default class Config {
    constructor(baseColor, multiplier, basePrices) {
        this.baseColor = baseColor;
        this.size = fieldSize;
        this.tickRate = tickRate;
        this.growthRate = growthRate;
        this.multiplier = multiplier;
        this.basePrices = basePrices;
    }

    getNext(what) {
        return this[what].nextValue()
    }
};

