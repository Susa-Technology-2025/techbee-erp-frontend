import React, { useState, useRef, useEffect } from "react";
import {
  TextField,
  Box,
  Chip,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ClickAwayListener,
  ListItemButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { parse } from "mathjs";

interface DictionaryItem {
  key: string;
  description: string;
}

interface FormulaInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  dictionaries: DictionaryItem[];
  label?: string;
  placeholder?: string;
  multiline?: boolean;
  minRows?: number;
  editProps?: any;
  viewProps?: any;
}

// Mathematical operators allowed
const ALLOWED_OPERATORS = [
  "+",
  "-",
  "*",
  "/",
  "(",
  ")",
  "%",
  "^",
  "=",
  "<",
  ">",
  "<=",
  ">=",
  "!=",
  "&&",
  "||",
];

// Custom styled TextField
const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    fontFamily: "monospace",
    fontSize: "0.875rem",
    "& input": {
      fontFamily: "monospace",
    },
    "& textarea": {
      fontFamily: "monospace",
    },
  },
}));

const FormulaInputField: React.FC<FormulaInputFieldProps> = ({
  value,
  onChange,
  dictionaries,
  label = "Formula",
  placeholder = "Enter formula using available variables...",
  multiline = false,
  minRows = 1,
  editProps = {},
  viewProps = {},
}) => {
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<
    DictionaryItem[]
  >([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ---------------- Formula Validation ----------------
  const validateFormula = (formula: string) => {
    const allowedKeys = dictionaries.map((d) => d.key.toUpperCase());
    try {
      const node = parse(formula);

      node.traverse((n: any) => {
        if (n.isSymbolNode) {
          if (!allowedKeys.includes(n.name.toUpperCase())) {
            throw new Error(`Invalid variable: ${n.name}`);
          }
        }
      });

      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (value.trim() !== "") {
      validateFormula(value);
    } else {
      setError("");
    }
  }, [value, dictionaries]);

  // ---------------- Suggestions Logic ----------------
  const getCurrentWord = (
    text: string,
    position: number,
  ): { word: string; start: number; end: number } => {
    const beforeCursor = text.slice(0, position);
    const afterCursor = text.slice(position);

    const wordStart = beforeCursor.search(/[a-zA-Z_][a-zA-Z0-9_]*$/);
    const wordEnd = afterCursor.search(/[^a-zA-Z0-9_]/);

    const start = wordStart >= 0 ? wordStart : position;
    const end = wordEnd >= 0 ? position + wordEnd : text.length;
    const word = text.slice(start, end);

    return { word, start, end };
  };

  const filterSuggestions = (word: string) => {
    if (!word) {
      setFilteredSuggestions([]);
      return;
    }

    const filtered = dictionaries.filter(
      (item) =>
        item.key.toLowerCase().includes(word.toLowerCase()) ||
        item.description.toLowerCase().includes(word.toLowerCase()),
    );
    setFilteredSuggestions(filtered);
    setSuggestionIndex(0);
  };

  const insertSuggestion = (suggestion: DictionaryItem) => {
    const { word, start, end } = getCurrentWord(value, cursorPosition);
    const newValue = value.slice(0, start) + suggestion.key + value.slice(end);
    onChange(newValue);

    const newPosition = start + suggestion.key.length;
    setCursorPosition(newPosition);

    setTimeout(() => {
      if (multiline && textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newPosition, newPosition);
      } else if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(newPosition, newPosition);
      }
    }, 0);

    setShowSuggestions(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (showSuggestions && filteredSuggestions.length > 0) {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setSuggestionIndex((prev) =>
            prev < filteredSuggestions.length - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setSuggestionIndex((prev) =>
            prev > 0 ? prev - 1 : filteredSuggestions.length - 1,
          );
          break;
        case "Enter":
        case "Tab":
          event.preventDefault();
          insertSuggestion(filteredSuggestions[suggestionIndex]);
          break;
        case "Escape":
          setShowSuggestions(false);
          break;
      }
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newValue = event.target.value;
    const newPosition = event.target.selectionStart || 0;

    const allowedPattern = /^[a-zA-Z0-9_+\-*/()%^=<>&|!\s]*$/;
    if (!allowedPattern.test(newValue)) {
      return;
    }

    onChange(newValue);
    setCursorPosition(newPosition);

    const { word } = getCurrentWord(newValue, newPosition);
    if (word.length >= 1) {
      filterSuggestions(word);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleClick = () => {
    const { word } = getCurrentWord(value, cursorPosition);
    if (word.length >= 1) {
      filterSuggestions(word);
      setShowSuggestions(true);
    }
  };

  const handleCursorChange = (
    event: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newPosition =
      (event.target as HTMLInputElement | HTMLTextAreaElement).selectionStart ||
      0;
    setCursorPosition(newPosition);

    const { word } = getCurrentWord(value, newPosition);
    if (word.length >= 1) {
      filterSuggestions(word);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleClickAway = () => {
    setShowSuggestions(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: "relative" }}>
        <StyledTextField
          ref={multiline ? undefined : inputRef}
          inputRef={multiline ? undefined : inputRef}
          multiline={multiline}
          minRows={multiline ? minRows : undefined}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          onSelect={handleCursorChange}
          label={label}
          placeholder={placeholder}
          fullWidth
          size="small"
          error={!!error}
          helperText={
            error ||
            "Use available variables and mathematical operators (+, -, *, /, (, ), %, ^, =, <, >, <=, >=, !=, &&, ||)"
          }
          {...editProps}
        />

        {/* Suggestions */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <Paper
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 1300,
              maxHeight: 200,
              overflow: "auto",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              border: "1px solid #e0e0e0",
            }}
          >
            <List dense>
              {filteredSuggestions.map((suggestion, index) => (
                <ListItemButton
                  key={suggestion.key}
                  selected={index === suggestionIndex}
                  onClick={() => insertSuggestion(suggestion)}
                  sx={{
                    cursor: "pointer",
                    "&.Mui-selected": {
                      "&:hover": {
                        backgroundColor: "primary.main",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Chip
                          label={suggestion.key}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ fontSize: "0.7rem" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {suggestion.description}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        )}

        {/* Available Variables */}
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 600 }}
          >
            Available Variables:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
            {dictionaries.slice(0, 5).map((item) => (
              <Chip
                key={item.key}
                label={item.key}
                size="small"
                variant="outlined"
                onClick={() => {
                  const newValue =
                    value +
                    (value.endsWith(" ") || value === "" ? "" : " ") +
                    item.key;
                  onChange(newValue);
                }}
                sx={{ fontSize: "0.7rem", cursor: "pointer" }}
              />
            ))}
            {dictionaries.length > 5 && (
              <Chip
                label={`+${dictionaries.length - 5} more`}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem" }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </ClickAwayListener>
  );
};

export default FormulaInputField;
