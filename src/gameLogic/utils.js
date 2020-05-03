export function hsl(h, s, l) {
	return `hsl(${h}, ${s}%, ${l}%)`
};

export function map(val, s1, e1, s2, e2) {
	const ratio = (e2 - s2) / (e1 - s1);
	return val * ratio + s2;
};

export function randInt(min, max) {
		if (max !== undefined) {
			return Math.floor(min + Math.random() * (max - min));
		}
		return Math.floor(Math.random() * min);
}

export function randSample(array) {
    const size = array.length;
    const i = randInt(0, size)
    const sample = array[i];
    array.splice(i, 1);
    return sample
}
/**  
    A generic function for creating (potentially) vast Arrays of numerical (or perhaps other)
    values. 
    Parameters:
        @param {*} base - the first element in the resulting Array.
        @param {Function} stepFunc - a function described as such:
            stepFunc(currentValue: Any) -> Any
            Parameters:
                <currentValue: Any> - a current value, which is the last one added
                    to the resulting array.

            Returns: Any - next value to be added to the array.
        @param {Function} condition - a function used to determine when to stop adding new values
            to the array. Described as such:
            condition(currentValue: Any, array: Array) -> Boolean
            Parameters:
                <currentValue: Any> - a current value, which is the last one added
                    to the resulting array.
                <array: Array> - current state of the calculated array.

            Returns: Boolean - a boolean value to determine if the calculated array is
                finished.

    Returns: Array - an array of values conforming to the provided conditions.

    EXAMPLE USAGE:
        - A range of integers from 0 to 10 (exclusive):
            buildRange(0, x => x + 1, x => x < 10)
            ===
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        - 100 first values of a geometric sequence `a(n) = a(n-1) * 0.9; a(0) = 1`:
            buildRange(1, x => x * 0.9, (x, arr) => arr.length < 100)
            ===
            [1, 0.9, 0.81, 0.7290000000000001, 0.6561000000000001, ..., 0.000029512665430652825]
*/
export function buildRange(base, stepFunc, condition) {
    
    const range = [];
    let currentValue = base;
    while (condition(currentValue, range)) {
        range.push(currentValue);
        currentValue = stepFunc(currentValue);
    }
    return range;
}

const THOU = 1000;
const suffixes = [ "", "k", "M", "B", "T", "Qa", "Qi", "Sx"];

export class Muney {
	/* global BigInt */
	constructor(value=0) {
		this.value = BigInt(value);
	}

	appliableToInt(func) {
		return function(other, ...args) {
			if (other instanceof Muney) {
				return func(other.value, ...args);
			} else if (other instanceof BigInt) {
				return func(other);
			}
			return func(BigInt(other), ...args);
		};
	}

	/* Arithmetic Operators */
	add = this.appliableToInt(other => new Muney(this.value + other));
	sub = this.appliableToInt(other => new Muney(this.value - other));
	div = this.appliableToInt(other => new Muney(this.value / other));
	mod = this.appliableToInt(other => new Muney(this.value % other));
	mult = (float) => {
		let [int, decimal] = float.toString().split(".");
		let decimalPart;
		if (decimal) {
			const decExp = Math.pow(10, decimal.length);
			[int, decimal] = [int, decimal].map(BigInt);
			decimalPart = this.value * decimal / BigInt(decExp);
		} else {
			[int, decimalPart] = [BigInt(int), BigInt(0)];
		}
		return new Muney(this.value * int + decimalPart);
	};

	/* Logical Operators */
	gt = this.appliableToInt(other => this.value > other);
	ge = this.appliableToInt(other => this.value >= other);
	lt = this.appliableToInt(other => this.value < other);
	le = this.appliableToInt(other => this.value <= other);
	eq = this.appliableToInt(other => this.value === other);
	ne = this.appliableToInt(other => this.value !== other);

	log1000() {
		return Math.log(this.value.toString()) / Math.log(THOU);
	}

	toString() {
		if (this.value <= 0) return "0 $";
		const exp = Math.floor(this.log1000());
		const suffix = suffixes[exp];
		const factor = BigInt(Math.pow(THOU, exp));
		const integerPart = this.value / factor;
		const padding = 3 - integerPart.toString().length;
		const decimalPart = ("0".repeat(padding) + this.value.toString()).charAt(3);
		if (["", "0"].includes(decimalPart)) {
			return `${integerPart}${suffix} $`;
		}
		return `${integerPart}.${decimalPart}${suffix} $`;
	}
};