import Config from '../config';
import Muney from '../../utils/money';

export default new Config({
  name: 'grassField',
  baseColor: [113, 100, 40],
  grownColor: [113, 100, 20],
  mawerColor: [0, 100, 40],
  cashMultiplier: 1,
  fieldSizeBasePrice: new Muney(1000),
  growthRateBasePrice: new Muney(15),
  tickRateBasePrice: new Muney(5),
  mawerSpeedBasePrice: new Muney(50),
  growthSpeedBasePrice: new Muney(900),
  mawerSizeBasePrice: new Muney(50),
});
