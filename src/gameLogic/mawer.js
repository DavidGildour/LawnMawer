import FieldEntity from "./fieldEntity";
export default class Mawer extends FieldEntity {
	constructor(color) {
		super(0, 0, color);
		this.mawedCells= [];
		this.speed = 1;
		this.grassStored = 0;
	}

	getPos() { return [this.x, this.y] }
	resetPos() { [this.x, this.y] = [0, 0]}
	getArea() {
		const { width, height } = this.size;
		const [ x0, y0 ] = this.getPos();
		const x_start = x0, x_end = x0 + width;
		const y_start = y0, y_end = y0 + height;
		const list = [];
		for (let i = 0; i < x_end - x_start; i++) {
			for (let j = 0; j < y_end - y_start; j++) {
				list.push([x_start + i, y_start + j]);
			}
		}
		return list;
}
	increaseSpeed(newSpeed) { this.speed = newSpeed }
	increaseSize(size) {
		this.size.width = size[0];
		this.size.height = size[1];
	}

	progress(fieldSize, resetCell) {
		const { width, height } = this.size;
		const [ x_max, y_max ] = resetCell;
		if (this.x === x_max && this.y === y_max) {
			this.y = 0;
			this.x = 0;
			return;
		}

		if ((Math.ceil(this.y / height)) % 2) {
			if (this.x > 0) {
				this.x = Math.max(this.x - width, 0);
			} else {
				this.y = Math.min(this.y + height, fieldSize - height);
			}
		} else {
			if (this.x < fieldSize - width) {
				this.x = Math.min(this.x + width, fieldSize - width);
			} else {
				this.y = Math.min(this.y + height, fieldSize - height);
			}
		}
	}
	
	maw(fieldSize) {
		let mawedCells = [];
		const { width, height } = this.size;
		const resetCell = [Math.ceil(fieldSize / height) % 2 ? fieldSize - width : 0, fieldSize - height]
		for (let i = 0; i < this.speed; i++) {
			mawedCells = mawedCells.concat(this.getArea())
			this.progress(fieldSize, resetCell);
		}
		return mawedCells;
	}

	harvest(mawedCells) {
		const values = mawedCells.map(cell => cell.value);
		mawedCells.forEach(cell => {cell.value = 0});
		this.grassStored += values.reduce((a, b) => a + b, 0);
	}

	getGrass() {
		const mawed = parseInt(this.grassStored);
		this.grassStored -= mawed;
		return mawed;
	}
}