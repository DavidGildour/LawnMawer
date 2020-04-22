export default class Cell {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.justMawed = false;
		this.value = Math.random();
	}
};
