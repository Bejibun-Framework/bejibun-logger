# Benchmarks: baseline vs optimized

This folder compares the previously published npm release of `@bejibun/logger`
(the "baseline") against the optimized package one level up (`../`). The baseline
is a real `bun install` of the last published version — installed under the local
alias `@bejibun-baseline/logger` so it can sit alongside the unpublished optimized
code without colliding on package name — not a vendored source copy, so it can
never drift from what's actually on npm.

## Running

These benchmarks target Bun (the package's runtime) and are run with `bun run`.

```bash
cd benchmarks
bun run install-deps  # installs real chalk/@bejibun-utils/luxon, plus the previous
                      # published release as @bejibun-baseline/logger, into ../node_modules
                      # (this only needs doing once, or again after a new release ships)
bun run bench         # runs both benchmarks below and writes the results tables
                      # straight into the Results section of this README
# or individually:
bun run coldstart
bun run throughput
```

## What's measured

**`scripts/coldstart.mjs`** — spawns 30 fresh OS processes per variant and times:

- _Full process time_: process spawn → exit. Includes the JS runtime's own boot cost, so
  the gap between variants is diluted by fixed overhead neither version controls.
- _Import + first log_: timed **inside** the process, from `import Logger` to the first
  `Logger.info()` call returning. This isolates the cost actually attributable to the
  logger package — module graph size, what gets parsed/executed at import time.

**`scripts/throughput.mjs`** — 200,000 calls per method (5,000 warmup calls first so V8
JITs both code paths fairly), with `console.log` stubbed out so I/O speed doesn't drown
out the logger's own compute (timestamp formatting, coloring, string building). Note it
stubs `console.log` specifically, not `process.stdout.write` — Node's console has a fast
path that writes straight to the fd when stdout is a TTY, bypassing `process.stdout.write`
entirely, which would otherwise flood your terminal with 1.2M log lines on an interactive
run.

## Results (this machine, Bun, median of 30 trials)

_The two tables below are written automatically by `bun run bench` (or `bun run
coldstart` / `bun run throughput` individually) — don't hand-edit the numbers, they'll
be overwritten on the next run. Everything else in this section is written by hand and
won't be touched._

### Cold start

<!-- BENCHMARK:COLDSTART:START -->

|                                       | baseline | optimized | speedup   |
| ------------------------------------- | -------- | --------- | --------- |
| Full process (spawn \u2192 exit)      | 32.3ms   | 23.9ms    | **1.35x** |
| Import \u2192 first log (logger only) | 24.2ms   | 16.4ms    | **1.48x** |

<!-- BENCHMARK:COLDSTART:END -->

The bulk of this comes from one thing: the original imported `isNotEmpty`/`defineValue`
from `@bejibun/utils`'s barrel export, which transitively loads a `Luxon` facade — pulling
the entire Luxon library (timezone tables, Intl setup) into memory just to reach two
trivial functions. The optimized version imports those two functions from their actual
file (`@bejibun/utils/utils/utils`) and never touches Luxon at all.

### Throughput (200k calls each)

<!-- BENCHMARK:THROUGHPUT:START -->

| Method                | baseline | optimized | speedup     | baseline ops/s | optimized ops/s |
| --------------------- | -------- | --------- | ----------- | -------------- | --------------- |
| `Logger.debug(msg)`   | 888.2ms  | 87.9ms    | **10.11x**  | 225,179/s      | 2,276,272/s     |
| `Logger.info(msg)`    | 977.6ms  | 79.5ms    | **12.29x**  | 204,578/s      | 2,514,413/s     |
| `Logger.warn(msg)`    | 1090.0ms | 88.4ms    | **12.33x**  | 183,491/s      | 2,262,752/s     |
| `Logger.error(msg)`   | 1162.2ms | 82.7ms    | **14.05x**  | 172,087/s      | 2,417,259/s     |
| `setContext().warn()` | 1204.8ms | 83.5ms    | **14.43x**  | 165,997/s      | 2,394,838/s     |
| `Logger.empty()`      | 1106.3ms | 1.5ms     | **756.88x** | 180,787/s      | 136,833,254/s   |
| `Logger.separator()`  | 1230.6ms | 1.8ms     | **672.81x** | 162,519/s      | 109,344,409/s   |

<!-- BENCHMARK:THROUGHPUT:END -->

`info()`/`warn()` are faster mainly because the timestamp no longer goes through Luxon's
`DateTime.now().toFormat(...)` (Intl/timezone lookups) — a hand-rolled native `Date`
formatter produces the identical string — and because the per-level color function is
resolved once at module load instead of rebuilt through a new `ChalkBuilder` chain on
every call.

`separator()` is faster because the terminal-width dash string is now cached and only
rebuilt when the width actually changes, instead of calling `"-".repeat(width)` fresh
every time. As a side note: the _old_ code also had a latent behavior gap here — when
stdout isn't a TTY (piped output, CI logs), `process.stdout.columns` is `undefined`, and
`"-".repeat(undefined)` silently prints an **empty line** instead of a separator (it
doesn't throw — `undefined` coerces to `0` there). The optimized version falls back to an
80-column default in that case, so you actually get a separator line in non-TTY output.

## Notes on methodology

- Both variants run the _same_ real dependencies (`chalk`, `@bejibun/utils`, `luxon`) —
  nothing is mocked.
- Numbers will vary by machine; re-run `bun run bench` locally for your own hardware —
  it updates the tables in this README in place.
- The baseline is the actual last-published `@bejibun/logger` release, installed from
  npm under the alias `@bejibun-baseline/logger` — it is not part of the published
  package, only this benchmark, and it's never hand-copied so it can't go stale.
