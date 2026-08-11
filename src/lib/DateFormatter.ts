/**
 * Format elements
 **/
const formatters = {
  yyyy: (date: Date) => String(date.getFullYear()),
  yy:   (date: Date) => String(date.getFullYear()).slice(-2),

  MM:   (date: Date) => String(date.getMonth() + 1).padStart(2, "0"),
  M:    (date: Date) => String(date.getMonth() + 1),

  dd:   (date: Date) => String(date.getDate()).padStart(2, "0"),
  d:    (date: Date) => String(date.getDate()),

  HH:   (date: Date) => String(date.getHours()).padStart(2, "0"),
  H:    (date: Date) => String(date.getHours()),

  mm:   (date: Date) => String(date.getMinutes()).padStart(2, "0"),
  m:    (date: Date) => String(date.getMinutes()),

  ss:   (date: Date) => String(date.getSeconds()).padStart(2, "0"),
  s:    (date: Date) => String(date.getSeconds()),

  fff: (date: Date) => String(date.getMilliseconds()).padStart(3, "0"),
  ff:  (date: Date) => String(date.getMilliseconds()).padStart(3, "0").slice(0, 2),
  f:   (date: Date) => String(date.getMilliseconds()).padStart(3, "0").slice(0, 1),
} as const;

/** Format element type */
export type FmtType = keyof typeof formatters; 


/**
 * Date formatter:
 * A lightweight date and time formatter for JavaScript designed for log and console output, with specifications based on C# formatting rules.
 */
export class DateFormatter {

  /**
   * Get a formatted date-time string.
   * @param [date]    Date instance. Default is new Date().
   * @param [pattern] Format pattern. Default is "yyyy/MM/dd HH:mm:ss.fff".
   * @returns Formatted datetime string.
   */
  public static format(
    date: Date = new Date(),
    pattern: string = "yyyy/MM/dd HH:mm:ss.fff"
  ): string {
    return DateFormatter.getTokens(pattern)
      .map(part =>
        part.type === "token"
          ? formatters[part.value](date)
          : part.value
      )
      .join("");
  }

  private static tokenize(pattern: string): { type: string, value: FmtType }[] {
    const tokens = Object.keys(formatters)
      .sort((a, b) => b.length - a.length);

    const result = [];
    let i = 0;

    while (i < pattern.length) {
      const token = tokens.find(token =>
        pattern.startsWith(token, i)
      );

      if (token) {
        result.push({
          type: "token",
          value: token as FmtType
        });

        i += token.length;
      } else {
        result.push({
          type: "literal",
          value: pattern[i]  as FmtType
        });

        i++;
      }
    }

    return result;
  }

  /** Cached patterns */
  private static cache = new Map();

  private static getTokens(pattern: string): { type: string, value: FmtType }[] {
    let tokens = DateFormatter.cache.get(pattern);

    if (tokens === undefined) {
      tokens = DateFormatter.tokenize(pattern);
      DateFormatter.cache.set(pattern, tokens);
    }

    return tokens;
  }

}
