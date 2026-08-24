// Baseline = the previously published npm release, installed under the local alias
// `@bejibun-baseline/logger` by `bun run install-deps` (see benchmarks/package.json).
// This is a real, unmodified install from npm, not a vendored source copy.
const realLog = console.log;
console.log = () => {}; // silence output, we only care about timing here

const t0 = performance.now();
const Logger = (await import("@bejibun-baseline/logger")).default;
Logger.info("boot");

const t1 = performance.now();
console.log = realLog;
process.stderr.write(String(t1 - t0));
