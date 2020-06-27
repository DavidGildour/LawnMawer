import Grass from './grass';
import { hsl, randInt } from '../utils/utils';
import Mawer from './mawer';

const GROWTH_PER_TICK = 0.1;

export default class Field {
	constructor(ctx, baseColor, grownColor, mawerColor, size) {
		this.mawer = new Mawer(mawerColor);
		this.cellsToRerender = [];
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
		this.renderAll();
	}

	speedUpMawer() {
		this.mawer.increaseSpeed();
	}

	resizeMawer(size) {
		const cellsToRerender = this.mawer.getArea().map(pos => this.getCell(...pos));
		this.mawer.increaseSize(size);
		this.mawer.resetPos();
		this.renderCells(cellsToRerender);
		this.renderMawer();
	}

	getStoredGrass() {
		return this.mawer.grassStored;
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

	toggleValues(bool) {
		this.debugStats.showValues = bool;
		this.renderAll();
	}

	rerenderStaleCells() {
		// Draining until empty
		while (this.cellsToRerender.length) {
			this.renderCell(this.cellsToRerender.pop());
		}
	}

	update(growthRate) {
		const mawedCells = this.mawer.maw(this.size).map(pos => this.getCell(...pos));
		this.addCellsToRerender(mawedCells);
		this.mawer.harvest(mawedCells)
		const valueMawed = this.mawer.getGrass();
		this.debugStats.grassMawed += valueMawed;

		this.rerenderStaleCells();
		this.growTiles(growthRate);
		this.renderMawer();
		return valueMawed;
	}

	addCellsToRerender(cells) {
		this.cellsToRerender = this.cellsToRerender.concat(cells);
	}

	renderMawer() {
		this.renderCell(this.mawer);
	}

	renderAll() {
		this.renderCells(this.cells);
		this.renderMawer();
	}

	renderCells(cells) {
		for (let cell of cells) {
			this.renderCell(cell);
		}
	}

	renderCell(cell) {
		const { width, height } = cell.size;
		for (let i = 0; i < height; i++) {
			for (let j = 0; j < width; j++) {
				this.ctx.fillStyle = hsl(...cell.color);
				this.ctx.fillRect(
					(cell.x + j) * this.cellSize,
					(cell.y + i) * this.cellSize,
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
	}
}
