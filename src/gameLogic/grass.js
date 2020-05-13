import FieldEntity from "./fieldEntity";
import { mapHSL } from "./utils";

export default class Grass extends FieldEntity {
	constructor(x, y, baseColor, grownColor) {
		super(x, y, baseColor);
		this.grownColor = grownColor;
		this.value = Math.random();
	}

	get color() {
		return mapHSL(this.value, this.baseColor, this.grownColor);
	}
};
