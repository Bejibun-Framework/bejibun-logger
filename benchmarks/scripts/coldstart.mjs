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
import {printTable} from "./table-format.mjs";

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

function fmt(ms) {
    return ms < 1 ? `${(ms * 1000).toFixed(0)}\u00B5s` : `${ms.toFixed(1)}ms`;
}

function sp(b, o) {
    const r = b / o;
    return r >= 1.05 ? `${r.toFixed(2)}x` : r <= 0.95 ? `${r.toFixed(2)}x` : "~1.0x";
}

printTable({
    title: "COLD START BENCHMARK",
    subtitle: `${TRIALS} fresh process spawns per variant`,
    headers: ["Metric", "Baseline", "Optimized", "Speedup"],
    rows: [
        {
            cells: [
                "Full process (spawn \u2192 exit)",
                fmt(baseWall.median),
                fmt(optWall.median),
                sp(baseWall.median, optWall.median)
            ]
        },
        {
            cells: [
                "Import \u2192 first log (logger only)",
                fmt(baseInt.median),
                fmt(optInt.median),
                sp(baseInt.median, optInt.median)
            ]
        }
    ]
});

const table = [
    "| | baseline | optimized | speedup |",
    "|---|---|---|---|",
    `| Full process (spawn \\u2192 exit) | ${baseWall.median.toFixed(1)}ms | ${optWall.median.toFixed(1)}ms | **${(baseWall.median / optWall.median).toFixed(2)}x** |`,
    `| Import \\u2192 first log (logger only) | ${baseInt.median.toFixed(1)}ms | ${optInt.median.toFixed(1)}ms | **${(baseInt.median / optInt.median).toFixed(2)}x** |`
].join("\n");

updateReadmeSection("COLDSTART", table);
