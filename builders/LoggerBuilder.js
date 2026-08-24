import chalk from "chalk";
/** True when the given value is a non-empty string (or any non-null/undefined non-string). */
const isNotEmpty = (value) => {
    if (value === undefined || value === null)
        return false;
    if (typeof value === "string")
        return value.trim().length > 0;
    return true;
};
/** Returns `value` when non-empty, otherwise `defaultValue`. */
const defineValue = (value, defaultValue = null) => {
    return isNotEmpty(value) ? value : defaultValue;
};
/**
 * Colorizers are resolved once at module load instead of being rebuilt through the
 * ChalkBuilder fluent chain on every single log call (new instance + several method
 * calls + property lookups per line). This is the hot path of the whole package, so
 * caching it here removes an allocation and multiple calls per log line.
 */
const LEVEL_COLORS = {
    DEBUG: chalk.gray,
    ERROR: chalk.red,
    WARN: chalk.yellow,
    INFO: chalk.blueBright
};
const pad = (value, length = 2) => String(value).padStart(length, "0");
/**
 * Native Date formatting instead of Luxon. Luxon's DateTime.now().toFormat(...) does
 * Intl/timezone-table work per call. A hand-rolled formatter produces the exact same
 * "yyyy-MM-dd HH:mm:ss.SSS" output at a fraction of the cost, both per call and at
 * startup, and keeps the package free of any `@bejibun/utils` (and thus Luxon) import.
 */
const formatTimestamp = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`;
/**
 * process.stdout.columns is re-read on every separator() call and, when the process
 * isn't attached to a TTY (piped output, CI logs, etc.), it is `undefined` -- which
 * previously made `"-".repeat(undefined)` throw a RangeError. We cache the last known
 * width and only rebuild the dash string when it actually changes, and fall back to a
 * sane default otherwise.
 */
const DEFAULT_COLUMNS = 80;
let cachedColumns = process.stdout.columns || DEFAULT_COLUMNS;
let cachedSeparator = "-".repeat(cachedColumns);
export const getSeparatorLine = () => {
    const columns = process.stdout.columns || DEFAULT_COLUMNS;
    if (columns !== cachedColumns) {
        cachedColumns = columns;
        cachedSeparator = "-".repeat(cachedColumns);
    }
    return cachedSeparator;
};
export default class LoggerBuilder {
    timestamp;
    type;
    value;
    context;
    constructor() {
        this.timestamp = formatTimestamp(new Date());
        this.type = "";
        this.context = "";
        this.value = "";
    }
    setContext(context) {
        this.context = context;
        return this;
    }
    setValue(value) {
        this.value = value;
        return this;
    }
    debug(value) {
        this.type = "DEBUG";
        if (isNotEmpty(value))
            this.setValue(value);
        this.show();
        return this;
    }
    error(value) {
        this.type = "ERROR";
        if (isNotEmpty(value))
            this.setValue(value);
        this.show();
        return this;
    }
    info(value) {
        this.type = "INFO";
        if (isNotEmpty(value))
            this.setValue(value);
        this.show();
        return this;
    }
    warn(value) {
        this.type = "WARN";
        if (isNotEmpty(value))
            this.setValue(value);
        this.show();
        return this;
    }
    trace(error) {
        if (isNotEmpty(error))
            console.error(error);
    }
    empty() {
        console.log();
    }
    separator() {
        console.log(getSeparatorLine());
    }
    show() {
        const typeValue = `[${defineValue(this.context, this.type)}]`;
        const colorize = LEVEL_COLORS[this.type] ?? LEVEL_COLORS.INFO;
        // A single pre-built string passed to a single console.log call, rather than
        // three separate arguments -- Node's Console re-formats/inspects each argument
        // individually (util.format), so combining them avoids that per-line overhead.
        console.log(`${this.timestamp} ${colorize(typeValue)}: ${this.value}`);
    }
}
