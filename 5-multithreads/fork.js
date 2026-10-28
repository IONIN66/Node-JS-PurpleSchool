const { countDivisibleByThree } = require("./utils-array");

process.on("message", (data) => {
  process.send(countDivisibleByThree(data));
});
