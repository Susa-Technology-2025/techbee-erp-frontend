import {ActualStartDateField} from "./DatesSectionFields"
import {ActualEndDateField} from "./DatesSectionFields"
import {PlannedStartDateField} from "./DatesSectionFields"
import {PlannedEndDateField} from "./DatesSectionFields"
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
      <ActualStartDateField/>
<ActualEndDateField/>
<PlannedStartDateField/>
<PlannedEndDateField/>
      </Box>)
    }