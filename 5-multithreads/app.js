const { performance, PerformanceObserver } = require("perf_hooks");
const {
  createArray,
  splitArray,
  countDivisibleByThree,
} = require("./utils-array.js");
const { Worker } = require("worker_threads");
const { fork, spawn, exec } = require("child_process");
const path = require("path");

const cpuCount = require("os").cpus().length;

const performanceObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entity) => {
    console.log(`${entity.name}: ${entity.duration}`);
  });
});

performanceObserver.observe({ entryTypes: ["measure"] });

const workerFunction = (array) => {
  return new Promise((resolve, reject) => {
    let hasResult = false;

    const worker = new Worker("./worker.js", { workerData: { array } });

    worker.on("message", (msg) => {
      hasResult = true;
      resolve(msg);
    });

    worker.on("error", (error) => {
      reject(error);
    });

    worker.on("exit", (exitCode) => {
      if (exitCode !== 0) {
        reject(new Error("Worker завершился с ошибкой"));
        return;
      }

      if (!hasResult) {
        reject(new Error("Worker завершился без результата"));
        return;
      }

      console.log("Worker завершён:", exitCode);
    });
  });
};

const forkFunction = (array) => {
  return new Promise((resolve, reject) => {
    let hasResult = false;

    const child = fork("./fork.js");

    child.on("message", (result) => {
      child.disconnect();
      hasResult = true;
      resolve(result);
    });

    child.on("error", (error) => {
      child.disconnect();
      reject(error);
    });

    child.on("exit", (exitCode) => {
      if (exitCode !== 0) {
        reject(new Error("Fork завершился с ошибкой"));
        return;
      }

      if (!hasResult) {
        reject(new Error("Fork завершился без результата"));
        return;
      }

      console.log("Fork завершён:", exitCode);
    });

    child.send(array);
  });
};

const spawnFunction = (part) => {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(__dirname, "./spawn.js")]);

    let output = "";

    let outputError = "";

    child.stdout.setEncoding("utf8");

    child.stderr.setEncoding("utf8");

    child.stdout.on("data", (chunk) => {
      output += chunk;
    });

    child.stderr.on("data", (chunk) => {
      outputError += chunk;
    });

    child.on("close", (exitCode) => {
      if (exitCode !== 0) {
        reject(new Error(`Spawn завершился с ошибкой: ${outputError}`));
        return;
      }

      try {
        const arrResult = JSON.parse(output);
        resolve(arrResult);
      } catch (error) {
        reject(error);
      }
    });

    child.on("error", (error) => {
      reject(error);
    });

    child.stdin.end(JSON.stringify(part));
  });
};

const execFunction = (part) => {
  return new Promise((resolve, reject) => {
    const child = exec(
      "node exec.js",
      { cwd: __dirname },
      (error, stdout, stderr) => {
        try {
          if (error) {
            reject(new Error(stderr));
            return;
          }

          const result = JSON.parse(stdout);

          resolve(result);
        } catch (error) {
          reject(error);
        }
      },
    );

    child.stdin.end(JSON.stringify(part));
  });
};

const main = async () => {
  performance.mark(`start worker `);
  const resultWorker = await Promise.all(
    splitArray(createArray(), cpuCount).map((arr) => workerFunction(arr)),
  );
  performance.mark(`end worker `);
  performance.measure("worker", `start worker `, `end worker `);
  console.log(
    resultWorker.reduce((acc, workerResult) => acc + workerResult, 0),
  );

  performance.mark("start fork");
  const resultFork = await Promise.all(
    splitArray(createArray(), cpuCount).map((arr) => forkFunction(arr)),
  );
  console.log(resultFork.reduce((acc, forkResult) => acc + forkResult, 0));
  performance.mark("end fork");
  performance.measure("fork", "start fork", "end fork");

  performance.mark("start spawn");
  const resultSpawn = await Promise.all(
    splitArray(createArray(), cpuCount).map((arr) => spawnFunction(arr)),
  );
  console.log(resultSpawn.reduce((acc, spawnResult) => acc + spawnResult, 0));
  performance.mark("end spawn");
  performance.measure("spawn", "start spawn", "end spawn");

  performance.mark("start exec");
  const resultExec = await Promise.all(
    splitArray(createArray(), cpuCount).map((arr) => execFunction(arr)),
  );
  console.log(resultExec.reduce((acc, execResult) => acc + execResult, 0));
  performance.mark("end exec");
  performance.measure("exec", "start exec", "end exec");
};

performance.mark("start for");
const array = createArray();
const countForArray = countDivisibleByThree(array);
console.log(countForArray);
performance.mark("end for");
performance.measure("for", "start for", "end for");

main();
