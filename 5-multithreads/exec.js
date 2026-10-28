const { countDivisibleByThree } = require("./utils-array");

let input = "";

process.stdin.setEncoding("utf8");

process.stdin.on("data", (chunk) => {
  input += chunk;
});

process.stdin.on("end", () => {
  try {
    const part = JSON.parse(input);
    const count = countDivisibleByThree(part);

    process.stdout.write(JSON.stringify(count));
  } catch (error) {
    console.error("Не удалось обработать данные:", error);
    process.exitCode = 1;
  }
});
