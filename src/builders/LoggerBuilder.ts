import {defineValue, isNotEmpty} from "@bejibun/utils/utils/utils";
import chalk from "chalk";

/**
 * Colorizers are resolved once at module load instead of being rebuilt through the
 * ChalkBuilder fluent chain on every single log call (new instance + several method
 * calls + property lookups per line). This is the hot path of the whole package, so
 * caching it here removes an allocation and multiple calls per log line.
 */
const LEVEL_COLORS: Record<string, (value: string) => string> = {
    DEBUG: chalk.gray,
    ERROR: chalk.red,
    WARN: chalk.yellow,
    INFO: chalk.blueBright
};

const pad = (value: number, length = 2): string => String(value).padStart(length, "0");

/**
 * Native Date formatting instead of Luxon. Luxon's DateTime.now().toFormat(...) does
 * Intl/timezone-table work and, more importantly, `@bejibun/utils`'s barrel export pulls
 * the whole Luxon dependency chain (plus unrelated Enum/Object/Str facades) into memory
 * at cold start just to reach a tiny formatting call. A hand-rolled formatter produces
 * the exact same "yyyy-MM-dd HH:mm:ss.SSS" output at a fraction of the cost, both per
 * call and at startup.
 */
const formatTimestamp = (date: Date): string =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`;

/**
 * process.stdout.columns is re-read on every separator() call and, when the process
 * isn't attached to a TTY (piped output, CI logs, etc.), it is `undefined` -- which
 * previously made `"-".repeat(undefined)` throw a RangeError. We cache the last known
 * width and only rebuild the dash string when it actually changes, and fall back to a
 * sane default otherwise.
 */
const DEFAULT_COLUMNS = 80;
let cachedColumns = process.stdout.columns || DEFAULT_COLUMNS;
let cachedSeparator = "-".repeat(cachedColumns);

export const getSeparatorLine = (): string => {
    const columns = process.stdout.columns || DEFAULT_COLUMNS;

    if (columns !== cachedColumns) {
        cachedColumns = columns;
        cachedSeparator = "-".repeat(cachedColumns);
    }

    return cachedSeparator;
};

export default class LoggerBuilder {
    protected timestamp: string;
    protected type: string;
    protected value: string;
    protected context: string;

    public constructor() {
        this.timestamp = formatTimestamp(new Date());
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
        console.log(getSeparatorLine());
    }

    public show(): void {
        const typeValue: string = `[${defineValue(this.context, this.type)}]`;
        const colorize = LEVEL_COLORS[this.type] ?? LEVEL_COLORS.INFO;

        // A single pre-built string passed to a single console.log call, rather than
        // three separate arguments -- Node's Console re-formats/inspects each argument
        // individually (util.format), so combining them avoids that per-line overhead.
        console.log(`${this.timestamp} ${colorize(typeValue)}: ${this.value}`);
    }
}
