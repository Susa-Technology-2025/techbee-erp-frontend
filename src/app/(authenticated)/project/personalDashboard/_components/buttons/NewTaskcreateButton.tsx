import AddIcon from "@mui/icons-material/Add"
import { Button } from "@mui/material"
import { useState } from "react";
import TaskCreationDialog from "../dialogs/taskDialog";

export const NewTaskCreateButton = () => {
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const handleCreateTask = () => {
        setIsTaskModalOpen(true);
    };

    const handleTaskCreated = () => {
        setIsTaskModalOpen(false);
        alert('Task created successfully!');
    };
    return (
        <>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateTask}
                sx={{ bgcolor: '#4361ee', mt: 2 }}
            >
                create New Task
            </Button>


            <TaskCreationDialog
                open={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onSuccess={handleTaskCreated}
            />
        </>
    )
}