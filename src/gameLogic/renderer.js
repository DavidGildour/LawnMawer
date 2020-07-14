import { hsl } from '../utils/utils';

export default class Renderer {
  constructor(ctx, debugMode) {
    this.ctx = ctx;
    this.ctx.canvas.width = 400;
    this.ctx.canvas.height = 400;
    this.field = null;
    this.debugMode = debugMode;
    this.cellSize = 0;
  }

  setField(field) {
    this.field = field;
    this.cellSize = this.ctx.canvas.width / field.size;
  }

  resizeField(newSize) {
    this.field.resize(newSize);
    this.cellSize = this.ctx.canvas.width / this.field.size;
    this.renderAll();
  }

  resizeMawer(newSize) {
    this.field.resizeMawer(newSize);
    this.rerenderStaleCells();
    this.renderMawer();
  }

  renderMawer() {
    this.renderCell(this.field.mawer);
  }

  renderAll() {
    this.renderCells(this.field.cells);
    this.renderMawer();
  }

  renderCells(cells) {
    for (let cell of cells) {
      this.renderCell(cell);
    }
  }

  update() {
    this.rerenderStaleCells();
    this.renderMawer();
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
        if (this.debugMode) {
          this.ctx.font = `${this.cellSize / 4}px Arial`;
          this.ctx.fillStyle = hsl(360, 100, 100);
          const value = cell.value || 0;
          this.ctx.fillText(
            value.toPrecision(2).replace(/\.?0+$/, ''),
            cell.x * this.cellSize + this.cellSize / 2,
            cell.y * this.cellSize + this.cellSize / 2
          );
        }
      }
    }
  }

  toggleValues(bool) {
    this.debugMode = bool;
    this.renderAll();
  }

  rerenderStaleCells() {
    // Draining until empty
    while (this.field.cellsToRerender.length) {
      this.renderCell(this.field.cellsToRerender.pop());
    }
  }
}
