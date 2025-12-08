import {PlannedCompletionDateField} from "./DatesSectionFields"
import {ActualCompletionDateField} from "./DatesSectionFields"
import { Box } from "@mui/material";


export const DatesSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <PlannedCompletionDateField/>
<ActualCompletionDateField/>
      </Box>)
    }