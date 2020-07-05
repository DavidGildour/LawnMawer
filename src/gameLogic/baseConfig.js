import { buildRange } from '../utils/utils';

export const tickRateGen = () =>
  buildRange(
    1000,
    x => x * 0.9,
    x => x > 5
  );
export const fieldSizeGen = () =>
  buildRange([10, 16, 20, 25, 40, 50, 80, 100, 200, 400]);
export const growthRateGen = () =>
  buildRange(
    4,
    x => x + 2,
    x => x <= 40
  );
export const mawerSpeedGen = () =>
  buildRange(
    1,
    x => x + 1,
    x => x <= 40
  );
export const growthSpeedGen = () =>
  buildRange(
    0.05,
    x => x + 0.05,
    x => x <= 0.3
  );
export const mawerSizeGen = () =>
  buildRange([1, 1], ([w, h]) => (w === h ? [++w, h] : [w, ++h]));
