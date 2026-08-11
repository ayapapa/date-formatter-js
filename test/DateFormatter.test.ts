import { describe, it, expect, vi } from "vitest";
import { DateFormatter } from "../src/lib/DateFormatter"; // Adjust the file path as needed

describe("DateFormatter", () => {
  // Base date for testing: February 5, 2026, 09:04:03.012
  const testDate = new Date(2026, 1, 5, 9, 4, 3, 12);

  describe("format", () => {
    it("should format correctly with the default pattern", () => {
      // Default pattern: "yyyy/MM/dd HH:mm:ss.fff"
      const result = DateFormatter.format(testDate);
      expect(result).toBe("2026/02/05 09:04:03.012");
    });

    it("should correctly format years (yyyy, yy)", () => {
      expect(DateFormatter.format(testDate, "yyyy")).toBe("2026");
      expect(DateFormatter.format(testDate, "yy")).toBe("26");
    });

    it("should correctly format months (MM, M)", () => {
      expect(DateFormatter.format(testDate, "MM")).toBe("02");
      expect(DateFormatter.format(testDate, "M")).toBe("2");

      // Verify two-digit months (October and later)
      const octDate = new Date(2026, 9, 5);
      expect(DateFormatter.format(octDate, "MM")).toBe("10");
      expect(DateFormatter.format(octDate, "M")).toBe("10");
    });

    it("should correctly format days (dd, d)", () => {
      expect(DateFormatter.format(testDate, "dd")).toBe("05");
      expect(DateFormatter.format(testDate, "d")).toBe("5");

      // Verify two-digit days (10th and later)
      const lateDate = new Date(2026, 1, 15);
      expect(DateFormatter.format(lateDate, "dd")).toBe("15");
      expect(DateFormatter.format(lateDate, "d")).toBe("15");
    });

    it("should correctly format hours (HH, H)", () => {
      expect(DateFormatter.format(testDate, "HH")).toBe("09");
      expect(DateFormatter.format(testDate, "H")).toBe("9");

      // Verify two-digit hours (10 AM and later)
      const afternoonDate = new Date(2026, 1, 5, 15);
      expect(DateFormatter.format(afternoonDate, "HH")).toBe("15");
      expect(DateFormatter.format(afternoonDate, "H")).toBe("15");
    });

    it("should correctly format minutes (mm, m)", () => {
      expect(DateFormatter.format(testDate, "mm")).toBe("04");
      expect(DateFormatter.format(testDate, "m")).toBe("4");

      // Verify two-digit minutes (10 minutes and later)
      const lateMinDate = new Date(2026, 1, 5, 9, 45);
      expect(DateFormatter.format(lateMinDate, "mm")).toBe("45");
      expect(DateFormatter.format(lateMinDate, "m")).toBe("45");
    });

    it("should correctly format seconds (ss, s)", () => {
      expect(DateFormatter.format(testDate, "ss")).toBe("03");
      expect(DateFormatter.format(testDate, "s")).toBe("3");

      // Verify two-digit seconds (10 seconds and later)
      const lateSecDate = new Date(2026, 1, 5, 9, 4, 55);
      expect(DateFormatter.format(lateSecDate, "ss")).toBe("55");
      expect(DateFormatter.format(lateSecDate, "s")).toBe("55");
    });

    it("should correctly format milliseconds (fff, ff, f)", () => {
      // The base date millisecond is 12 (padded to 012)
      expect(DateFormatter.format(testDate, "fff")).toBe("012");
      expect(DateFormatter.format(testDate, "ff")).toBe("01");
      expect(DateFormatter.format(testDate, "f")).toBe("0");

      // Verify higher 3-digit millisecond values (987)
      const highMilliDate = new Date(2026, 1, 5, 9, 4, 3, 987);
      expect(DateFormatter.format(highMilliDate, "fff")).toBe("987");
      expect(DateFormatter.format(highMilliDate, "ff")).toBe("98");
      expect(DateFormatter.format(highMilliDate, "f")).toBe("9");
    });

    it("should output literal characters as they are", () => {
      const pattern = "yyyy-MM-dd [HH:mm:ss]";
      expect(DateFormatter.format(testDate, pattern)).toBe("2026-02-05 [09:04:03]");
    });

    it("should use the system current time when the first argument is omitted", () => {
      // Mock the current system time
      const mockDate = new Date(2026, 5, 20, 12, 0, 0);
      vi.useFakeTimers();
      vi.setSystemTime(mockDate);

      expect(DateFormatter.format()).toBe("2026/06/20 12:00:00.000");

      vi.useRealTimers();
    });

    it("should interpret tokens greedily even without delimiters", () => {
      expect(DateFormatter.format(testDate, "yyyyMMddHHmmssfff"))
        .toBe("20260205090403012");
    });

    it("should return an empty string for an empty pattern", () => {
      expect(DateFormatter.format(testDate, "")).toBe("");
    });

    it("should unknown strings remain as literals.", () => {
      expect(DateFormatter.format(testDate, "created_at=yyyy")).toBe("create5_at=2026");
    });

    it("should format boundary values with zero padding", () => {
      const date = new Date(2026, 0, 1, 0, 0, 0, 0);
      expect(DateFormatter.format(date)).toBe("2026/01/01 00:00:00.000");
    });
  });

  describe("Token Cache System", () => {
    it("should retrieve tokens from cache when the same pattern is called twice", () => {
      const pattern = "yyyy-MM-dd";
      
      // Cast to 'any' to spy on private methods and properties
      const formatterSpy = DateFormatter as any;
      const cacheSetSpy = vi.spyOn(formatterSpy.cache, "set");
      const tokenizeSpy = vi.spyOn(formatterSpy, "tokenize");

      // First call: 'tokenize' should be executed and tokens should be cached
      DateFormatter.format(testDate, pattern);
      expect(tokenizeSpy).toHaveBeenCalledTimes(1);
      expect(cacheSetSpy).toHaveBeenCalledWith(pattern, expect.any(Array));

      // Reset spy call counters
      tokenizeSpy.mockClear();

      // Second call: 'tokenize' should NOT be executed, reading directly from cache
      DateFormatter.format(testDate, pattern);
      expect(tokenizeSpy).not.toHaveBeenCalled();

      // Clean up spies
      cacheSetSpy.mockRestore();
      tokenizeSpy.mockRestore();
    });
  });
});
