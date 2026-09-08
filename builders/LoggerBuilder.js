import chalk from "chalk";
/**
 * Checks whether the given value is not empty.
 *
 * @param {any} value - The value to check.
 * @returns {boolean} True when the value is not empty.
 */
const isNotEmpty = (value) => {
    if (value === undefined || value === null)
        return false;
    if (typeof value === "string")
        return value.trim().length > 0;
    return true;
};
/**
 * Returns the given value when non-empty, otherwise falls back to the default.
 *
 * @param {any} value - The value to evaluate.
 * @param {any} defaultValue - The fallback value when empty.
 * @returns {any} The value or the default.
 */
const defineValue = (value, defaultValue = null) => {
    return isNotEmpty(value) ? value : defaultValue;
};
/**
 * Colorizer for each log level.
 */
const LEVEL_COLORS = {
    DEBUG: chalk.gray,
    ERROR: chalk.red,
    WARN: chalk.yellow,
    INFO: chalk.blueBright
};
/**
 * Pads a number with leading zeros to the specified length.
 *
 * @param {number} value - The number to pad.
 * @param {number} length - The minimum output length.
 * @returns {string} The zero-padded string.
 */
const pad = (value, length = 2) => String(value).padStart(length, "0");
/**
 * Formats a Date into a "yyyy-MM-dd HH:mm:ss.SSS" string.
 *
 * @param {Date} date - The date to format.
 * @returns {string} The formatted timestamp.
 */
const formatTimestamp = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`;
/**
 * Cached terminal width and separator string, rebuilt only when the width changes.
 */
const DEFAULT_COLUMNS = 80;
let cachedColumns = process.stdout.columns || DEFAULT_COLUMNS;
let cachedSeparator = "-".repeat(cachedColumns);
/**
 * Returns a horizontal separator line matching the current terminal width.
 *
 * @returns {string} The separator string.
 */
export const getSeparatorLine = () => {
    const columns = process.stdout.columns || DEFAULT_COLUMNS;
    if (columns !== cachedColumns) {
        cachedColumns = columns;
        cachedSeparator = "-".repeat(cachedColumns);
    }
    return cachedSeparator;
};
/**
 * Fluent builder for writing formatted log lines to stdout.
 */
export default class LoggerBuilder {
    /** The formatted timestamp captured at construction time. */
    timestamp;
    /** The log level label (e.g. DEBUG, INFO, WARN, ERROR). */
    type;
    /** The log message content. */
    value;
    /** The context label shown in the log output. */
    context;
    /**
     * Creates a new LoggerBuilder with the current timestamp and empty fields.
     */
    constructor() {
        this.timestamp = formatTimestamp(new Date());
        this.type = "";
        this.context = "";
        this.value = "";
    }
    /**
     * Sets the log context label.
     *
     * @param {string} context - The context identifier.
     * @returns {LoggerBuilder} The current builder instance.
     */
    setContext(context) {
        this.context = context;
        return this;
    }
    /**
     * Sets the log message.
     *
     * @param {string} value - The message to log.
     * @returns {LoggerBuilder} The current builder instance.
     */
    setValue(value) {
        this.value = value;
        return this;
    }
    /**
     * Logs a DEBUG message.
     *
     * @param {string} [value] - Optional message; overrides any previously set value.
     * @returns {LoggerBuilder} The current builder instance.
     */
    debug(value) {
        this.type = "DEBUG";
        if (isNotEmpty(value))
            this.setValue(value);
        this.show();
        return this;
    }
    /**
     * Logs an ERROR message.
     *
     * @param {string} [value] - Optional message; overrides any previously set value.
     * @returns {LoggerBuilder} The current builder instance.
     */
    error(value) {
        this.type = "ERROR";
        if (isNotEmpty(value))
            this.setValue(value);
        this.show();
        return this;
    }
    /**
     * Logs an INFO message.
     *
     * @param {string} [value] - Optional message; overrides any previously set value.
     * @returns {LoggerBuilder} The current builder instance.
     */
    info(value) {
        this.type = "INFO";
        if (isNotEmpty(value))
            this.setValue(value);
        this.show();
        return this;
    }
    /**
     * Logs a WARN message.
     *
     * @param {string} [value] - Optional message; overrides any previously set value.
     * @returns {LoggerBuilder} The current builder instance.
     */
    warn(value) {
        this.type = "WARN";
        if (isNotEmpty(value))
            this.setValue(value);
        this.show();
        return this;
    }
    /**
     * Logs an error to stderr.
     *
     * @param {Error | string} [error] - The error or message to trace.
     */
    trace(error) {
        if (isNotEmpty(error))
            console.error(error);
    }
    /**
     * Prints an empty line to stdout.
     */
    empty() {
        console.log();
    }
    /**
     * Prints a horizontal separator line to stdout.
     */
    separator() {
        console.log(getSeparatorLine());
    }
    /**
     * Prints the formatted log line to stdout.
     */
    show() {
        const typeValue = `[${defineValue(this.context, this.type)}]`;
        const colorize = LEVEL_COLORS[this.type] || LEVEL_COLORS.INFO;
        console.log(`${this.timestamp} ${colorize(typeValue)}: ${this.value}`);
    }
}
