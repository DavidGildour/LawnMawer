import Cell from './cell';
import { map, hsl, randInt } from './utils';
import Mawer from './mawer';

export default class Field {
	constructor(ctx, baseColor, size) {
		this.mawer = new Mawer();
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

	speedUpMawer() {
		this.mawer.increaseSpeed();
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
		// Draining mawedCells until empty
		while (this.mawedCells.length) {
			this.renderCell(this.mawedCells.pop(), this.baseColor);
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
		const [mawX, mawY] = this.mawer.getPos();
		this.renderCell(this.getCell(mawX, mawY), [0, 100, 40]);
	}

	renderAll() {
		for (let cell of this.cells) {
			this.renderCell(cell, this.baseColor);
		}
		this.maw();
		this.renderMawer()
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
