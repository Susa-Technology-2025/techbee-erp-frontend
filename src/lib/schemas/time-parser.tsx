import { Chip, Tooltip } from "@mui/material";
import { format } from "date-fns";
import { isValid, parse } from "date-fns";
import { z } from "zod";

export const parseTimeForPicker = (val: unknown): Date | null => {
  if (val instanceof Date && isValid(val)) return val;

  if (typeof val === "string") {
    let date = new Date(val);
    if (isValid(date)) return date;

    date = parse(val, "HH:mm", new Date());
    if (isValid(date)) return date;
  }

  return null;
};

export const parseDateForPicker = (val: unknown): Date | null => {
  if (val instanceof Date && isValid(val)) return val;

  if (typeof val === "string") {
    let date = new Date(val);
    if (isValid(date)) return date;

    date = parse(val, "yyyy-MM-dd", new Date());
    if (isValid(date)) return date;

    date = parse(val, "MM/dd/yyyy", new Date());
    if (isValid(date)) return date;
  }

  return null;
};

export const parseDateTimeForPicker = (val: unknown): Date | null => {
  if (val instanceof Date && isValid(val)) return val;

  if (typeof val === "string") {
    let date = new Date(val);
    if (isValid(date)) return date;

    date = parse(val, "yyyy-MM-dd'T'HH:mm", new Date());
    if (isValid(date)) return date;

    date = parse(val, "MM/dd/yyyy HH:mm", new Date());
    if (isValid(date)) return date;
  }

  return null;
};

export const preprocessedTime = z.preprocess(parseTimeForPicker, z.date());

export const preprocessedDate = z.preprocess(parseDateForPicker, z.date());

export const preprocessedDateTime = z.preprocess(
  parseDateTimeForPicker,
  z.date()
);

export const dateCell = ({ cell }: any) => {
  const date = cell.getValue();
  if (!date) return <Chip label="-" size="small" />;

  const d = date instanceof Date ? date : new Date(date);
  const formatted = format(d, "PP");

  return (
    <Tooltip title={format(d, "PP")} arrow>
      <Chip
        label={formatted}
        onClick={() => null}
        size="small"
        sx={{
          bgcolor: "backgroundSection.main",
          color: "backgroundSection.contrastText",
        }}
      />
    </Tooltip>
  );
};

export const timeCell = ({ cell }: any) => {
  const date = cell.getValue();
  if (!date) return <Chip label="-" size="small" />;

  const d = date instanceof Date ? date : new Date(date);
  const formatted = format(d, "hh:mm a");

  return (
    <Tooltip title={formatted} arrow>
      <Chip
        label={formatted}
        onClick={() => null}
        size="small"
        sx={{
          bgcolor: "backgroundSection.main",
          color: "backgroundSection.contrastText",
        }}
      />
    </Tooltip>
  );
};
