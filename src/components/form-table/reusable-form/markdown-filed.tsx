"use client";

import { Box, InputLabel } from "@mui/material";
import MDEditor from "@uiw/react-md-editor";

type MarkdownFieldProps = {
  label: string;
  value?: string;
  onChange: (val: string | undefined) => void;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
};

export default function MarkdownField({
  label,
  value,
  onChange,
  helperText,
  error,
  disabled,
}: MarkdownFieldProps) {
  return (
    <Box
      data-color-mode="light"
      sx={{
        width: "100% !important",
        gridColumn: "1 / -1", // forces spanning all grid columns
      }}
    >
      <InputLabel shrink>{label}</InputLabel>

      <MDEditor
        value={value ?? ""}
        onChange={onChange}
        contentEditable={false}
        preview="live"
        hideToolbar={disabled}
        style={{ width: "100%" }}
      />

      {helperText && (
        <p
          style={{
            color: error ? "red" : "gray",
            fontSize: "0.75rem",
            marginTop: "4px",
          }}
        >
          {helperText}
        </p>
      )}
    </Box>
  );
}
