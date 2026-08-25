/**
 * Returns a horizontal separator line matching the current terminal width.
 *
 * @returns {string} The separator string.
 */
export declare const getSeparatorLine: () => string;
/**
 * Fluent builder for writing formatted log lines to stdout.
 */
export default class LoggerBuilder {
    protected timestamp: string;
    protected type: string;
    protected value: string;
    protected context: string;
    /**
     * Creates a new LoggerBuilder with the current timestamp and empty fields.
     */
    constructor();
    /**
     * Sets the log context label.
     *
     * @param {string} context - The context identifier.
     * @returns {LoggerBuilder} The current builder instance.
     */
    setContext(context: string): LoggerBuilder;
    /**
     * Sets the log message.
     *
     * @param {string} value - The message to log.
     * @returns {LoggerBuilder} The current builder instance.
     */
    setValue(value: string): LoggerBuilder;
    /**
     * Logs a DEBUG message.
     *
     * @param {string} [value] - Optional message; overrides any previously set value.
     * @returns {LoggerBuilder} The current builder instance.
     */
    debug(value?: string): LoggerBuilder;
    /**
     * Logs an ERROR message.
     *
     * @param {string} [value] - Optional message; overrides any previously set value.
     * @returns {LoggerBuilder} The current builder instance.
     */
    error(value?: string): LoggerBuilder;
    /**
     * Logs an INFO message.
     *
     * @param {string} [value] - Optional message; overrides any previously set value.
     * @returns {LoggerBuilder} The current builder instance.
     */
    info(value?: string): LoggerBuilder;
    /**
     * Logs a WARN message.
     *
     * @param {string} [value] - Optional message; overrides any previously set value.
     * @returns {LoggerBuilder} The current builder instance.
     */
    warn(value?: string): LoggerBuilder;
    /**
     * Logs an error to stderr.
     *
     * @param {Error | string} [error] - The error or message to trace.
     */
    trace(error?: Error | string): void;
    /**
     * Prints an empty line to stdout.
     */
    empty(): void;
    /**
     * Prints a horizontal separator line to stdout.
     */
    separator(): void;
    /**
     * Prints the formatted log line to stdout.
     */
    show(): void;
}
