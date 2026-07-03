<div align="center">

<img src="https://github.com/Bejibun-Framework/bejibun/blob/master/public/images/bejibun.png?raw=true" width="150" alt="Bejibun" />

![GitHub top language](https://img.shields.io/github/languages/top/Bejibun-Framework/bejibun-logger)
![NPM Downloads](https://img.shields.io/npm/d18m/%40bejibun%2Flogger)
![GitHub issues](https://img.shields.io/github/issues/Bejibun-Framework/bejibun-logger)
![GitHub](https://img.shields.io/github/license/Bejibun-Framework/bejibun-logger)
![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/Bejibun-Framework/bejibun-logger?display_name=tag&include_prereleases)

</div>

# Logger
A beauty logger for your Apps.

## Usage

### Installation
Install the package.

```bash
# Using Bun
bun add @bejibun/logger

# Using Bejibun
bun ace install @bejibun/logger
```

### How to Use
How to use the package.

```ts
import Logger from "@bejibun/logger";

// Default
Logger.debug("This is DEBUG message."); // 2025-10-16 16:00:00.000 [DEBUG]: This is DEBUG message.
Logger.error("This is ERROR message."); // 2025-10-16 16:00:00.000 [ERROR]: This is ERROR message.
Logger.info("This is INFO message."); // 2025-10-16 16:00:00.000 [INFO]: This is INFO message.
Logger.warn("This is WARN message."); // 2025-10-16 16:00:00.000 [WARN]: This is WARN message.

// With Context
Logger.setContext("Exception").error("Error with Context."); // 2025-10-16 16:00:00.000 [Exception]: Error with Context.

// Others
Logger.empty(); // such as <br/>
Logger.separator(); // --------------------- until end of terminal width
```

## ☕ Support / Donate

If you find this project helpful and want to support it:

[![Donate](https://img.shields.io/badge/Donate-Support%20Me-orange?style=for-the-badge)](https://donate.bejibun.com)

Or you can buy this `$BJBN (Bejibun)` tokens [here](https://pump.fun/coin/CQhbNnCGKfDaKXt8uE61i5DrBYJV7NPsCDD9vQgypump).