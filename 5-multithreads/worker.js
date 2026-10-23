const { parentPort, workerData } = require("worker_threads");
const { countDivisibleByThree } = require("./utils-array");

parentPort.postMessage(countDivisibleByThree(workerData.array));
