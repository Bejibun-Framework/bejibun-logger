/**
 * Throughput benchmark - the hot path.
 *
 * Measures raw call speed for the three public entry points that run on every log line:
 * Logger.info(), setContext().warn(), and Logger.separator(). Logging output is silenced
 * so we're measuring the logger's own compute (timestamp formatting, coloring, string
 * building), not terminal/pipe I/O speed.
 *
 * Note: Logger.info/warn/separator write via console.log, not process.stdout.write
 * directly. Node's console has a fast path that writes straight to the fd when stdout
 * is a TTY, bypassing process.stdout.write entirely -- so console.log itself has to be
 * stubbed (stubbing process.stdout.write alone silences nothing on an interactive
 * terminal, only when piped/redirected).
 *
 * Baseline is the previously published npm release (installed under the local alias
 * `@bejibun-baseline/logger` by `bun run install-deps`), not a vendored source copy.
 *
 * Run: bun run scripts/throughput.mjs
 */
import {updateReadmeSection} from "./readme-writer.mjs";

const ITERATIONS = 200_000;
const WARMUP = 5_000;

async function bench(modulePath) {
    const Logger = (await import(modulePath)).default;

    const realLog = console.log;
    console.log = () => {};

    for (let i = 0; i < WARMUP; i++) Logger.info("warmup message");

    const t0 = performance.now();
    for (let i = 0; i < ITERATIONS; i++) Logger.info("benchmark message number " + i);
    const t1 = performance.now();

    const t2 = performance.now();
    for (let i = 0; i < ITERATIONS; i++) Logger.setContext("Bench").warn("ctx message");
    const t3 = performance.now();

    const t4 = performance.now();
    for (let i = 0; i < ITERATIONS; i++) Logger.separator();
    const t5 = performance.now();

    console.log = realLog;

    return {infoMs: t1 - t0, ctxMs: t3 - t2, separatorMs: t5 - t4};
}

const baseline = await bench("@bejibun-baseline/logger");
const optimized = await bench("../../facades/Logger.js");

function row(label, o, n) {
    console.log(
        `  ${label.padEnd(22)} baseline: ${o.toFixed(1).padStart(9)}ms   optimized: ${n.toFixed(1).padStart(8)}ms   speedup: ${(o / n).toFixed(2)}x`
    );
}

function opsPerSec(ms) {
    return Math.round(ITERATIONS / (ms / 1000)).toLocaleString();
}

console.log(
    `\nTHROUGHPUT BENCHMARK (${ITERATIONS.toLocaleString()} calls each, logging silenced, ${WARMUP.toLocaleString()} warmup calls)\n`
);
row("Logger.info(msg)", baseline.infoMs, optimized.infoMs);
row("setContext().warn()", baseline.ctxMs, optimized.ctxMs);
row("Logger.separator()", baseline.separatorMs, optimized.separatorMs);

console.log(`\nOps/sec:`);
console.log(
    `  Logger.info()        baseline: ${opsPerSec(baseline.infoMs)}/s   optimized: ${opsPerSec(optimized.infoMs)}/s`
);
console.log(
    `  setContext().warn()  baseline: ${opsPerSec(baseline.ctxMs)}/s   optimized: ${opsPerSec(optimized.ctxMs)}/s`
);
console.log(
    `  separator()          baseline: ${opsPerSec(baseline.separatorMs)}/s   optimized: ${opsPerSec(optimized.separatorMs)}/s`
);

function tableRow(label, o, n) {
    return `| ${label} | ${o.toFixed(1)}ms | ${n.toFixed(1)}ms | **${(o / n).toFixed(2)}x** | ${opsPerSec(o)}/s | ${opsPerSec(n)}/s |`;
}

const table = [
    "| Method | baseline | optimized | speedup | baseline ops/s | optimized ops/s |",
    "|---|---|---|---|---|---|",
    tableRow("`Logger.info(msg)`", baseline.infoMs, optimized.infoMs),
    tableRow("`setContext().warn()`", baseline.ctxMs, optimized.ctxMs),
    tableRow("`Logger.separator()`", baseline.separatorMs, optimized.separatorMs)
].join("\n");

updateReadmeSection("THROUGHPUT", table);
