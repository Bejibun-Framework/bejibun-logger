export declare const getSeparatorLine: () => string;
export default class LoggerBuilder {
    protected timestamp: string;
    protected type: string;
    protected value: string;
    protected context: string;
    constructor();
    setContext(context: string): LoggerBuilder;
    setValue(value: string): LoggerBuilder;
    debug(value?: string): LoggerBuilder;
    error(value?: string): LoggerBuilder;
    info(value?: string): LoggerBuilder;
    warn(value?: string): LoggerBuilder;
    trace(error?: Error | string): void;
    empty(): void;
    separator(): void;
    show(): void;
}
