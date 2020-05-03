export default class Mawer {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.mawedCells= [];
        this.speed = 1;
        this.size = 1;
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
    
    increaseSpeed() {
        this.speed += 1
    }
}