import LoggerBuilder from "../builders/LoggerBuilder";
/** Facade exposing a fluent logging API backed by LoggerBuilder. */
export default class Logger {
    /**
     * Creates a new logger builder configured with the given context.
     *
     * @param {string} context - The context label attached to logged entries.
     * @returns {LoggerBuilder} A builder configured with the context.
     */
    static setContext(context: string): LoggerBuilder;
    /**
     * Logs a message at DEBUG level.
     *
     * @param {string} value - The message to log.
     * @returns {LoggerBuilder} A builder configured for debug-level logging.
     */
    static debug(value: string): LoggerBuilder;
    /**
     * Logs a message at ERROR level.
     *
     * @param {string} value - The message to log.
     * @returns {LoggerBuilder} A builder configured for error-level logging.
     */
    static error(value: string): LoggerBuilder;
    /**
     * Logs a message at INFO level.
     *
     * @param {string} value - The message to log.
     * @returns {LoggerBuilder} A builder configured for info-level logging.
     */
    static info(value: string): LoggerBuilder;
    /**
     * Logs a message at WARN level.
     *
     * @param {string} value - The message to log.
     * @returns {LoggerBuilder} A builder configured for warn-level logging.
     */
    static warn(value: string): LoggerBuilder;
    /**
     * Prints an empty line to stdout.
     */
    static empty(): void;
    /**
     * Prints a horizontal separator line to stdout.
     */
    static separator(): void;
}
