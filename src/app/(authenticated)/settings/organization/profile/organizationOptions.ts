// src/lib/constants/organizationOptions.ts
import dayjs from "dayjs";

export const timezoneOptions: string[] = [
  "UTC-12:00",
  "UTC-11:00",
  "UTC-10:00",
  "UTC-09:00",
  "UTC-08:00",
  "UTC-07:00",
  "UTC-06:00",
  "UTC-05:00",
  "UTC-04:00",
  "UTC-03:00",
  "UTC-02:00",
  "UTC-01:00",
  "UTC+00:00",
  "UTC+01:00",
  "UTC+02:00",
  "UTC+03:00",
  "UTC+04:00",
  "UTC+05:00",
  "UTC+06:00",
  "UTC+07:00",
  "UTC+08:00",
  "UTC+09:00",
  "UTC+10:00",
  "UTC+11:00",
  "UTC+12:00",
];

// Simplified locale options for the tenant config
export const localeOptions: string[] = [
  "en-US (English - United States)",
  "en-GB (English - United Kingdom)",
  "es-ES (Spanish - Spain)",
  "fr-FR (French - France)",
  "de-DE (German - Germany)",
];

// Fiscal year end date options (1st to 31st)
export const fiscalYearEndDayOptions: number[] = Array.from(
  { length: 31 },
  (_, i) => i + 1
);
