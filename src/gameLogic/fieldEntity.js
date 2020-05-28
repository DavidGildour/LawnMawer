export default class FieldEntity {
	constructor(x, y, color) {
		this.x = x;
		this.y = y;
		this.baseColor = color;
	}

	get color() {
		return this.baseColor;
	}
};
