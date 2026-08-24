import LoggerBuilder from "../builders/LoggerBuilder";
/** Facade exposing a fluent logging API backed by LoggerBuilder. */
export default class Logger {
    /**
     * Creates a new logger builder configured with the given context.
     *
     * @param context - the context label attached to logged entries.
     * @returns a LoggerBuilder configured with the context.
     */
    static setContext(context: string): LoggerBuilder;
    /**
     * Creates a new logger builder configured to log the value at debug level.
     *
     * @param value - the message value to log.
     * @returns a LoggerBuilder configured for debug-level logging.
     */
    static debug(value: string): LoggerBuilder;
    /**
     * Creates a new logger builder configured to log the value at error level.
     *
     * @param value - the message value to log.
     * @returns a LoggerBuilder configured for error-level logging.
     */
    static error(value: string): LoggerBuilder;
    /**
     * Creates a new logger builder configured to log the value at info level.
     *
     * @param value - the message value to log.
     * @returns a LoggerBuilder configured for info-level logging.
     */
    static info(value: string): LoggerBuilder;
    /**
     * Creates a new logger builder configured to log the value at warn level.
     *
     * @param value - the message value to log.
     * @returns a LoggerBuilder configured for warn-level logging.
     */
    static warn(value: string): LoggerBuilder;
    /** Prints an empty line to the console. */
    static empty(): void;
    /** Prints a separator line to the console. */
    static separator(): void;
}
