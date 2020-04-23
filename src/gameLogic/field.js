import Cell from './cell';
import { map, hsl } from './utils';

export default class Field {
	constructor(ctx, baseColor, size) {
		this.mawPos = [0, 0];
		this.size = size;
		this.ctx = ctx;
		this.baseColor = baseColor;
		this.cellSize = ctx.canvas.width / size;
		this.cells = [];
		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				this.cells.push(new Cell(i, j));
			}
		}
	}

	getCell(x, y) {
		return this.cells[x*this.size + y]
	}

	update() {
		for (let cell of this.cells) {
			if (cell.justMawed) {
				this.renderCell(cell, this.baseColor);
				cell.justMawed = false;
			} else if (cell.value < 1 && Math.random() < 0.1) {
				cell.value = Math.min(cell.value + 0.06, 1);
				this.renderCell(cell, this.baseColor);
			}
		}
		this.renderMawer();
		this.progressMawer();
	}

	renderMawer() {
		const [x, y] = this.mawPos;
		const mawCell = this.getCell(x, y);
		mawCell.justMawed = true;
		mawCell.value = 0;
		this.renderCell(mawCell, [0, 100, 40]);
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
		  if (x+1 < this.size) {
			x++;
		  } else {
			y++; 
		  }
		}
		if (y+1 > this.size) {
		  y = 0;
		  x = 0;
		}
		this.mawPos = [x, y];
	}

	renderAll() {
		for (let cell of this.cells) {
			this.renderCell(cell, this.baseColor);
		}
		this.renderMawer();
	}

	renderCell(cell, c) {
		if (c.length === 2) {
			const fullColor = [...c, map(1-cell.value, 0, 1, 20, 40)];
			this.ctx.fillStyle = hsl(...fullColor);
		} else {
			this.ctx.fillStyle = hsl(...c);
		}
		this.ctx.fillRect(
			cell.x*this.cellSize, 
			cell.y*this.cellSize, 
			this.cellSize, 
			this.cellSize
		);
	}
}
