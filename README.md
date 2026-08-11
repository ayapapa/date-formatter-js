# date-formatter-js
A lightweight date/time formatter for JavaScript, designed for logging and console output.<br> This is a date formatter based on C# formatting conventions.

## Installation
```bash
npm install @ayapapa-npm/date-formatter-js
```
## Interface
DateFomatter.format(date: Date = new Date(), pattern: string = "yyyy/MM/dd HH:mm:ss.fff");

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
```
import { DateFomatter } from '@ayapapa-npm/date-formatter-js';
// CommonJS:
// const { DateFomatter } = require('@ayapapa-npm/date-formatter-js');

function outputDate(date = new Date) {
  const pattern = "yyyy/MM/dd HH:mm:ss.fff";
  const datetimeStr = DateFomatter.format(date, pattern);
  console.log('Datetime:', datetimeStr); 
}
```
