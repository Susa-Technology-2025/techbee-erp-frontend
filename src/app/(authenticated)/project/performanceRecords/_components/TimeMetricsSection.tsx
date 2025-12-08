import {PlannedHoursField} from "./TimeMetricsSectionFields"
import {ActualHoursField} from "./TimeMetricsSectionFields"
import { Box } from "@mui/material";


export const TimeMetricsSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <PlannedHoursField/>
<ActualHoursField/>
      </Box>)
    }