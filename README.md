[![CI](https://github.com/ayapapa/date-formatter-js/actions/workflows/ci.yml/badge.svg)](https://github.com/ayapapa/date-formatter-js/actions/workflows/ci.yml)
# date-formatter-js
A lightweight date and time formatter designed for log and console output. 
The formatting specifications are inspired by C# Custom Date and Time Format Strings.

## Installation
```bash
npm install @ayapapa-npm/date-formatter-js
```
## Interface
DateFormatter.format(date: Date = new Date(), pattern: string = "yyyy/MM/dd HH:mm:ss.fff");

## Pattern specification element
| Token  | Meaning                 |
| ------ | ----------------------- |
| `yyyy` | 4-digit year            |
| `yy`   | 2-digit year            |
| `MM`   | 2-digit month           |
| `M`    | month                   |
| `dd`   | 2-digit day             |
| `d`    | day                     |
| `HH`   | 2-digit hour (24-hour)  |
| `H`    | hour (24-hour)          |
| `mm`   | 2-digit minute          |
| `m`    | minute                  |
| `ss`   | 2-digit second          |
| `s`    | second                  |
| `fff`  | milliseconds (3 digits) |
| `ff`   | milliseconds (2 digits) |
| `f`    | milliseconds (1 digit)  |

## Usage

```ts
import { DateFormatter } from '@ayapapa-npm/date-formatter-js';

function outputDate(date: Date): void {
  const pattern: string = "yyyy/MM/dd HH:mm:ss.fff";
  const datetimeStr: string = DateFormatter.format(
    date,
    pattern
  );
  console.log('Datetime:', datetimeStr);
}

function main(): void {
  outputDate(new Date(2026, 7, 11, 12, 34, 56, 789)); // Datetime: "2026/08/11 12:34:56.789"
}
```
