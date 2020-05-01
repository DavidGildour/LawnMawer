import { buildRange } from './utils';



class Upgrade {
    constructor(name, basePrice, generator, priceMultiplier) {
        this.name = name;
        this.basePrice = basePrice;
        this.generator = generator;
        this.priceMultiplier = priceMultiplier;
        this.currentValue = this.generator.next().value
        this.currentPrice = basePrice;
    }

    nextValue = () => {
        let nextValue = this.generator.next().value;
        if (!nextValue) {
            this.currentPrice = Infinity;
        } else {
            this.currentValue = nextValue;
            this.currentPrice = Math.ceil(this.currentPrice * this.priceMultiplier);
        }
        return this.currentValue;
    }
}


export const tickRate = new Upgrade('tickRate', 8, buildRange(1000, x => x * 0.9, x => x > 5), 1.2)
export const fieldSize = new Upgrade('fieldSize', 5, buildRange(10, x => x + 10, x => x <= 400), 1.2);
export const growthRate = new Upgrade('growthRate', 10, buildRange(4, x => x + 2, x => x < 40), 1.2);