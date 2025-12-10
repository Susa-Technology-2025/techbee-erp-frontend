import {
  Card,
  Typography,
  useTheme,
  Box,
  Dialog,
  DialogContent,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import { useState } from "react";
import { Task } from "./types";
import WbsItemForm from "../../wbsItems/_components/Form";
type AddCardProps = {
  columnId: string;
  onAddCard: (task: Omit<Task, "id">) => void;
  column: any;
  project: any;
};
export function AddCard({ column, project }: AddCardProps) {
  const theme = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsModalOpen(true);
  };
  const handleClose = () => {
    setIsModalOpen(false);
  };
  const modalContent = (
    <Dialog
      open={isModalOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <AppBar position="static" elevation={1} sx={{ bgcolor: "section.main" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Add New task
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
        <WbsItemForm
          formMode="create"
          defaultValues={{
            taskStage: { id: column.id, name: column.name },
            project: { id: project?.id, title: project?.title },
          }}
        />
      </DialogContent>
    </Dialog>
  );
  return (
    <>
      <Card
        elevation={0}
        sx={{
          cursor: "pointer",
          p: 2,
          "&:hover": {
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.action.hover,
            transform: "scale(1.02)",
          },
          transition: "all 0.2s ease-in-out",
          userSelect: "none",
        }}
        onClick={handleClick}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
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
          <Add fontSize="small" />
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              fontWeight: 500,
            }}
          >
            Add Task
          </Typography>
        </Box>
      </Card>
      {}
      {isModalOpen && modalContent}
    </>
  );
}
