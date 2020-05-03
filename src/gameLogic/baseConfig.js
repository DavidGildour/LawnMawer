import { buildRange } from './utils';

export const tickRateGen = buildRange(1000, x => x * 0.9, x => x > 5)
export const fieldSizeGen = buildRange(10, x => x + 10, x => x <= 400)
export const growthRateGen = buildRange(4, x => x + 2, x => x < 40)
export const mawerSpeedGen = buildRange(1, x => x + 1, x => x <= 40)