import Grass from './grass';
import { hsl, randInt } from './utils';
import Mawer from './mawer';

const GROWTH_PER_TICK = 0.03;

export default class Field {
	constructor(ctx, baseColor, grownColor, mawerColor, size) {
		this.mawer = new Mawer(mawerColor);
		this.mawedCells = [];
		this.size = size;
		this.ctx = ctx;
		this.baseColor = baseColor;
		this.grownColor = grownColor;
		this.cellSize = ctx.canvas.width / size;
		this.cells = this.initField();
		this.debugStats = {
			grownCellsThisTick: 0,
			overallCellsLost: 0
		}
	}

	getCell(x, y) {
		return this.cells[x * this.size + y];
	}

	initField() {
		const cells = [];
		for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				cells.push(new Grass(i, j, this.baseColor, this.grownColor));
			}
		}
		return cells;
	}

	resize(newSize) {
		this.size = newSize;
		this.cellSize = this.ctx.canvas.width / newSize;
		this.cells = this.initField();
		this.renderAll();
	}

	speedUpMawer() {
		this.mawer.increaseSpeed();
	}

	growTiles(quantity) {
		let totalGrown = 0;
		for (let i = 0; i < quantity; i++) {
			const [x, y] = [randInt(this.size), randInt(this.size)];
			const cell = this.getCell(x, y);
			if (cell.value < 1) {
				cell.value = Math.min(cell.value + GROWTH_PER_TICK, 1);
				this.renderCell(cell);
				totalGrown++;
			}
		}
		this.debugStats.grownCellsThisTick = totalGrown;
		this.debugStats.overallCellsLost += quantity - totalGrown;

	}

	renderMawedCells() {
		// Draining mawedCells until empty
		while (this.mawedCells.length) {
			this.renderCell(this.mawedCells.pop());
		}
	}

	update(growthRate) {
		this.renderMawedCells();
		this.growTiles(growthRate);
		let valueMawed = 0;
		this.renderMawer();
		for (let i = 0; i < this.mawer.speed; i++) {
			valueMawed += this.maw();
			this.mawer.progress(this.size);
		}
		return valueMawed;
	}

	maw() {
		const [x, y] = this.mawer.getPos();
		const mawCell = this.getCell(x, y);
		this.mawedCells.push(mawCell);
		const valueMawed = mawCell.value;
		mawCell.value = 0;
		return valueMawed;
	}

	renderMawer() {
		this.renderCell(this.mawer);
	}

	renderAll() {
		for (let cell of this.cells) {
			this.renderCell(cell);
		}
		this.maw();
		this.renderMawer()
	}

	renderCell(cell) {
		this.ctx.fillStyle = hsl(...cell.color);
		this.ctx.fillRect(
			cell.x * this.cellSize,
			cell.y * this.cellSize,
			this.cellSize,
			this.cellSize
		);
	}
}
