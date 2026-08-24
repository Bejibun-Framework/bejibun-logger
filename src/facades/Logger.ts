import LoggerBuilder, {getSeparatorLine} from "@/builders/LoggerBuilder";

/** Facade exposing a fluent logging API backed by LoggerBuilder. */
export default class Logger {
    /**
     * Creates a new logger builder configured with the given context.
     *
     * @param context - the context label attached to logged entries.
     * @returns a LoggerBuilder configured with the context.
     */
    public static setContext(context: string): LoggerBuilder {
        return new LoggerBuilder().setContext(context);
    }

    /**
     * Creates a new logger builder configured to log the value at debug level.
     *
     * @param value - the message value to log.
     * @returns a LoggerBuilder configured for debug-level logging.
     */
    public static debug(value: string): LoggerBuilder {
        return new LoggerBuilder().setValue(value).debug();
    }

    /**
     * Creates a new logger builder configured to log the value at error level.
     *
     * @param value - the message value to log.
     * @returns a LoggerBuilder configured for error-level logging.
     */
    public static error(value: string): LoggerBuilder {
        return new LoggerBuilder().setValue(value).error();
    }

    /**
     * Creates a new logger builder configured to log the value at info level.
     *
     * @param value - the message value to log.
     * @returns a LoggerBuilder configured for info-level logging.
     */
    public static info(value: string): LoggerBuilder {
        return new LoggerBuilder().setValue(value).info();
    }

    /**
     * Creates a new logger builder configured to log the value at warn level.
     *
     * @param value - the message value to log.
     * @returns a LoggerBuilder configured for warn-level logging.
     */
    public static warn(value: string): LoggerBuilder {
        return new LoggerBuilder().setValue(value).warn();
    }

    /** Prints an empty line to the console. */
    public static empty(): void {
        // No LoggerBuilder needed here: skips the Date/timestamp formatting work that
        // would otherwise happen just to be thrown away unused.
        console.log();
    }

    /** Prints a separator line to the console. */
    public static separator(): void {
        console.log(getSeparatorLine());
    }
}
