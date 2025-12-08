"use client";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  List,
  ListItem,
  Box,
  Chip,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { ErrorOutline } from "@mui/icons-material";
interface FormError {
  path: string;
  message: string;
}
export const FormResolverErrors = () => {
  const {
    formState: { errors },
  } = useFormContext();
  console.log(JSON.stringify(errors));
  const [open, setOpen] = useState(false);
  const extractErrors = (obj: any, path = ""): FormError[] => {
    const errors: FormError[] = [];
    for (const key in obj) {
      const currentPath = path ? `${path}.${key}` : key;
      if (obj[key]?.message) {
        errors.push({
          path: currentPath,
          message: obj[key].message,
        });
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        errors.push(...extractErrors(obj[key], currentPath));
      }
    }
    return errors;
  };
  const formErrors = extractErrors(errors);
  if (!formErrors.length) return null;
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
///
const formatFieldPath = path=>{return path.split(".").map(part=>{if(/^\d+$/.test(part)){return`[${parseInt(part)+1}]`}return part.replace(/([A-Z])/g," $1").replace(/^./,str=>str.toUpperCase()).trim()}).join(" \u2192 ").replace(/→ \[/g,"[").replace(/\s+/g," ")}
  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        onClick={handleOpen}
        sx={{ cursor: "pointer" }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            label={formErrors.length}
            size="small"
            color="error"
            variant="filled"
          />
          <Typography variant="caption" color="text.secondary">
            Click to view Errors
          </Typography>
        </Box>
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderBottom: "1px solid",
            borderColor: "divider",
            pb: 2,
          }}
        >
          <ErrorOutline color="error" />
          Form Validation Errors ({formErrors.length})
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <List dense>
            {formErrors.map((error, idx) => (
              <ListItem
                key={idx}
                sx={{
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  py: 2,
                  "&:last-child": { borderBottom: "none" },
                }}
              >
                <Typography
                  variant="body2"
                  component="div"
                  sx={{ width: "100%" }}
                >
                  <Typography
                    fontWeight="medium"
                    color="error.main"
                    sx={{
                      fontSize: "0.9rem",
                      mb: 0.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: "error.main",
                        display: "inline-block",
                      }}
                    />
                    {formatFieldPath(error.path)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.85rem",
                      color: "text.secondary",
                      pl: 2,
                    }}
                  >
                    {error.message}
                  </Typography>
                </Typography>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};