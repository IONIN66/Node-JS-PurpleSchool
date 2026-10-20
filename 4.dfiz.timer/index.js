const [_, __, hours, minutes, seconds] = process.argv;

function convertToMilliseconds(hours, minutes, seconds) {
  const h = parseInt(hours) || 0;
  const m = parseInt(minutes) || 0;
  const s = parseInt(seconds) || 0;

  return (h * 3600 + m * 60 + s) * 1000;
}

const totalMilliseconds = convertToMilliseconds(hours, minutes, seconds);

setTimeout(() => {
  console.log("таймер прозвонил");
}, totalMilliseconds);
