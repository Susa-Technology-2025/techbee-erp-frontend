import {PlannedStartDateField} from "./ScheduleSectionFields"
import {PlannedEndDateField} from "./ScheduleSectionFields"
import {PredecessorsField} from "./ScheduleSectionFields"
import { Box } from "@mui/material";


export const ScheduleSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <PlannedStartDateField/>
<PlannedEndDateField/>
<PredecessorsField/>
      </Box>)
    }