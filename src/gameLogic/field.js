import Grass from './grass';
import { hsl, randInt } from './utils';
import Mawer from './mawer';

const GROWTH_PER_TICK = 0.04;

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
			overallCellsLost: 0,
			grassInMawer: this.getStoredGrass(),
			grassMawed: 0,
			showValues: false
		}
	}

	getDebugStats = () => {
		return {...this.debugStats, grassInMawer: this.getStoredGrass()};
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
		this.initiate();
	}

	speedUpMawer() {
		this.mawer.increaseSpeed();
	}

	getStoredGrass() {
		return this.mawer.grassStored
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

	showValues(bool) {
		this.debugStats.showValues = bool;
		this.renderAll();
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
		this.renderMawer();
		const mawedCells = this.mawer.maw(this.size);
		this.mawedCells = mawedCells.map(pos => this.getCell(...pos))
		this.mawer.harvest(this.mawedCells)
		const valueMawed = this.mawer.getGrass();
		this.debugStats.grassMawed += valueMawed;
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
		this.renderMawer();
	}

	initiate() {
		this.renderAll();
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
		if (this.debugStats.showValues) {
			this.ctx.font = `${this.cellSize / 4}px Arial`;
			this.ctx.fillStyle = hsl(360, 100, 100);
			const value = cell.value || 0;
			this.ctx.fillText(value.toPrecision(2).replace(/\.?0+$/, ""), (cell.x * this.cellSize) + (this.cellSize / 2),
				cell.y * this.cellSize + (this.cellSize / 2))
		}
	}
}
