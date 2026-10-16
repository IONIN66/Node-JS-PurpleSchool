const [_, __, first, second, operation] = process.argv;

const add = require("./add.js");
const multiply = require("./multiply.js");
const subtract = require("./subtract.js");
const divide = require("./divide.js");

const EventEmitter = require("node:events");
const myEmitter = new EventEmitter();

myEmitter.on("result", (value) => {
  console.log(value);
});

myEmitter.on("add", (a, b) => {
  myEmitter.emit("result", add(a, b));
});
myEmitter.on("multiply", (a, b) => {
  myEmitter.emit("result", multiply(a, b));
});
myEmitter.on("subtract", (a, b) => {
  myEmitter.emit("result", subtract(a, b));
});
myEmitter.on("divide", (a, b) => {
  myEmitter.emit("result", divide(a, b));
});

if (!myEmitter.emit(operation, first, second)) {
  console.log("Неизвестная операция");
}
