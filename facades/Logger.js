import LoggerBuilder, { getSeparatorLine } from "../builders/LoggerBuilder";
/** Facade exposing a fluent logging API backed by LoggerBuilder. */
export default class Logger {
    /**
     * Creates a new logger builder configured with the given context.
     *
     * @param {string} context - The context label attached to logged entries.
     * @returns {LoggerBuilder} A builder configured with the context.
     */
    static setContext(context) {
        return new LoggerBuilder().setContext(context);
    }
    /**
     * Logs a message at DEBUG level.
     *
     * @param {string} value - The message to log.
     * @returns {LoggerBuilder} A builder configured for debug-level logging.
     */
    static debug(value) {
        return new LoggerBuilder().setValue(value).debug();
    }
    /**
     * Logs a message at ERROR level.
     *
     * @param {string} value - The message to log.
     * @returns {LoggerBuilder} A builder configured for error-level logging.
     */
    static error(value) {
        return new LoggerBuilder().setValue(value).error();
    }
    /**
     * Logs a message at INFO level.
     *
     * @param {string} value - The message to log.
     * @returns {LoggerBuilder} A builder configured for info-level logging.
     */
    static info(value) {
        return new LoggerBuilder().setValue(value).info();
    }
    /**
     * Logs a message at WARN level.
     *
     * @param {string} value - The message to log.
     * @returns {LoggerBuilder} A builder configured for warn-level logging.
     */
    static warn(value) {
        return new LoggerBuilder().setValue(value).warn();
    }
    /**
     * Prints an empty line to stdout.
     */
    static empty() {
        console.log();
    }
    /**
     * Prints a horizontal separator line to stdout.
     */
    static separator() {
        console.log(getSeparatorLine());
    }
}
