import LoggerBuilder, { getSeparatorLine } from "../builders/LoggerBuilder";
export default class Logger {
    static setContext(context) {
        return new LoggerBuilder().setContext(context);
    }
    static debug(value) {
        return new LoggerBuilder().setValue(value).debug();
    }
    static error(value) {
        return new LoggerBuilder().setValue(value).error();
    }
    static info(value) {
        return new LoggerBuilder().setValue(value).info();
    }
    static warn(value) {
        return new LoggerBuilder().setValue(value).warn();
    }
    static empty() {
        // No LoggerBuilder needed here: skips the Date/timestamp formatting work that
        // would otherwise happen just to be thrown away unused.
        console.log();
    }
    static separator() {
        console.log(getSeparatorLine());
    }
}
