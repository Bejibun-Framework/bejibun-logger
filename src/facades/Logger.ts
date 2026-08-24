import LoggerBuilder, {getSeparatorLine} from "@/builders/LoggerBuilder";

export default class Logger {
    public static setContext(context: string): LoggerBuilder {
        return new LoggerBuilder().setContext(context);
    }

    public static debug(value: string): LoggerBuilder {
        return new LoggerBuilder().setValue(value).debug();
    }

    public static error(value: string): LoggerBuilder {
        return new LoggerBuilder().setValue(value).error();
    }

    public static info(value: string): LoggerBuilder {
        return new LoggerBuilder().setValue(value).info();
    }

    public static warn(value: string): LoggerBuilder {
        return new LoggerBuilder().setValue(value).warn();
    }

    public static empty(): void {
        // No LoggerBuilder needed here: skips the Date/timestamp formatting work that
        // would otherwise happen just to be thrown away unused.
        console.log();
    }

    public static separator(): void {
        console.log(getSeparatorLine());
    }
}
