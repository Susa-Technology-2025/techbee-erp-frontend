import {TaskStageColorField} from "./DetailsSectionFields"
import {TaskStageDescriptionField} from "./DetailsSectionFields"
import {TaskStageNotesField} from "./DetailsSectionFields"
import { Box } from "@mui/material";


export const DetailsSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <TaskStageColorField/>
<TaskStageDescriptionField/>
<TaskStageNotesField/>
      </Box>)
    }