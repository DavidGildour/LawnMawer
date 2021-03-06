const THOU = 1000;
const suffixes = ["", "k", "M", "B", "T", "Qa", "Qi", "Sx"];
const numerals = ["", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion"];

export default class Muney {
	/* global BigInt */
	constructor(value=0) {
		this.value = BigInt(value);
	}

	/* Decorator for arithmetic operators */
	applicableToInt(func) {
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
	add = this.applicableToInt(other => new Muney(this.value + other));
	sub = this.applicableToInt(other => new Muney(this.value - other));
	div = this.applicableToInt(other => new Muney(this.value / other));
	mod = this.applicableToInt(other => new Muney(this.value % other));
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
	gt = this.applicableToInt(other => this.value > other);
	ge = this.applicableToInt(other => this.value >= other);
	lt = this.applicableToInt(other => this.value < other);
	le = this.applicableToInt(other => this.value <= other);
	eq = this.applicableToInt(other => this.value === other);
	ne = this.applicableToInt(other => this.value !== other);

	get log1000() {
		return Math.log(this.value.toString()) / Math.log(THOU);
	}

	toLongString() {
		if (this.value <= 0) return "0 $";
		const exp = Math.floor(this.log1000);
		const numeral = numerals[Math.max(exp - 1, 0)];
		const factor = BigInt(Math.pow(THOU, exp));
		const integerPart = this.value / factor;
		const decimalPart = this.value.toString().substr(integerPart.toString().length, 3);
		if (decimalPart === "" || parseInt(decimalPart) === 0) {
			return `${integerPart} ${numeral} $`;
		}
		return `${integerPart}.${decimalPart} ${numeral} $`;
	}

	toString() {
		if (this.value <= 0) return "0 $";
		const exp = Math.floor(this.log1000);
		const suffix = suffixes[exp];
		const factor = BigInt(Math.pow(THOU, exp));
		const integerPart = this.value / factor;
		const decimalPart = this.value.toString().charAt(integerPart.toString().length);
		if (["", "0"].includes(decimalPart)) {
			return `${integerPart}${suffix} $`;
		}
		return `${integerPart}.${decimalPart}${suffix} $`;
	}
};