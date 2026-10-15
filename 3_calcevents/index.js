const [_, __, first, second, operation] = process.argv;

const add = require("./add.js");
const multiply = require("./multiply.js");
const subtract = require("./subtract.js");
const divide = require("./divide.js");

const myEvent = require("events");
const myEmitter = new myEvent();

myEmitter.addListener("add", add);
myEmitter.addListener("multiply", multiply);
myEmitter.addListener("subtract", subtract);
myEmitter.addListener("divide", divide);

myEmitter.emit(operation, first, second);
