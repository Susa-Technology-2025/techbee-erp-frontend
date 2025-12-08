import { useState, KeyboardEvent, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { Stack, InputAdornment, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

type ChipsFieldProps = {
  label: string;
  value: string[];
  onChange: (val: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  meta: any;
};

export default function ChipsField({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  error,
  helperText,
  required,
  meta,
}: ChipsFieldProps) {
  const [inputValue, setInputValue] = useState("");
  const position = useSelector((state: RootState) => state.position.position);
  const [disab, setDisab] = useState(false);

  useEffect(() => {
    if (meta.formRelated.staticAsync && position) {
      const values = position.qualifications?.map((val) => val.name);
      setDisab(position.isQualificationFixed);
      if (values) {
        onChange(values);
      }
    }
  }, [position]);

  const handleAddChip = () => {
    if (inputValue.trim() === "") return;
    onChange([...value, inputValue.trim()]);
    setInputValue("");
  };

  const handleDelete = (chipToDelete: string) => {
    onChange(value.filter((chip) => chip !== chipToDelete));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddChip();
    }
  };

  return (
    <Box>
      <TextField
        label={label}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || disab}
        error={error}
        helperText={helperText}
        required={required}
        variant="standard"
        fullWidth
        slotProps={{
          input: {
            endAdornment:
              inputValue.trim().length > 0 ? (
                <InputAdornment position="end">
                  <IconButton onClick={handleAddChip} edge="end">
                    <AddIcon />
                  </IconButton>
                </InputAdornment>
              ) : null,
          },
        }}
      />
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mt: 1 }}>
        {value.map((chip, idx) => (
          <Chip
            key={idx}
            label={chip}
            onDelete={() => handleDelete(chip)}
            disabled={disab}
            sx={{ mb: 1 }}
          />
        ))}
      </Stack>
    </Box>
  );
}
