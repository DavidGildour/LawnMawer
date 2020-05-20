import FieldEntity from "./fieldEntity";
import { breakdownNumber } from "./utils"

export default class Mawer extends FieldEntity {
    constructor(color) {
				super(0, 0, color);
        this.mawedCells= [];
        this.speed = 1;
		this.size = 1;
		this.grassStored = 0;
	}

    getPos = () => [this.x, this.y]

    progress(fieldSize) {
		if (this.y % 2) {
			if (this.x > 0) {
				this.x--;
			} else {
				this.y++;
			}
		} else {
			if (this.x + 1 < fieldSize) {
				this.x++;
			} else {
				this.y++;
			}
		}
		if (this.y + 1 > fieldSize) {
			this.y = 0;
			this.x = 0;
		}
	}
	
	maw = (fieldSize) => {
		let mawedCells = [];
		for (let i = 0; i < this.speed; i++) {
			mawedCells.push(this.getPos())
			this.progress(fieldSize)
		}
		return mawedCells;
	}

	harvest = mawedCells => {
		const values = mawedCells.map(cell => cell.value);
		mawedCells.forEach(cell => {cell.value = 0});
		this.grassStored += values.reduce((a, b) => a + b, 0);
	}

	getGrass = () => {
		const mawed = parseInt(this.grassStored);
		this.grassStored -= mawed;
		return mawed;
	}
    
    increaseSpeed() {
        this.speed += 1
    }
}