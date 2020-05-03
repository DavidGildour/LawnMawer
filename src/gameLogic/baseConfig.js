import { buildRange } from '../utils/utils';

export const tickRates = buildRange(1000, x => x*0.9, x => x > 5);
export const fieldSizes = [10, 20, 40, 80, 100, 200, 400];
export const growthRates = buildRange(4, x => x+2, x => x < 40);