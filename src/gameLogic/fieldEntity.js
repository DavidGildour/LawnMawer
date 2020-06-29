export default class FieldEntity {
	constructor(x, y, color) {
		this.x = x;
		this.y = y;
		this.size = { width: 1, height: 1 }
		this.baseColor = color;
	}

	get color() {
		return this.baseColor;
	}
};
