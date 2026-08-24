import LoggerBuilder, { getSeparatorLine } from "../builders/LoggerBuilder";
/** Facade exposing a fluent logging API backed by LoggerBuilder. */
export default class Logger {
    /**
     * Creates a new logger builder configured with the given context.
     *
     * @param context - the context label attached to logged entries.
     * @returns a LoggerBuilder configured with the context.
     */
    static setContext(context) {
        return new LoggerBuilder().setContext(context);
    }
    /**
     * Creates a new logger builder configured to log the value at debug level.
     *
     * @param value - the message value to log.
     * @returns a LoggerBuilder configured for debug-level logging.
     */
    static debug(value) {
        return new LoggerBuilder().setValue(value).debug();
    }
    /**
     * Creates a new logger builder configured to log the value at error level.
     *
     * @param value - the message value to log.
     * @returns a LoggerBuilder configured for error-level logging.
     */
    static error(value) {
        return new LoggerBuilder().setValue(value).error();
    }
    /**
     * Creates a new logger builder configured to log the value at info level.
     *
     * @param value - the message value to log.
     * @returns a LoggerBuilder configured for info-level logging.
     */
    static info(value) {
        return new LoggerBuilder().setValue(value).info();
    }
    /**
     * Creates a new logger builder configured to log the value at warn level.
     *
     * @param value - the message value to log.
     * @returns a LoggerBuilder configured for warn-level logging.
     */
    static warn(value) {
        return new LoggerBuilder().setValue(value).warn();
    }
    /** Prints an empty line to the console. */
    static empty() {
        // No LoggerBuilder needed here: skips the Date/timestamp formatting work that
        // would otherwise happen just to be thrown away unused.
        console.log();
    }
    /** Prints a separator line to the console. */
    static separator() {
        console.log(getSeparatorLine());
    }
}
