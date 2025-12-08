import React, { useState } from "react";
import {
  IconButton,
  Dialog,
  DialogContent,
  AppBar,
  Toolbar,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { Add, Delete, Edit, Close } from "@mui/icons-material";
import Form from "./Form";
import { DeleteButton } from "./TableTopToolbarDeleteButton";
interface CustomTopToolbarActionsProps {
  table: any;
  apiEndPoint: string;
  defaultValues: any;
  invalidateQueryKey: string[];
}
export function CustomTopToolbarActions({
  table,defaultValues,invalidateQueryKey
}: CustomTopToolbarActionsProps) {
  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState<string | null>(null);
  const theme = useTheme();
  const selectedRow = table.getSelectedRowModel().rows[0]?.original;
  const hasRow = !!selectedRow;
  const actionsConfig = [
    {
      type: "create",
      icon: <Add />,
      getContent: () => <Form formMode="create" defaultValues={defaultValues} invalidateQueryKey={invalidateQueryKey}/>,
      show: true,
      title: "Create New Item",
      color: "success",
    },
    {
      type: "edit",
      icon: <Edit />,
      getContent: () => <Form formMode="edit" defaultValues={selectedRow} invalidateQueryKey={invalidateQueryKey} />,
      show: hasRow,
      title: "Edit Item",
      color: "primary",
    },
    {
      type: "delete",
      icon: <Delete />,
      getContent: () => (
        <DeleteButton
          onClick={() => setOpen(false)}
          invalidateQueryKey={invalidateQueryKey}
          deleteEndPoint={`https://api.techbee.et/api/project/projectContracts/${selectedRow?.id}`}
        />
      ),
      show: hasRow,
      title: "Delete Item",
      color: "error",
    },
  ];
  const handleOpen = (type: string) => {
    setActionType(type);
    setOpen(true);
  };
  const currentAction = actionsConfig.find((a) => a.type === actionType);
  return (
    <>
      {actionsConfig
        .filter((a) => a.show)
        .map((a) => (
          <IconButton key={a.type} onClick={() => handleOpen(a.type)}>
            {a.icon}
          </IconButton>
        ))}
      {currentAction && (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth={"lg"}
          fullWidth
        >
          <AppBar
            position="static"
            elevation={1}
            sx={{
              backgroundColor: "background.paper",
              color: "text.primary",
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              backgroundImage: "none",
            }}
          >
            <Toolbar>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, fontWeight: 600 }}
              >
                {currentAction.title}
              </Typography>
              <IconButton
                edge="end"
                onClick={() => setOpen(false)}
                sx={{
                  color: "text.primary",
                  backgroundColor: alpha(theme.palette.text.primary, 0.04),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.text.primary, 0.08),
                    transform: "rotate(90deg)",
                  },
                  transition: "all 0.3s ease-in-out",
                  width: 40,
                  height: 40,
                }}
              >
                <Close />
              </IconButton>
            </Toolbar>
          </AppBar>
          <DialogContent
            sx={{
              p: 0,
              backgroundColor: "background.default",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {currentAction.getContent()}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}