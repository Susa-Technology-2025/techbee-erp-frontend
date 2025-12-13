import AddIcon from "@mui/icons-material/Add"
import { Button } from "@mui/material"
import { useState } from "react";
import ProjectCreationDialog from "../dialogs/ProjectCreationDialog";

export const NewProjectCreateButton = () => {
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const handleCreateTask = () => {
        setIsProjectModalOpen(true);
    };

    const handleProjectCreated = () => {
        setIsProjectModalOpen(false);
        alert('Project created successfully!');
    };
    return (
        <>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateTask}
                sx={{ bgcolor: '#4361ee', mt: 2 }}
            >
                create New Project
            </Button>


            <ProjectCreationDialog
                open={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
                onSuccess={handleProjectCreated}
            />
        </>
    )
}