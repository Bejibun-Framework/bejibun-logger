/**
 * Cold-start benchmark.
 *
 * Spawns a brand new OS process per trial for each variant (baseline vs optimized) and
 * measures two things:
 *   1. "Full process time"    - spawn -> exit. Includes Node/Bun's own boot time, so the
 *                                relative gap is diluted by fixed runtime startup cost.
 *   2. "Import + first log"   - measured *inside* the process, from `import Logger` to the
 *                                first Logger.info() returning. This isolates the cost that
 *                                is actually attributable to the logger package itself
 *                                (module graph loaded, dependencies parsed/executed, etc).
 *
 * Run: bun run scripts/coldstart.mjs
 */
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import path from "node:path";
import {updateReadmeSection} from "./readme-writer.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRIALS = 30;
const runtime = process.execPath;

function runTrials(scriptPath) {
    const times = [];

    for (let i = 0; i < TRIALS; i++) {
        const t0 = performance.now();
        const res = spawnSync(runtime, [scriptPath], {encoding: "utf8"});
        const wallTime = performance.now() - t0;
        if (res.status !== 0) {
            console.error("Benchmark process failed:", res.stderr);
            process.exit(1);
        }
        const internalTime = parseFloat(res.stderr.trim());
        times.push({wallTime, internalTime});
    }

    return times;
}

function stats(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const sum = arr.reduce((a, b) => a + b, 0);

    return {
        min: sorted[0],
        median: sorted[Math.floor(sorted.length / 2)],
        mean: sum / arr.length
    };
}

const baseline = runTrials(path.join(__dirname, "coldstart-baseline.mjs"));
const optimized = runTrials(path.join(__dirname, "coldstart-optimized.mjs"));

const baseWall = stats(baseline.map((t) => t.wallTime));
const optWall = stats(optimized.map((t) => t.wallTime));
const baseInt = stats(baseline.map((t) => t.internalTime));
const optInt = stats(optimized.map((t) => t.internalTime));

console.log(`\nCOLD START BENCHMARK (${TRIALS} fresh process spawns per variant)\n`);

console.log("Full process time (spawn -> exit, includes runtime boot):");
console.log(
    `  baseline : min ${baseWall.min.toFixed(2)}ms  median ${baseWall.median.toFixed(2)}ms  mean ${baseWall.mean.toFixed(2)}ms`
);
console.log(
    `  optimized: min ${optWall.min.toFixed(2)}ms  median ${optWall.median.toFixed(2)}ms  mean ${optWall.mean.toFixed(2)}ms`
);
console.log(`  speedup (median): ${(baseWall.median / optWall.median).toFixed(2)}x\n`);

console.log("Import + first log only (the logger package's own cold-start cost):");
console.log(
    `  baseline : min ${baseInt.min.toFixed(2)}ms  median ${baseInt.median.toFixed(2)}ms  mean ${baseInt.mean.toFixed(2)}ms`
);
console.log(
    `  optimized: min ${optInt.min.toFixed(2)}ms  median ${optInt.median.toFixed(2)}ms  mean ${optInt.mean.toFixed(2)}ms`
);
console.log(`  speedup (median): ${(baseInt.median / optInt.median).toFixed(2)}x`);

const table = [
    "| | baseline | optimized | speedup |",
    "|---|---|---|---|",
    `| Full process (spawn → exit) | ${baseWall.median.toFixed(1)}ms | ${optWall.median.toFixed(1)}ms | **${(baseWall.median / optWall.median).toFixed(2)}x** |`,
    `| Import → first log (logger's own cost) | ${baseInt.median.toFixed(1)}ms | ${optInt.median.toFixed(1)}ms | **${(baseInt.median / optInt.median).toFixed(2)}x** |`
].join("\n");

updateReadmeSection("COLDSTART", table);
