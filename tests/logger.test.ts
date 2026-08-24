import {
    afterEach,
    beforeEach,
    describe,
    expect,
    mock,
    test
} from "bun:test";
import LoggerBuilder, {getSeparatorLine} from "../src/builders/LoggerBuilder";
import Logger from "../src/facades/Logger";

describe("Logger facade", () => {
    const log = mock(console.log);
    const error = mock(console.error);

    beforeEach(() => {
        log.mockReset();
        error.mockReset();
        console.log = log;
        console.error = error;
    });

    afterEach(() => {
        console.log = console.log;
        console.error = console.error;
    });

    test("debug logs with DEBUG prefix", () => {
        Logger.debug("hi");

        expect(log).toHaveBeenCalledTimes(1);
        expect(log.mock.calls[0][0]).toContain("DEBUG");
        expect(log.mock.calls[0][0]).toContain("hi");
    });

    test("info logs with INFO prefix", () => {
        Logger.info("hello");

        expect(log).toHaveBeenCalledTimes(1);
        expect(log.mock.calls[0][0]).toContain("INFO");
        expect(log.mock.calls[0][0]).toContain("hello");
    });

    test("warn logs with WARN prefix", () => {
        Logger.warn("careful");

        expect(log).toHaveBeenCalledTimes(1);
        expect(log.mock.calls[0][0]).toContain("WARN");
        expect(log.mock.calls[0][0]).toContain("careful");
    });

    test("error logs with ERROR prefix", () => {
        Logger.error("bad");

        expect(log).toHaveBeenCalledTimes(1);
        expect(log.mock.calls[0][0]).toContain("ERROR");
        expect(log.mock.calls[0][0]).toContain("bad");
    });

    test("setContext prefixes with the given context", () => {
        Logger.setContext("MyContext").error("detail");

        expect(log).toHaveBeenCalledTimes(1);
        expect(log.mock.calls[0][0]).toContain("[MyContext]");
        expect(log.mock.calls[0][0]).not.toContain("[ERROR]");
        expect(log.mock.calls[0][0]).toContain("detail");
    });

    test("setContext without type falls back to type when context empty", () => {
        new LoggerBuilder().setValue("orphan").debug();

        expect(log).toHaveBeenCalledTimes(1);
        expect(log.mock.calls[0][0]).toContain("[DEBUG]");
    });

    test("empty writes no value (blank line)", () => {
        Logger.empty();

        expect(log).toHaveBeenCalledWith();
    });

    test("separator writes the separator line", () => {
        Logger.separator();

        expect(log).toHaveBeenCalledWith(getSeparatorLine());
    });

    test("trace forwards an Error to console.error", () => {
        const err = new Error("boom");

        Logger.setContext("Ctx").trace(err);

        expect(error).toHaveBeenCalledWith(err);
        expect(log).not.toHaveBeenCalled();
    });

    test("trace ignores falsy input", () => {
        Logger.setContext("Ctx").trace();

        expect(error).not.toHaveBeenCalled();
    });
});

describe("Logger builder", () => {
    const log = mock(console.log);

    beforeEach(() => {
        log.mockReset();
        console.log = log;
    });

    afterEach(() => {
        console.log = console.log;
    });

    test("is chainable (fluent)", () => {
        const builder = new LoggerBuilder();

        expect(builder.setContext("ctx")).toBe(builder);
        expect(builder.setValue("val")).toBe(builder);
        expect(builder.debug()).toBe(builder);
        expect(builder.error()).toBe(builder);
        expect(builder.info()).toBe(builder);
        expect(builder.warn()).toBe(builder);
    });

    test("debug() with a value overrides setValue", () => {
        new LoggerBuilder().setValue("first").debug("second");

        expect(log.mock.calls[0][0]).toContain("second");
        expect(log.mock.calls[0][0]).not.toContain("first");
    });

    test("trace() writes nothing to console.log", () => {
        log.mockClear();
        new LoggerBuilder().trace("something");

        expect(log).not.toHaveBeenCalled();
    });

    test("empty() writes a blank line", () => {
        new LoggerBuilder().empty();

        expect(log).toHaveBeenCalledWith();
    });

    test("separator() writes the separator line", () => {
        new LoggerBuilder().separator();

        expect(log).toHaveBeenCalledWith(getSeparatorLine());
    });

    test("separator line is all dashes", () => {
        const line = getSeparatorLine();

        expect(line.length).toBeGreaterThan(0);
        expect(line).toMatch(/^-+$/);
    });

    test("show() format includes timestamp, prefix, and value", () => {
        new LoggerBuilder().setContext("App").setValue("message").info();

        const output = log.mock.calls[0][0] as string;
        const datePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}/;

        expect(output).toMatch(datePattern);
        expect(output).toContain("[App]");
        expect(output).toContain("message");
    });
});
