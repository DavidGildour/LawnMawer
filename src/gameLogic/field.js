import Cell from './cell';
import { map, hsl, randInt } from './utils';

export default class Field {
	constructor(ctx, baseColor, size) {
		this.mawPos = [0, 0];
		this.mawedCells = [];
		this.size = size;
		this.ctx = ctx;
		this.baseColor = baseColor;
		this.cellSize = ctx.canvas.width / size;
		this.cells = this.initField();
		this.stats = {
			grownCellsThisTick: 0,
			overallCellsLost: 0
		}
	}

	getCell(x, y) {
		return this.cells[x * this.size + y]
	}

	initField() {
		const cells = [];
		for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				cells.push(new Cell(i, j));
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

	growTiles(quantity) {
		let totalGrown = 0;
		// this is a bottle neck - try to remove it
		for (let i = 0; i < quantity; i++) {
			const [x, y] = [randInt(this.size), randInt(this.size)];
			const cell = this.getCell(x, y);
			if (cell.value < 1) {
				cell.value = Math.min(cell.value + 0.1, 1);
				this.renderCell(cell, this.baseColor);
				totalGrown++;
			}
		}
		this.stats.grownCellsThisTick = totalGrown;
		this.stats.overallCellsLost += quantity - totalGrown;

	}

	renderMawedCells() {
		for (const mawedCell of this.mawedCells) {
			this.renderCell(mawedCell, this.baseColor);
		}
	}

	update(growthRate) {
		this.renderMawedCells();
		this.growTiles(growthRate);
		const valueMawed = this.mawAndRender();
		this.progressMawer();
		return valueMawed;
	}

	mawAndRender() {
		const [x, y] = this.mawPos;
		const mawCell = this.getCell(x, y);
		this.mawedCells = [mawCell];
		const valueMawed = mawCell.value;
		mawCell.value = 0;
		this.renderCell(mawCell, [0, 100, 40]);
		return valueMawed;
	}

	progressMawer() {
		let [x, y] = this.mawPos;
		if (y % 2) {
			if (x > 0) {
				x--;
			} else {
				y++;
			}
		} else {
			if (x + 1 < this.size) {
				x++;
			} else {
				y++;
			}
		}
		if (y + 1 > this.size) {
			y = 0;
			x = 0;
		}
		this.mawPos = [x, y];
	}

	renderAll() {
		for (let cell of this.cells) {
			this.renderCell(cell, this.baseColor);
		}
		this.mawAndRender();
	}

	renderCell(cell, c) {
		if (c.length === 2) {
			const fullColor = [...c, map(1 - cell.value, 0, 1, 20, 40)];
			this.ctx.fillStyle = hsl(...fullColor);
		} else {
			this.ctx.fillStyle = hsl(...c);
		}
		this.ctx.fillRect(
			cell.x * this.cellSize,
			cell.y * this.cellSize,
			this.cellSize,
			this.cellSize
		);
	}
}
