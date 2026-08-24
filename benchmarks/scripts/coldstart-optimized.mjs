const realLog = console.log;
console.log = () => {};

const t0 = performance.now();
const Logger = (await import("../../facades/Logger.js")).default;
Logger.info("boot");

const t1 = performance.now();
console.log = realLog;
process.stderr.write(String(t1 - t0));
