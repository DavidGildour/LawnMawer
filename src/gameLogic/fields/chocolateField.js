import Config from '../config'
import Muney from '../../utils/money'


export default new Config({
    baseColor: [60, 100, 90],
    grownColor: [30, 50, 40],
    mawerColor: [204, 100, 50],
    cashMultiplier: 1,
    fieldSizeBasePrice: new Muney(1000),
    growthRateBasePrice: new Muney(15),
    tickRateBasePrice: new Muney(5),
    mawerSpeedBasePrice: new Muney(50),
    growthSpeedBasePrice: new Muney(900),
    mawerSizeBasePrice: new Muney(50),
  });
