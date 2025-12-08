import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { Project } from "./schema";

interface SearchProjectProps {
  projects: Project[];
  selectedProject?: Project | null;
  onProjectSelect: (project: Project | null) => void;
  placeholder?: string;
  width?: number | string;
}

const SearchProject: React.FC<SearchProjectProps> = ({
  projects,
  selectedProject,
  onProjectSelect,
  placeholder = "Search projects...",
  width = 400,
}) => {
  return (
    <Autocomplete
      options={projects}
      getOptionLabel={(option) => `${option.code} - ${option.title}`}
      value={selectedProject}
      onChange={(event, newValue) => {
        onProjectSelect(newValue);
      }}
      sx={{ width }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={placeholder}
          variant="outlined"
          size="small"
        />
      )}
    />
  );
};

export default SearchProject;
