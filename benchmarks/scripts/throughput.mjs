/**
 * Throughput benchmark - the hot path.
 *
 * Measures raw call speed for all public entry points:
 * Logger.debug/info/warn/error(), setContext().warn(), Logger.empty(), Logger.separator().
 * Logging output is silenced so we're measuring the logger's own compute (timestamp
 * formatting, coloring, string building), not terminal/pipe I/O speed.
 *
 * Run: bun run scripts/throughput.mjs
 */
import {updateReadmeSection} from "./readme-writer.mjs";
import {printTable} from "./table-format.mjs";

const ITERATIONS = 200_000;
const WARMUP = 5_000;

async function bench(modulePath) {
    const Logger = (await import(modulePath)).default;

    const realLog = console.log;
    console.log = () => {};

    for (let i = 0; i < WARMUP; i++) Logger.info("warmup message");

    const t0 = performance.now();
    for (let i = 0; i < ITERATIONS; i++) Logger.debug("benchmark message number " + i);
    const tDebug = performance.now();

    const t1 = performance.now();
    for (let i = 0; i < ITERATIONS; i++) Logger.info("benchmark message number " + i);
    const tInfo = performance.now();

    const t2 = performance.now();
    for (let i = 0; i < ITERATIONS; i++) Logger.warn("benchmark message number " + i);
    const tWarn = performance.now();

    const t3 = performance.now();
    for (let i = 0; i < ITERATIONS; i++) Logger.error("benchmark message number " + i);
    const tError = performance.now();

    const t4 = performance.now();
    for (let i = 0; i < ITERATIONS; i++) Logger.setContext("Bench").warn("ctx message");
    const tCtx = performance.now();

    const t5 = performance.now();
    for (let i = 0; i < ITERATIONS; i++) Logger.empty();
    const tEmpty = performance.now();

    const t6 = performance.now();
    for (let i = 0; i < ITERATIONS; i++) Logger.separator();
    const tSeparator = performance.now();

    console.log = realLog;

    return {
        debugMs: tDebug - t0,
        infoMs: tInfo - t1,
        warnMs: tWarn - t2,
        errorMs: tError - t3,
        ctxMs: tCtx - t4,
        emptyMs: tEmpty - t5,
        separatorMs: tSeparator - t6
    };
}

const baseline = await bench("@bejibun-baseline/logger");
const optimized = await bench("../../facades/Logger.js");

function fmt(ms) {
    return ms < 1 ? `${(ms * 1000).toFixed(0)}\u00B5s` : `${ms.toFixed(1)}ms`;
}

function sp(b, o) {
    const r = b / o;
    return r >= 1.05 ? `${r.toFixed(2)}x` : r <= 0.95 ? `${r.toFixed(2)}x` : "~1.0x";
}

function ops(ms) {
    return Math.round(ITERATIONS / (ms / 1000)).toLocaleString() + "/s";
}

function row(name, bMs, oMs) {
    return {cells: [name, fmt(bMs), fmt(oMs), sp(bMs, oMs), ops(oMs)]};
}

printTable({
    title: "THROUGHPUT BENCHMARK",
    subtitle: `${ITERATIONS.toLocaleString()} calls each, logging silenced, ${WARMUP.toLocaleString()} warmup calls`,
    headers: ["Method", "Baseline", "Optimized", "Speedup", "Optimized ops/s"],
    rows: [
        row("Logger.debug(msg)", baseline.debugMs, optimized.debugMs),
        row("Logger.info(msg)", baseline.infoMs, optimized.infoMs),
        row("Logger.warn(msg)", baseline.warnMs, optimized.warnMs),
        row("Logger.error(msg)", baseline.errorMs, optimized.errorMs),
        row("setContext().warn()", baseline.ctxMs, optimized.ctxMs),
        row("Logger.empty()", baseline.emptyMs, optimized.emptyMs),
        row("Logger.separator()", baseline.separatorMs, optimized.separatorMs)
    ]
});

function tableRow(label, o, n) {
    return `| ${label} | ${o.toFixed(1)}ms | ${n.toFixed(1)}ms | **${(o / n).toFixed(2)}x** | ${ops(o)} | ${ops(n)} |`;
}

const table = [
    "| Method | baseline | optimized | speedup | baseline ops/s | optimized ops/s |",
    "|---|---|---|---|---|---|",
    tableRow("`Logger.debug(msg)`", baseline.debugMs, optimized.debugMs),
    tableRow("`Logger.info(msg)`", baseline.infoMs, optimized.infoMs),
    tableRow("`Logger.warn(msg)`", baseline.warnMs, optimized.warnMs),
    tableRow("`Logger.error(msg)`", baseline.errorMs, optimized.errorMs),
    tableRow("`setContext().warn()`", baseline.ctxMs, optimized.ctxMs),
    tableRow("`Logger.empty()`", baseline.emptyMs, optimized.emptyMs),
    tableRow("`Logger.separator()`", baseline.separatorMs, optimized.separatorMs)
].join("\n");

updateReadmeSection("THROUGHPUT", table);
