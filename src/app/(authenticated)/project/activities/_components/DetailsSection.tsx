import {PercentCompleteField} from "./DetailsSectionFields"
import {ActualCostField} from "./DetailsSectionFields"
import {DueDateField} from "./DetailsSectionFields"
import {AssigneeEmployeeIdField} from "./DetailsSectionFields"
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
      <PercentCompleteField/>
<ActualCostField/>
<DueDateField/>
<AssigneeEmployeeIdField/>
      </Box>)
    }