import {PlannedCostField} from "./CostMetricsSectionFields"
import {ActualCostField} from "./CostMetricsSectionFields"
import { Box } from "@mui/material";


export const CostMetricsSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <PlannedCostField/>
<ActualCostField/>
      </Box>)
    }