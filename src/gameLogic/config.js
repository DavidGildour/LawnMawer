export default class Config {
    constructor(baseColor, multiplier) {
        this.baseColor = baseColor;
        this.sizes = [10, 20, 40, 80, 100, 200, 400];
        this.tickRates = [1000, 900, 800, 700, 500, 250, 100, 75, 50, 25, 10, 5];
        this.multiplier = multiplier;
    }

    getNext(what, current) {
        const possibilities = this[what + "s"];
        const i = possibilities.indexOf(current);
        if (i >= possibilities.length) return null;
        return possibilities[i+1];
    }
};