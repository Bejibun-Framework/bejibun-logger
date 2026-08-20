import {defineValue, isNotEmpty} from "@bejibun/utils";
import Luxon from "@bejibun/utils/facades/Luxon";
import Chalk from "@/facades/Chalk";

export default class LoggerBuilder {
    protected timestamp: string;
    protected type: string;
    protected value: string;
    protected context: string;

    public constructor() {
        this.timestamp = Luxon.DateTime.now().toFormat("yyyy-MM-dd HH:mm:ss.SSS");
        this.type = "";
        this.context = "";
        this.value = "";
    }

    public setContext(context: string): LoggerBuilder {
        this.context = context;

        return this;
    }

    public setValue(value: string): LoggerBuilder {
        this.value = value;

        return this;
    }

    public debug(value?: string): LoggerBuilder {
        this.type = "DEBUG";

        if (isNotEmpty(value)) this.setValue(value as string);

        this.show();

        return this;
    }

    public error(value?: string): LoggerBuilder {
        this.type = "ERROR";

        if (isNotEmpty(value)) this.setValue(value as string);

        this.show();

        return this;
    }

    public info(value?: string): LoggerBuilder {
        this.type = "INFO";

        if (isNotEmpty(value)) this.setValue(value as string);

        this.show();

        return this;
    }

    public warn(value?: string): LoggerBuilder {
        this.type = "WARN";

        if (isNotEmpty(value)) this.setValue(value as string);

        this.show();

        return this;
    }

    public trace(error?: Error | string): void {
        if (isNotEmpty(error)) console.error(error);
    }

    public empty(): void {
        console.log();
    }

    public separator(): void {
        console.log("-".repeat(process.stdout.columns));
    }

    public show(): void {
        const typeValue: string = `[${defineValue(this.context, this.type)}]`;
        let chalk: string;

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
