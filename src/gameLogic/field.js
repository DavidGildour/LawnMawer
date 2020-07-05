import Grass from './grass';
import { hsl, randInt } from '../utils/utils';
import Mawer from './mawer';

export default class Field {
  constructor(baseColor, grownColor, mawerColor, size) {
    this.mawer = new Mawer(mawerColor);
    this.cellsToRerender = [];
    this.size = size;
    this.baseColor = baseColor;
    this.grownColor = grownColor;
    this.cells = this.initField();
    this.growthPerTick = 0.05;
    this.isTickSet = false;
    this.debugStats = {
      grownCellsThisTick: 0,
      overallCellsLost: 0,
      grassInMawer: this.getStoredGrass(),
      grassMawed: 0,
    };
  }

  getDebugStats = () => {
    return { ...this.debugStats, grassInMawer: this.getStoredGrass() };
  };

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
    this.cells = this.initField();
    this.renderAll();
  }

  speedUpMawer(newSpeed) {
    this.mawer.increaseSpeed(newSpeed);
  }

  setGrowthSpeed(newSpeed) {
    this.growthPerTick = newSpeed;
  }

  resizeMawer(size) {
    this.addCellsToRerender(
      this.mawer.getArea().map(pos => this.getCell(...pos))
    );
    this.mawer.increaseSize(size);
    this.mawer.resetPos();
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
        cell.value = Math.min(cell.value + this.growthPerTick, 1);
        this.cellsToRerender.push(cell);
        totalGrown++;
      }
    }
    this.debugStats.grownCellsThisTick = totalGrown;
    this.debugStats.overallCellsLost += quantity - totalGrown;
  }

  update(growthRate) {
    const mawedCells = this.mawer
      .maw(this.size)
      .map(pos => this.getCell(...pos));
    this.addCellsToRerender(mawedCells);
    this.mawer.harvest(mawedCells);
    const valueMawed = this.mawer.getGrass();
    this.debugStats.grassMawed += valueMawed;
    this.growTiles(growthRate);

    return valueMawed;
  }

  addCellsToRerender(cells) {
    this.cellsToRerender = this.cellsToRerender.concat(cells);
  }
}
