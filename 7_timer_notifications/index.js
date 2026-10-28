import notifier from "node-notifier";

const args = process.argv.slice(2);
const secondsPerUnit = { h: 3600, m: 60, s: 1 };
let totalSeconds = 0;
let valid = args.length > 0;

for (const arg of args) {
  const match = /^(\d+)([hms])$/.exec(arg);
  console.log("match: ", match);

  if (!match) {
    valid = false;
    break;
  }

  totalSeconds += Number(match[1]) * secondsPerUnit[match[2]];
}

const totalMilliseconds = totalSeconds * 1000;

if (
  !valid ||
  totalMilliseconds === 0 ||
  !Number.isSafeInteger(totalMilliseconds)
) {
  console.error("Укажите время в формате: node index.js 1h 5m 10s");
  process.exitCode = 1;
} else if (totalMilliseconds > 2_147_483_647) {
  console.error("Слишком большой интервал для одного таймера");
  process.exitCode = 1;
} else {
  setTimeout(() => {
    notifier.notify(
      {
        title: "Тест",
        message: "Уведомление работает",
        sound: "Glass",
      },
      (error, response, metadata) => {
        console.log({ error, response, metadata });
      },
    );
  }, totalMilliseconds);
}
