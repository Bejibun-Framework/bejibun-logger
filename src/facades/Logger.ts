import LoggerBuilder from "@/builders/LoggerBuilder";

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
        return new LoggerBuilder().empty();
    }

    public static separator(): void {
        return new LoggerBuilder().separator();
    }
}
