import { defineValue, isNotEmpty } from "@bejibun/utils";
import Luxon from "@bejibun/utils/facades/Luxon";
import Chalk from "../facades/Chalk";
export default class LoggerBuilder {
    timestamp;
    type;
    value;
    context;
    constructor() {
        this.timestamp = Luxon.DateTime.now().toFormat("yyyy-MM-dd HH:mm:ss.SSS");
        this.type = "";
        this.context = "";
        this.value = "";
    }
    setContext(context) {
        this.context = context;
        return this;
    }
    setValue(value) {
        this.value = value;
        return this;
    }
    debug(value) {
        this.type = "DEBUG";
        if (isNotEmpty(value))
            this.setValue(value);
        this.show();
        return this;
    }
    error(value) {
        this.type = "ERROR";
        if (isNotEmpty(value))
            this.setValue(value);
        this.show();
        return this;
    }
    info(value) {
        this.type = "INFO";
        if (isNotEmpty(value))
            this.setValue(value);
        this.show();
        return this;
    }
    warn(value) {
        this.type = "WARN";
        if (isNotEmpty(value))
            this.setValue(value);
        this.show();
        return this;
    }
    trace(error) {
        if (isNotEmpty(error))
            console.error(error);
    }
    empty() {
        console.log();
    }
    separator() {
        console.log("-".repeat(process.stdout.columns));
    }
    show() {
        const typeValue = `[${defineValue(this.context, this.type)}]`;
        let chalk;
        switch (this.type) {
            case "DEBUG":
                chalk = Chalk.setValue(typeValue).inline().debug().show();
                break;
            case "ERROR":
                chalk = Chalk.setValue(typeValue).inline().error().show();
                break;
            case "WARN":
                chalk = Chalk.setValue(typeValue).inline().warn().show();
                break;
            default:
                chalk = Chalk.setValue(typeValue).inline().info().show();
                break;
        }
        console.log(this.timestamp, `${chalk}:`, this.value);
    }
}
