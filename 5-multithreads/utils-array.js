const createArray = () => {
  const arr = [];

  for (let index = 1; index < 300001; index++) {
    arr.push(index);
  }

  return arr;
};

function splitArray(array, parts) {
  if (!Number.isInteger(parts) || parts <= 0) {
    throw new RangeError("parts должно быть положительным целым числом");
  }

  if (array.length === 0) return [];

  const count = Math.min(parts, array.length);
  const result = [];

  for (let i = 0; i < count; i++) {
    const start = Math.floor((i * array.length) / count);
    const end = Math.floor(((i + 1) * array.length) / count);

    result.push(array.slice(start, end));
  }

  return result;
}

const isDivisibleByThree = (number) => {
  return number % 3 === 0;
};

const countDivisibleByThree = (array) => {
  let count = 0;

  for (const number of array) {
    if (isDivisibleByThree(number)) {
      count += 1;
    }
  }

  return count;
};

module.exports = {
  createArray,
  splitArray,
  countDivisibleByThree,
};
