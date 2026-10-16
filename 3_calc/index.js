const [_, __, first, second, operation] = process.argv;

const add = require("./add.js");
const multiply = require("./multiply.js");
const subtract = require("./subtract.js");
const divide = require("./divide.js");

const calculator = (first, second, operation) => {
  switch (operation) {
    case "add": {
      return add(first, second);
    }
    case "multiply": {
      return multiply(first, second);
    }
    case "subtract": {
      return subtract(first, second);
    }
    case "divide": {
      return divide(first, second);
    }
    default: {
      return "Ошибка";
    }
  }
};

console.log(calculator(first, second, operation));
