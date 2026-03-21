import type { MarketStatus } from "@/lib/types";

// 2026 NYSE holidays
const NYSE_HOLIDAYS_2026 = [
  "2026-01-01", // New Year's Day
  "2026-01-19", // MLK Jr. Day
  "2026-02-16", // Presidents' Day
  "2026-04-03", // Good Friday
  "2026-05-25", // Memorial Day
  "2026-06-19", // Juneteenth
  "2026-07-03", // Independence Day (observed)
  "2026-09-07", // Labor Day
  "2026-11-26", // Thanksgiving
  "2026-12-25", // Christmas
];

function toET(date: Date): Date {
  return new Date(
    date.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
}

export function isMarketOpen(now?: Date): MarketStatus {
  const utcNow = now || new Date();
  const et = toET(utcNow);
  const day = et.getDay();
  const hours = et.getHours();
  const minutes = et.getMinutes();
  const timeMinutes = hours * 60 + minutes;
  const dateStr = et.toISOString().split("T")[0];

  const isWeekend = day === 0 || day === 6;
  const isHoliday = NYSE_HOLIDAYS_2026.includes(dateStr);

  // Calculate next open
  const nextOpen = new Date(et);
  if (isWeekend || isHoliday || timeMinutes >= 960) {
    // After 4 PM or closed day — next business day 9:30 AM
    nextOpen.setDate(nextOpen.getDate() + 1);
    while (
      nextOpen.getDay() === 0 ||
      nextOpen.getDay() === 6 ||
      NYSE_HOLIDAYS_2026.includes(nextOpen.toISOString().split("T")[0])
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
