import {DurationDaysField} from "./ScheduleSectionFields"
import {ActualCompletionDateField} from "./ScheduleSectionFields"
import {PlannedStartDateField} from "./ScheduleSectionFields"
import {PlannedEndDateField} from "./ScheduleSectionFields"
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
      <DurationDaysField/>
<ActualCompletionDateField/>
<PlannedStartDateField/>
<PlannedEndDateField/>
      </Box>)
    }