import { tickRates, fieldSizes, growthRates } from './baseConfig';

export default class Config {
    constructor(baseColor, multiplier, basePrices) {
        this.baseColor = baseColor;
        this.sizes = fieldSizes;
        this.tickRates = tickRates;
        this.growthRates = growthRates;
        this.multiplier = multiplier;
        this.basePrices = basePrices;
    }

    getNext(what, current) {
        const possibilities = this[what + "s"];
        const i = possibilities.indexOf(current);
        if (i >= possibilities.length) return null;
        return possibilities[i+1];
    }
};