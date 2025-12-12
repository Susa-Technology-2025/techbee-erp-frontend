import {
  Paper,
  Typography,
  useTheme,
  IconButton,
  Box,
  Dialog,
  AppBar,
  Toolbar,
  DialogContent,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import { useState } from "react";
import { Column } from "./types";
import TaskStageForm from "../../taskStages/_components/Form";
type AddColumnProps = {
  onAddColumn: (column: Omit<Column, "id">) => void;
  project: any;
};
export function AddColumn({ onAddColumn, project }: AddColumnProps) {
  const theme = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const handleClick = () => {
    setIsModalOpen(true);
  };
  const handleClose = () => {
    setIsModalOpen(false);
    setTitle("");
  };

  return (
    <>
      <Paper
        sx={{
          width: 320,
          minWidth: 300,
          height: "100%",
          maxHeight: 500,

          borderRadius: 2,
          p: 2,
          cursor: "pointer",
          backgroundColor: theme.palette.background.paper,
          "&:hover": {
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.action.hover,
            boxShadow: theme.shadows[2],
          },
          transition: "all 0.2s ease-in-out",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={handleClick}
        elevation={0}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            color: theme.palette.text.secondary,
            "&:hover": {
              color: theme.palette.primary.main,
            },
          }}
        >
          <Add fontSize="medium" />
          <Typography
            variant="h6"
            sx={{
              mt: 1,
              fontWeight: 600,
            }}
          >
            Add Column
          </Typography>
        </Box>
      </Paper>

      <Dialog
        open={isModalOpen}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        fullScreen={false}
      >
        <AppBar
          position="static"
          elevation={1}
          sx={{ bgcolor: "section.main" }}
        >
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Add New Stage
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent sx={{ p: 0, m: 0 }}>
          <TaskStageForm
            formMode="create"
            defaultValues={{
              setField: {
                id: project?.taskStageSet?.id,
                name: project?.taskStageSet?.name,
              },
            }}
            invalidateQueryKey={[
              "data",
              `https://api.techbee.et/api/project/taskStages?where[setField][id]=${project?.taskStageSet?.id}`,
            ]}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
