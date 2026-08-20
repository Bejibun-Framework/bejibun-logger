# Changelog
All notable changes to this project will be documented in this file.

---

## [v0.1.23](https://github.com/Bejibun-Framework/bejibun-logger/compare/v0.1.17...v0.1.23) - 2026-08-20

### 🩹 Fixes

### 📖 Changes
#### Tooling
- Added `prettier` + `.prettierrc.json` / `.prettierignore` and an `eslint.config.js` (flat config, `typescript-eslint`) for consistent formatting/linting across `src`
- Added `bun run format`, `bun run eslint`, and `bun run lint` scripts; `bun run build` now runs `lint` before compiling
- `alias` script now runs `tsc-alias` directly instead of via `bunx`

### 📦 Dependencies

- Bumped `tsc-alias` (devDependency) from `^1.8.16` to `^1.9.2`
- Added `@eslint/js` (devDependency) `^10.0.1`
- Added `eslint` (devDependency) `^10.8.1`
- Added `eslint-config-prettier` (devDependency) `^10.1.8`
- Added `globals` (devDependency) `^17.11.0`
- Added `prettier` (devDependency) `^3.9.6`
- Added `typescript` (devDependency) `^6.0.3`
- Added `typescript-eslint` (devDependency) `^8.67.0`

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-logger/blob/master/CHANGELOG.md

---

## [v0.1.17](https://github.com/Bejibun-Framework/bejibun-logger/compare/v0.1.16...v0.1.17) - 2025-10-20

### 🩹 Fixes

### 📖 Changes
What's New :
- Support `.trace()` for nullable params

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-logger/blob/master/CHANGELOG.md

---

## [v0.1.16](https://github.com/Bejibun-Framework/bejibun-logger/compare/v0.1.14...v0.1.16) - 2025-10-19

### 🩹 Fixes

### 📖 Changes
What's New :
- Adding `.empty()` for empty logs such as `<br/>`

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-logger/blob/master/CHANGELOG.md

---

## [v0.1.14](https://github.com/Bejibun-Framework/bejibun-logger/compare/v0.1.13...v0.1.14) - 2025-10-18

### 🩹 Fixes

### 📖 Changes
What's New :
- Adding `.trace()` for error logs

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-logger/blob/master/CHANGELOG.md

---

## [v0.1.13](https://github.com/Bejibun-Framework/bejibun-logger/compare/v0.1.12...v0.1.13) - 2025-10-15

### 🩹 Fixes
- Adding export default from root package

### 📖 Changes

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-logger/blob/master/CHANGELOG.md

---

## [v0.1.12](https://github.com/Bejibun-Framework/bejibun-logger/compare/v0.1.0...v0.1.12) - 2025-10-15

### 🩹 Fixes

### 📖 Changes
What's New :
- Adding `setContext` to override default type

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-logger/blob/master/CHANGELOG.md

---

## [v0.1.0](https://github.com/Bejibun-Framework/bejibun-logger/compare/v0.1.0...v0.1.0) - 2025-10-15

### 🩹 Fixes

### 📖 Changes
What's New :
- Adding logger for terminal console

Available Logs :
- `debug` Detailed debug info
- `error` Runtime errors
- `info` Informational messages
- `warn` Non-critical issues
- `separator` Separator terminal console

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-logger/blob/master/CHANGELOG.md