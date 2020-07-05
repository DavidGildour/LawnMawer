/**
 * A helper function for creating a string which can be used in CSS context, representing a HSL color.
 *
 * @param {Number} h A hue value in range 0-360 degrees
 * @param {Number} s A saturation value in range 0%-100%
 * @param {Number} l A lightness value in range 0%-100%
 *
 * @return {String} A string representation of HSL color value.
 */
export function hsl(h, s, l) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * A helper function used to map a number from a given range (a, b) to desired range (c, d).
 *
 * @param {Number} val A number to be mapped
 * @param {Number} s1  Start of a base range from which to map
 * @param {Number} e1  End of a base range from which to map
 * @param {Number} s2  Start of a new range to which to map
 * @param {Number} e2  End of a new range to which to map
 *
 * @return {Number} A result of the specified mapping.
 */
export function map(val, s1, e1, s2, e2) {
  const ratio = (e2 - s2) / (e1 - s1);
  return val * ratio + s2;
}

/**
 * @typedef {[Number, Number, Number]} HSLColor
/**
 * Given a float value in range [0, 1] and two HSLColors, returns an HSLColor that is a color between these two.
 * 
 * @param {Number} val 
 * @param {HSLColor} c1 
 * @param {HSLColor} c2 
 * @return {HSLColor}
 */
export function mapHSL(val, c1, c2) {
  return [
    map(val, 0, 1, c1[0], c2[0]),
    map(val, 0, 1, c1[1], c2[1]),
    map(val, 0, 1, c1[2], c2[2]),
  ];
}

/**
 * Returns a random integer from a given range [a, b).
 *
 * @param {Number} min   Either a lower limit (inclusive) of a desired range, or a upper range (exclusive) of a range (0, min)
 * @param {Number} [max] An optional upper limit of a desired range
 *
 * @return {Number} A random integer from the specified range.
 */
export function randInt(min, max) {
  if (max !== undefined) {
    return Math.floor(min + Math.random() * (max - min));
  }
  return Math.floor(Math.random() * min);
}

/* NOT USED RIGHT NOW
export function randSample(array) {
    const size = array.length;
    const i = randInt(0, size)
    const sample = array[i];
    array.splice(i, 1);
    return sample
}
*/

/**
 * @typedef {Object} YieldValue
 * @property {*}       currentValue
 * @property {Boolean} final
 */

/**
 * A generator function for creating finite (or infinite) ranges of given types.
 *
 * Works in two ways: when presented with a single array-like arguments, returns a generator yielding each element of
 * the array, otherwise, returns a generator of a specified sequence, given a first term, a formula, and
 * optionally a condition describing a limit of the sequence.
 *
 * @param {Array|*}        base  Either the first element yielded by the generator that serves as a base for calculating
 *                               the next terms, or any array from which the generator should be created.
 * @param {Function} [stepFunc]  A function used to calculate the next value yielded by the generator. Takes a single argument,
 *                               which is the last value yielded by the generator.
 * @param {Function} [condition] An optional function used to determine when to stop yielding new values. Takes a single argument,
 *                               which is the last value yielded by the generator. If not provided, returns an infinite generator.
 *
 *
 * @yield {YieldValue} An object with the next value in a given sequence and a flag determining if this is the last one.
 *
 * EXAMPLE USAGE:
 * - A range of integers from 0 to 10 (exclusive):
 *     buildRange(0, x => x + 1, x => x < 10)
 *     yields:
 *     {currentValue: 0, final: false},
 *     {currentValue: 1, final: false},
 *     ...
 *     {currentValue: 8, final: false},
 *     {currentValue: 9, final: true}
 */
export function* buildRange(base, stepFunc, condition) {
  let currentValue, final;
  if (base instanceof Array && !stepFunc) {
    while (base) {
      currentValue = base.shift();
      final = base.length === 0;
      yield { currentValue, final };
    }
  } else {
    if (!condition) {
      condition = () => true;
    }
    currentValue = base;
    while (condition(currentValue)) {
      const nextValue = stepFunc(currentValue);
      final = !condition(nextValue);
      yield { currentValue, final };
      currentValue = nextValue;
    }
  }
}

/**
 * A helper function which serves as a wrapper around generator's `next()` method. Should be used with the generators
 * returned by `buildRange` function described above.
 *
 * @param {Generator} generator A generator conforming to the interface of `buildRange`.
 *
 * @return {[*, Boolean]} A tuple which is a mapping of generator's yielded value.
 *
 */
export function getNextValue(generator) {
  const val = generator.next().value;
  return [val.currentValue, val.final];
}
