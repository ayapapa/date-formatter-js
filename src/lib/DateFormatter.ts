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
type FmtType = keyof typeof formatters; 

/** Definition of elements extracted by parsing `pattern` */
type ParsedPart = { type: "token"; value: FmtType } | { type: "literal"; value: string };

/**
 * A lightweight date and time formatter designed for log and console output.
 * The formatting specifications are inspired by C# Custom Date and Time Format Strings.
 */
export class DateFormatter {

  /**
   * Returns a formatted date-time string based on the specified pattern.
   * 
   * @param date - The Date instance to format.
   * @param pattern - The format pattern string containing tokens (e.g., "yyyy", "MM").
   * @returns The formatted date-time string.
   * 
   * @default date `new Date()`
   * @default pattern `"yyyy/MM/dd HH:mm:ss.fff"`
   * 
   * @example
   * DateFormatter.format(new Date(2026, 7, 11), "yyyy-MM-dd"); // "2026-08-11"
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

  /**
   * Tokenizes the format pattern into individual format tokens and literal characters.
   * 
   * @internal
   * @param pattern - The format pattern string to tokenize.
   * @returns An array of parsed token objects containing the type and token/literal value.
   */
  private static tokenize(pattern: string): ParsedPart[] {
    const tokens = (Object.keys(formatters) as FmtType[])
      .sort((a, b) => b.length - a.length);

    const result: ParsedPart[] = [];
    let i = 0;

    while (i < pattern.length) {
      const token = tokens.find(token =>
        pattern.startsWith(token, i)
      );

      if (token) {
        result.push({
          type: "token",
          value: token
        });

        i += token.length;
      } else {
        result.push({
          type: "literal",
          value: pattern[i] 
        });

        i++;
      }
    }

    return result;
  }

  /** Cache store for parsed patterns to optimize performance. */
  private static cache = new Map<string, ParsedPart[]>();

  /**
   * Retrieves parsed tokens from the cache, or tokenizes and caches the pattern if not found.
   * 
   * @internal
   * @param pattern - The format pattern string.
   * @returns An array of parsed token objects.
   */
  private static getTokens(pattern: string): ParsedPart[] {
    let tokens = DateFormatter.cache.get(pattern);

    if (tokens === undefined) {
      tokens = DateFormatter.tokenize(pattern);
      DateFormatter.cache.set(pattern, tokens);
    }

    return tokens;
  }

}
