import type { MarketStatus } from "@/lib/types";

/**
 * Compute NYSE holidays for any year using federal holiday rules.
 * Handles observed dates (Saturday→Friday, Sunday→Monday).
 */
function getNyseHolidays(year: number): Set<string> {
  const holidays: Date[] = [];

  // Helper: nth weekday of month (1-indexed)
  function nthWeekday(y: number, month: number, weekday: number, n: number): Date {
    const first = new Date(y, month, 1);
    const firstDay = first.getDay();
    const day = 1 + ((weekday - firstDay + 7) % 7) + (n - 1) * 7;
    return new Date(y, month, day);
  }

  // Helper: last weekday of month
  function lastWeekday(y: number, month: number, weekday: number): Date {
    const last = new Date(y, month + 1, 0); // last day of month
    const lastDay = last.getDay();
    const diff = (lastDay - weekday + 7) % 7;
    return new Date(y, month, last.getDate() - diff);
  }

  // Fixed-date holidays
  holidays.push(new Date(year, 0, 1));   // New Year's Day (Jan 1)
  holidays.push(new Date(year, 5, 19));  // Juneteenth (Jun 19)
  holidays.push(new Date(year, 6, 4));   // Independence Day (Jul 4)
  holidays.push(new Date(year, 11, 25)); // Christmas (Dec 25)

  // Floating holidays
  holidays.push(nthWeekday(year, 0, 1, 3));  // MLK Day: 3rd Monday of Jan
  holidays.push(nthWeekday(year, 1, 1, 3));  // Presidents' Day: 3rd Monday of Feb
  holidays.push(lastWeekday(year, 4, 1));    // Memorial Day: last Monday of May
  holidays.push(nthWeekday(year, 8, 1, 1));  // Labor Day: 1st Monday of Sep
  holidays.push(nthWeekday(year, 10, 4, 4)); // Thanksgiving: 4th Thursday of Nov

  // Good Friday: 2 days before Easter Sunday
  holidays.push(getGoodFriday(year));

  // Apply observed-date rules: Saturday→Friday, Sunday→Monday
  const result = new Set<string>();
  for (const h of holidays) {
    const day = h.getDay();
    if (day === 6) {
      h.setDate(h.getDate() - 1); // Saturday → Friday
    } else if (day === 0) {
      h.setDate(h.getDate() + 1); // Sunday → Monday
    }
    result.add(formatDateStr(h));
  }
  return result;
}

/**
 * Compute Easter Sunday using the Anonymous Gregorian algorithm.
 * Good Friday = Easter Sunday - 2 days.
 */
function getGoodFriday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-indexed
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  const easter = new Date(year, month, day);
  easter.setDate(easter.getDate() - 2); // Good Friday
  return easter;
}

function formatDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Cache holidays per year
const holidayCache = new Map<number, Set<string>>();
function getHolidays(year: number): Set<string> {
  if (!holidayCache.has(year)) {
    holidayCache.set(year, getNyseHolidays(year));
  }
  return holidayCache.get(year)!;
}

function isNyseHoliday(dateStr: string): boolean {
  const year = parseInt(dateStr.slice(0, 4));
  return getHolidays(year).has(dateStr);
}

function toET(date: Date): Date {
  return new Date(
    date.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
}

export function isMarketOpen(now?: Date): MarketStatus {
  const utcNow = now ?? new Date();
  const et = toET(utcNow);
  const day = et.getDay();
  const hours = et.getHours();
  const minutes = et.getMinutes();
  const timeMinutes = hours * 60 + minutes;
  const dateStr = formatDateStr(et);

  const isWeekend = day === 0 || day === 6;
  const isHoliday = isNyseHoliday(dateStr);

  // Calculate next open
  const nextOpen = new Date(et);
  if (isWeekend || isHoliday || timeMinutes >= 960) {
    // After 4 PM or closed day — next business day 9:30 AM
    nextOpen.setDate(nextOpen.getDate() + 1);
    while (
      nextOpen.getDay() === 0 ||
      nextOpen.getDay() === 6 ||
      isNyseHoliday(formatDateStr(nextOpen))
    ) {
      nextOpen.setDate(nextOpen.getDate() + 1);
    }
    nextOpen.setHours(9, 30, 0, 0);
  } else if (timeMinutes < 570) {
    // Before 9:30 AM
    nextOpen.setHours(9, 30, 0, 0);
  } else {
    nextOpen.setHours(9, 30, 0, 0);
  }

  if (isWeekend || isHoliday) {
    return { open: false, status: "market_closed", nextOpen };
  }

  // Pre-market: 4:00 AM - 9:30 AM ET
  if (timeMinutes >= 240 && timeMinutes < 570) {
    return { open: false, status: "pre_market", nextOpen };
  }

  // Market open: 9:30 AM - 4:00 PM ET
  if (timeMinutes >= 570 && timeMinutes < 960) {
    return { open: true, status: "market_open", nextOpen };
  }

  // After hours: 4:00 PM - 8:00 PM ET
  if (timeMinutes >= 960 && timeMinutes < 1200) {
    return { open: false, status: "after_hours", nextOpen };
  }

  return { open: false, status: "market_closed", nextOpen };
}
